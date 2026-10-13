/** Strip spaces, brackets, dots and hyphens from a phone number. */
export function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, "");
}

// Australian numbers: 0X XXXX XXXX / +61 X XXXX XXXX (landline + mobile),
// plus 13/1300/1800 numbers.
const AU_STANDARD = /^(?:\+?61|0)[2-478]\d{8}$/;
const AU_SPECIAL = /^(?:13\d{4}|1[38]00\d{6})$/;
// Lenient fallback for overseas numbers written in international format.
const INTERNATIONAL = /^\+(?!61)\d{8,15}$/;

export function isValidPhone(raw: string): boolean {
  const n = normalisePhone(raw);
  return AU_STANDARD.test(n) || AU_SPECIAL.test(n) || INTERNATIONAL.test(n);
}

/** `tel:` link, or null when the number is empty/invalid (so no dead link is rendered). */
export function telHref(raw: string): string | null {
  if (!raw || !isValidPhone(raw)) return null;
  return `tel:${normalisePhone(raw)}`;
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;

export function isValidEmail(raw: string): boolean {
  return raw.length <= 254 && EMAIL.test(raw);
}

export function mailHref(raw: string): string | null {
  if (!raw || !isValidEmail(raw)) return null;
  return `mailto:${raw}`;
}

/** E.164 form for structured data, e.g. "0428 356 872" → "+61428356872". */
export function toE164(raw: string): string {
  const n = normalisePhone(raw);
  if (n.startsWith("+")) return n;
  if (/^(?:13\d{4}|1[38]00\d{6})$/.test(n)) return n; // 13/1300/1800 stay as dialled
  if (n.startsWith("61")) return `+${n}`;
  if (n.startsWith("0")) return `+61${n.slice(1)}`;
  return n;
}
