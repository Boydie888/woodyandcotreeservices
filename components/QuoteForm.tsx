"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { site } from "@/config/site";
import { serviceOptions } from "@/config/services";
import { telHref } from "@/lib/contact";
import {
  FIELD_ORDER,
  LIMITS,
  validateField,
  validateQuote,
  type QuoteErrors,
  type QuoteField,
  type QuoteInput,
} from "@/lib/validation";
import { SELECT_SERVICE_EVENT } from "./EnquireLink";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: QuoteInput = {
  name: "",
  phone: "",
  email: "",
  location: "",
  service: "",
  description: "",
  contactMethod: "",
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional ? <span className="font-normal text-stone"> (optional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-stone">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-danger">
          <CircleAlert aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
          <span>
            <span className="sr-only">Error: </span>
            {error}
          </span>
        </p>
      ) : null}
    </div>
  );
}

export function QuoteForm() {
  const uid = useId();
  const [values, setValues] = useState<QuoteInput>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [token, setToken] = useState("");

  const startedAt = useRef(Date.now());
  const submitting = useRef(false); // guards against double-submits (double-click / Enter + click)
  const successRef = useRef<HTMLHeadingElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);

  const id = (field: string) => `${uid}-${field}`.replace(/[^a-zA-Z0-9_-]/g, "");

  // Preselect a service when "Enquire Now" is clicked, or via ?service=… in the URL.
  useEffect(() => {
    const apply = (serviceId: string) => {
      if (!serviceOptions.some((s) => s.id === serviceId)) return;
      setValues((v) => ({ ...v, service: serviceId }));
      setErrors((e) => ({ ...e, service: undefined }));
    };
    const fromUrl = new URLSearchParams(window.location.search).get("service");
    if (fromUrl) apply(fromUrl);

    const onSelect = (e: Event) => apply((e as CustomEvent<string>).detail);
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  // Move focus to the confirmation so screen-reader users hear it.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const renderTurnstile = useCallback(() => {
    if (!SITE_KEY || !window.turnstile || !widgetRef.current || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetRef.current, {
      sitekey: SITE_KEY,
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, []);

  // (Re)create the widget whenever the form is on screen — including after "Send another enquiry".
  useEffect(() => {
    if (status !== "success") renderTurnstile();
  }, [status, renderTurnstile]);

  const resetTurnstile = () => {
    setToken("");
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  const setField = (field: QuoteField, value: string) => {
    setValues((v) => ({ ...v, [field]: value }) as QuoteInput);
    // Once a field has shown an error, re-check as the person fixes it.
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    }
  };

  const onBlur = (field: QuoteField) => {
    const message = validateField(field, values[field]);
    setErrors((e) => ({ ...e, [field]: message }));
  };

  const focusFirstError = (errs: QuoteErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) document.getElementById(id(first))?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current || status === "success") return;

    const errs = validateQuote(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus("idle");
      setServerMessage("");
      focusFirstError(errs);
      return;
    }

    if (SITE_KEY && !token) {
      setStatus("error");
      setServerMessage("Please complete the security check below, then send your enquiry again.");
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          company_website: honeypot,
          elapsedMs: Date.now() - startedAt.current,
          turnstileToken: token,
        }),
      });

      let data: { ok?: boolean; message?: string; fieldErrors?: QuoteErrors } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON response — handled below */
      }

      if (res.ok && data.ok === true) {
        setStatus("success"); // only after the server confirms
        widgetId.current = undefined; // the widget unmounts with the form
        setToken("");
        return; // stay locked: no second submission after success
      }

      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        focusFirstError(data.fieldErrors);
      }
      setStatus("error");
      setServerMessage(
        data.message || "We couldn't send your enquiry. Please try again, or contact us directly.",
      );
      resetTurnstile();
    } catch {
      setStatus("error");
      setServerMessage(
        "We couldn't reach the server. Check your connection and try again, or contact us directly.",
      );
      resetTurnstile();
    }
    submitting.current = false;
  }

  const tel = telHref(site.phone);

  if (status === "success") {
    const firstName = values.name.split(/\s+/)[0] ?? "";
    return (
      <div role="status" className="py-4">
        <CircleCheck aria-hidden="true" size={40} className="text-forest" />
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-4 text-[1.6rem] font-extrabold text-forest outline-none"
        >
          Thanks{firstName ? `, ${firstName}` : ""}. Your enquiry has been sent.
        </h3>
        <p className="mt-3 text-stone">
          We&rsquo;ll review the details and get back to you to discuss the next steps.
        </p>
        <button
          type="button"
          className="btn btn-outline mt-7"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setStatus("idle");
            submitting.current = false;
            startedAt.current = Date.now();
            resetTurnstile();
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const isSubmitting = status === "submitting";
  const describe = (field: QuoteField, hasHint = false) =>
    errors[field] ? `${id(field)}-error` : hasHint ? `${id(field)}-hint` : undefined;

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={`${id("intro")}`}>
      <p id={id("intro")} className="mb-6 text-[0.95rem] text-stone">
        All fields are required unless marked optional.
      </p>

      {/* Live region: announces progress to screen readers. */}
      <div className="sr-only" aria-live="polite">
        {isSubmitting ? "Sending your enquiry…" : ""}
      </div>

      {status === "error" && serverMessage ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-md border-2 border-danger bg-[#fbf1f1] p-4 text-[0.95rem] text-ink"
        >
          <CircleAlert aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-danger" />
          <p>
            <span className="font-bold text-danger">Your enquiry hasn&rsquo;t been sent. </span>
            {serverMessage}
            {tel ? (
              <>
                {" "}
                You can also call{" "}
                <a href={tel} className="font-bold text-forest underline">
                  {site.phone}
                </a>
                .
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id("name")} label="Full name" error={errors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            required
            aria-required="true"
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={describe("name")}
            className="field-input"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => onBlur("name")}
          />
        </Field>

        <Field id={id("phone")} label="Phone number" error={errors.phone}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            required
            aria-required="true"
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={describe("phone")}
            className="field-input"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            onBlur={() => onBlur("phone")}
          />
        </Field>

        <Field id={id("email")} label="Email address" error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            required
            aria-required="true"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={describe("email")}
            className="field-input"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => onBlur("email")}
          />
        </Field>

        <Field id={id("location")} label="Suburb or postcode" error={errors.location}>
          <input
            id={id("location")}
            name="location"
            type="text"
            maxLength={LIMITS.location}
            required
            aria-required="true"
            aria-invalid={errors.location ? "true" : undefined}
            aria-describedby={describe("location")}
            className="field-input"
            value={values.location}
            onChange={(e) => setField("location", e.target.value)}
            onBlur={() => onBlur("location")}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field id={id("service")} label="Service required" error={errors.service}>
            <select
              id={id("service")}
              name="service"
              required
              aria-required="true"
              aria-invalid={errors.service ? "true" : undefined}
              aria-describedby={describe("service")}
              className="field-input"
              value={values.service}
              onChange={(e) => setField("service", e.target.value)}
              onBlur={() => onBlur("service")}
            >
              <option value="">Select a service</option>
              {serviceOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            id={id("description")}
            label="Brief description of the job"
            optional
            error={errors.description}
            hint="E.g. the type and size of tree, where it is, and anything we should know about access."
          >
            <textarea
              id={id("description")}
              name="description"
              maxLength={LIMITS.description}
              aria-invalid={errors.description ? "true" : undefined}
              aria-describedby={describe("description", true)}
              className="field-input"
              value={values.description}
              onChange={(e) => setField("description", e.target.value)}
              onBlur={() => onBlur("description")}
            />
          </Field>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="field-label">
            Preferred contact method<span className="font-normal text-stone"> (optional)</span>
          </legend>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {[
              { value: "", label: "No preference" },
              { value: "phone", label: "Phone" },
              { value: "email", label: "Email" },
            ].map((opt) => (
              <label key={opt.value || "none"} className="flex min-h-11 cursor-pointer items-center gap-2.5">
                <input
                  type="radio"
                  name="contactMethod"
                  value={opt.value}
                  checked={values.contactMethod === opt.value}
                  onChange={() => setField("contactMethod", opt.value)}
                  className="h-5 w-5 accent-forest"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Honeypot: invisible to people, tempting to bots. */}
        <div className="hp-field" aria-hidden="true">
          <label>
            Leave this field empty
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>
      </div>

      {SITE_KEY ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onLoad={renderTurnstile}
            onReady={renderTurnstile}
          />
          <div ref={widgetRef} className="mt-5" />
        </>
      ) : null}

      <button type="submit" className="btn btn-primary mt-7 w-full sm:w-auto sm:min-w-56" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden="true" size={18} className="spin" />
            Sending…
          </>
        ) : (
          "Request a Quote"
        )}
      </button>

      <p className="mt-5 text-sm text-stone">
        We use the details you provide only to respond to your enquiry. See our{" "}
        <Link href="/privacy" target="_blank" rel="noopener" className="font-semibold text-forest underline">
          Privacy Policy<span className="sr-only"> (opens in a new tab)</span>
        </Link>
        .
      </p>
    </form>
  );
}
