import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, isValidPhone, telHref, mailHref } from "../lib/contact";
import { validateQuote, parseQuoteInput } from "../lib/validation";

const good = {
  name: "Sam Taylor",
  phone: "0412 345 678",
  email: "sam@example.com",
  location: "Parramatta",
  service: "tree-removal",
  description: "",
  contactMethod: "" as const,
};

test("accepts common Australian phone formats", () => {
  for (const p of ["0412 345 678", "0412345678", "+61 412 345 678", "(02) 9876 5432", "02 9876 5432", "1300 123 456", "13 12 34", "+44 20 7946 0958"]) {
    assert.equal(isValidPhone(p), true, p);
  }
});

test("rejects bad phone numbers", () => {
  for (const p of ["", "123", "abcdefghij", "0012345678", "04123", "041234567890123"]) {
    assert.equal(isValidPhone(p), false, p);
  }
});

test("email validation", () => {
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("sam@example.com.au"), true);
  for (const e of ["", "sam", "sam@", "@x.com", "sam@x", "sam @x.com", "a@b.c", "sam@x.com\nBcc: evil@x.com"]) {
    assert.equal(isValidEmail(e), false, JSON.stringify(e));
  }
});

test("tel/mail links only for valid values (no dead links)", () => {
  assert.equal(telHref(""), null);
  assert.equal(telHref("nope"), null);
  assert.equal(telHref("0412 345 678"), "tel:0412345678");
  assert.equal(mailHref(""), null);
  assert.equal(mailHref("hi@example.com"), "mailto:hi@example.com");
});

test("a complete valid enquiry has no errors", () => {
  assert.deepEqual(validateQuote(good), {});
});

test("required fields are enforced", () => {
  const errs = validateQuote({ ...good, name: "", phone: "", email: "", location: "", service: "" });
  assert.deepEqual(Object.keys(errs).sort(), ["email", "location", "name", "phone", "service"]);
});

test("unknown service and contact method are rejected", () => {
  assert.ok(validateQuote({ ...good, service: "hack" }).service);
  assert.ok(validateQuote({ ...good, contactMethod: "carrier-pigeon" as never }).contactMethod);
  assert.deepEqual(validateQuote({ ...good, service: "not-sure" }), {});
});

test("name rejects digits/symbols; suburb accepts postcode", () => {
  assert.ok(validateQuote({ ...good, name: "Sam <script>" }).name);
  assert.ok(validateQuote({ ...good, name: "Sam\nBcc: x" }).name);
  assert.equal(validateQuote({ ...good, name: "Mary-Anne O'Brien" }).name, undefined);
  assert.equal(validateQuote({ ...good, location: "2150" }).location, undefined);
  assert.ok(validateQuote({ ...good, location: "x" }).location);
});

test("description length is capped", () => {
  assert.ok(validateQuote({ ...good, description: "x".repeat(2001) }).description);
});

test("parseQuoteInput coerces junk safely", () => {
  assert.deepEqual(parseQuoteInput(null).name, "");
  assert.equal(parseQuoteInput({ name: 5, email: ["a"] }).name, "");
  assert.equal(parseQuoteInput({ name: "  Sam  " }).name, "Sam");
});

import { toE164 } from "../lib/contact";
test("toE164 for structured data", () => {
  assert.equal(toE164("0428 356 872"), "+61428356872");
  assert.equal(toE164("+61 428 356 872"), "+61428356872");
  assert.equal(toE164("(02) 6771 1234"), "+61267711234");
  assert.equal(toE164("1300 123 456"), "1300123456");
  assert.equal(isValidPhone("0428 356 872"), true);
});
