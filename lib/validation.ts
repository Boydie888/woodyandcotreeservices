import { isValidEmail, isValidPhone } from "./contact";
import { serviceOptions } from "@/config/services";

/**
 * Shared by the browser form AND the server endpoint, so the rules
 * can never drift apart. The server always re-validates.
 */

export const CONTACT_METHODS = ["", "phone", "email"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export type QuoteInput = {
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  description: string;
  contactMethod: ContactMethod;
};

export type QuoteField = keyof QuoteInput;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export const LIMITS = {
  name: 100,
  phone: 30,
  email: 254,
  location: 60,
  description: 2000,
} as const;

const LOCATION = /^[\p{L}\p{N} .'’-]{2,60}$/u;
// Names: letters, spaces and common punctuation only (no digits / symbols).
const NAME = /^[\p{L}][\p{L} .'’-]*$/u;

export function validateField(field: QuoteField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "name":
      if (!v) return "Enter your full name.";
      if (v.length < 2) return "Enter your full name.";
      if (v.length > LIMITS.name) return `Keep your name under ${LIMITS.name} characters.`;
      if (!NAME.test(v)) return "Use letters only in your name.";
      return;
    case "phone":
      if (!v) return "Enter a phone number.";
      if (v.length > LIMITS.phone || !isValidPhone(v))
        return "Enter a valid phone number, e.g. 0400 000 000.";
      return;
    case "email":
      if (!v) return "Enter your email address.";
      if (!isValidEmail(v)) return "Enter a valid email address, e.g. name@example.com.";
      return;
    case "location":
      if (!v) return "Enter your suburb or postcode.";
      if (!LOCATION.test(v)) return "Enter a suburb name or a 4-digit postcode.";
      return;
    case "service":
      if (!v) return "Choose the service you need.";
      if (!serviceOptions.some((s) => s.id === v)) return "Choose a service from the list.";
      return;
    case "description":
      if (v.length > LIMITS.description)
        return `Keep the description under ${LIMITS.description} characters.`;
      return;
    case "contactMethod":
      if (!(CONTACT_METHODS as readonly string[]).includes(v)) return "Choose a contact method.";
      return;
  }
}

export const FIELD_ORDER: QuoteField[] = [
  "name",
  "phone",
  "email",
  "location",
  "service",
  "description",
  "contactMethod",
];

export function validateQuote(input: QuoteInput): QuoteErrors {
  const errors: QuoteErrors = {};
  for (const field of FIELD_ORDER) {
    const message = validateField(field, input[field] ?? "");
    if (message) errors[field] = message;
  }
  return errors;
}

/** Coerce unknown JSON into a trimmed QuoteInput (every value a string). */
export function parseQuoteInput(raw: unknown): QuoteInput {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (k: string) => (typeof obj[k] === "string" ? (obj[k] as string).trim() : "");
  return {
    name: str("name"),
    phone: str("phone"),
    email: str("email"),
    location: str("location"),
    service: str("service"),
    description: str("description"),
    contactMethod: str("contactMethod") as ContactMethod,
  };
}
