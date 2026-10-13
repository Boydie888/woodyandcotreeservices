import { getEmailConfig, missingEmailVars, sendQuoteEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { turnstileEnabled, verifyTurnstile } from "@/lib/turnstile";
import { parseQuoteInput, validateQuote } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 2000; // a human can't complete the form faster than this

type Body = { ok: boolean; message?: string; fieldErrors?: Record<string, string> };

function json(body: Body, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Reject cross-site browser posts. Non-browser clients (no Origin) are still rate limited. */
function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return json({ ok: false, message: "Request not allowed." }, 403);
  }

  const ip = clientIp(request);
  const limit = rateLimit(`quote:${ip}`);
  if (!limit.allowed) {
    return json(
      { ok: false, message: "Too many requests. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(limit.retryAfterSec) },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json({ ok: false, message: "Your message is too long." }, 413);
    }
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, message: "We couldn't read that request. Please try again." }, 400);
  }

  const extras = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  // Honeypot: real visitors never see or fill this field. Bots get a quiet "success"
  // so they don't learn to adapt — but nothing is sent.
  if (typeof extras.company_website === "string" && extras.company_website.trim() !== "") {
    return json({ ok: true });
  }

  const elapsed = typeof extras.elapsedMs === "number" ? extras.elapsedMs : 0;
  if (elapsed < MIN_FILL_MS) {
    return json({ ok: false, message: "Please wait a moment, then send your enquiry again." }, 400);
  }

  if (turnstileEnabled()) {
    const token = typeof extras.turnstileToken === "string" ? extras.turnstileToken : "";
    const human = await verifyTurnstile(token, ip);
    if (!human) {
      return json(
        { ok: false, message: "We couldn't confirm you're human. Refresh the check and try again." },
        400,
      );
    }
  }

  const input = parseQuoteInput(raw);
  const errors = validateQuote(input);
  if (Object.keys(errors).length > 0) {
    return json(
      { ok: false, message: "Please check the highlighted fields.", fieldErrors: errors as Record<string, string> },
      422,
    );
  }

  const config = getEmailConfig();
  if (!config) {
    // Never pretend the enquiry was sent when delivery isn't configured.
    console.error(
      `[quote] Email delivery is not configured. Missing: ${missingEmailVars().join(", ")}. See .env.example.`,
    );
    return json(
      {
        ok: false,
        message:
          "Online enquiries aren't available right now. Please contact us directly and we'll help.",
      },
      503,
    );
  }

  const result = await sendQuoteEmail(input, config);
  if (!result.ok) {
    console.error(`[quote] Email provider rejected or failed the send (status: ${result.status ?? "network"}).`);
    return json(
      {
        ok: false,
        message: "We couldn't send your enquiry. Please try again, or contact us directly.",
      },
      502,
    );
  }

  return json({ ok: true });
}

// Anything other than POST is not supported.
export function GET() {
  return json({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });
}
