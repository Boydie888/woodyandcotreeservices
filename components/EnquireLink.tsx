"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export const SELECT_SERVICE_EVENT = "woody:select-service";

type Props = {
  /** Service id to preselect in the quote form. Omit for a plain "go to the form" link. */
  service?: string;
  className?: string;
  children: ReactNode;
};

/**
 * A link to the quote form that also preselects a service.
 * Without JavaScript it still works as a normal anchor to #quote.
 */
export function EnquireLink({ service, className, children }: Props) {
  return (
    <Link
      href="/#quote"
      className={className}
      onClick={() => {
        if (service) {
          window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: service }));
        }
      }}
    >
      {children}
    </Link>
  );
}
