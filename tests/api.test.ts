import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { POST, GET } from "../app/api/quote/route";
import { _resetRateLimitForTests } from "../lib/rate-limit";

const valid = {
  name: "Sam Taylor",
  phone: "0412 345 678",
  email: "sam@example.com",
  location: "Parramatta",
  service: "tree-removal",
  description: "Big gum <script>alert(1)</script> near the fence",
  contactMethod: "phone",
  company_website: "",
  elapsedMs: 15000,
};

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/quote", {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost:3000", "x-forwarded-for": "203.0.113.9", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const realFetch = globalThis.fetch;
let calls: { url: string; init: RequestInit }[] = [];

function mockFetch(ok: boolean) {
  calls = [];
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response("{}", { status: ok ? 200 : 500 });
  }) as typeof fetch;
}

function setEmailEnv(on: boolean) {
  for (const k of ["RESEND_API_KEY", "QUOTE_TO_EMAIL", "QUOTE_FROM_EMAIL", "TURNSTILE_SECRET_KEY"]) delete process.env[k];
  if (on) {
    process.env.RESEND_API_KEY = "re_test_123";
    process.env.QUOTE_TO_EMAIL = "owner@example.com";
    process.env.QUOTE_FROM_EMAIL = "Site <noreply@example.com>";
  }
}

beforeEach(() => {
  _resetRateLimitForTests();
  globalThis.fetch = realFetch;
  setEmailEnv(false);
});

test("when email isn't configured it returns 503 and never claims success", async () => {
  mockFetch(true);
  const res = await POST(req(valid));
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.equal(calls.length, 0);
});

test("valid enquiry is emailed server-side with the secret in a header only", async () => {
  setEmailEnv(true);
  mockFetch(true);
  const res = await POST(req(valid));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const headers = calls[0].init.headers as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer re_test_123");
  const sent = JSON.parse(String(calls[0].init.body));
  assert.deepEqual(sent.to, ["owner@example.com"]);
  assert.equal(sent.reply_to, "sam@example.com");
  assert.ok(!sent.html.includes("<script>"), "html must be escaped");
  assert.ok(sent.html.includes("&lt;script&gt;"));
  assert.ok(!/[\r\n]/.test(sent.subject));
});

test("provider failure → 502, not success", async () => {
  setEmailEnv(true);
  mockFetch(false);
  const res = await POST(req(valid));
  assert.equal(res.status, 502);
  assert.equal((await res.json()).ok, false);
});

test("network failure to provider → 502", async () => {
  setEmailEnv(true);
  globalThis.fetch = (async () => { throw new Error("down"); }) as typeof fetch;
  const res = await POST(req(valid));
  assert.equal(res.status, 502);
});

test("invalid input → 422 with per-field errors, nothing sent", async () => {
  setEmailEnv(true);
  mockFetch(true);
  const res = await POST(req({ ...valid, email: "nope", phone: "1" }));
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.ok(body.fieldErrors.email && body.fieldErrors.phone);
  assert.equal(calls.length, 0);
});

test("honeypot: silently dropped, nothing sent", async () => {
  setEmailEnv(true);
  mockFetch(true);
  const res = await POST(req({ ...valid, company_website: "http://spam.example" }));
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("form submitted impossibly fast is rejected", async () => {
  setEmailEnv(true);
  mockFetch(true);
  const res = await POST(req({ ...valid, elapsedMs: 300 }));
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test("rate limit: 6th request from one IP in the window gets 429", async () => {
  setEmailEnv(true);
  mockFetch(true);
  let last = 0;
  for (let i = 0; i < 6; i++) last = (await POST(req(valid))).status;
  assert.equal(last, 429);
});

test("cross-origin browser post is rejected", async () => {
  setEmailEnv(true);
  mockFetch(true);
  const res = await POST(req(valid, { origin: "https://evil.example" }));
  assert.equal(res.status, 403);
});

test("same-origin post is allowed", async () => {
  setEmailEnv(true);
  mockFetch(true);
  const res = await POST(req(valid, { origin: "http://localhost:3000" }));
  assert.equal(res.status, 200);
});

test("malformed JSON and oversized bodies are handled", async () => {
  assert.equal((await POST(req("{not json"))).status, 400);
  assert.equal((await POST(req(JSON.stringify({ ...valid, description: "x".repeat(30000) })))).status, 413);
});

test("Turnstile: when a secret is set, a missing token is rejected", async () => {
  setEmailEnv(true);
  process.env.TURNSTILE_SECRET_KEY = "secret";
  mockFetch(true);
  const res = await POST(req(valid));
  assert.equal(res.status, 400);
  assert.equal(calls.length, 0);
});

test("GET is not allowed", async () => {
  assert.equal(GET().status, 405);
});
