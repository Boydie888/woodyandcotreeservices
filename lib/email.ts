import { site } from "@/config/site";
import { serviceOptions } from "@/config/services";
import type { QuoteInput } from "./validation";

/**
 * Email delivery via Resend's REST API (no SDK = no extra dependency).
 * To use a different provider, replace `sendQuoteEmail` — nothing else
 * in the project depends on Resend.
 */

export type EmailConfig = { apiKey: string; to: string; from: string };

export function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.QUOTE_TO_EMAIL?.trim();
  const from = process.env.QUOTE_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

export function missingEmailVars(): string[] {
  return ["RESEND_API_KEY", "QUOTE_TO_EMAIL", "QUOTE_FROM_EMAIL"].filter(
    (k) => !process.env[k]?.trim(),
  );
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Remove CR/LF so user input can never inject email headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const contactLabel = (m: QuoteInput["contactMethod"]) =>
  m === "phone" ? "Phone" : m === "email" ? "Email" : "No preference";

export function buildQuoteEmail(input: QuoteInput) {
  const serviceLabel = serviceOptions.find((s) => s.id === input.service)?.label ?? input.service;
  const rows: [string, string][] = [
    ["Name", input.name],
    ["Phone", input.phone],
    ["Email", input.email],
    ["Suburb / postcode", input.location],
    ["Service", serviceLabel],
    ["Preferred contact", contactLabel(input.contactMethod)],
    ["Job description", input.description || "(none provided)"],
  ];

  const subject = oneLine(`New quote request: ${serviceLabel} — ${input.name}`).slice(0, 200);

  const text =
    `New quote request from the ${site.shortName} website\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nReply directly to this email to respond to the customer.`;

  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;color:#252925;max-width:560px">` +
    `<h2 style="color:#183D2B;margin:0 0 16px">New quote request</h2>` +
    `<table style="border-collapse:collapse;width:100%">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;color:#6B726C;white-space:nowrap">${esc(k)}</td>` +
          `<td style="padding:8px 0;vertical-align:top;white-space:pre-wrap">${esc(v)}</td></tr>`,
      )
      .join("") +
    `</table>` +
    `<p style="color:#6B726C;font-size:13px;margin-top:20px">Reply directly to this email to respond to the customer.</p></div>`;

  return { subject, text, html };
}

export async function sendQuoteEmail(
  input: QuoteInput,
  config: EmailConfig,
): Promise<{ ok: true } | { ok: false; status?: number }> {
  const { subject, text, html } = buildQuoteEmail(input);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: input.email,
        subject,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
