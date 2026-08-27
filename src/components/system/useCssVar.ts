"use client";

import { useSyncExternalStore } from "react";

// Reads the live value of a CSS custom property from :root. The System
// view never carries a hardcoded copy of a token already defined in
// tokens.css / fonts.css — every value it shows is read from those files
// through the DOM, so it cannot drift from what the landing view actually
// renders. Custom properties never change at runtime here, so the
// subscription is a no-op; useSyncExternalStore is used instead of a
// useEffect + setState pair because getComputedStyle reads an external
// system, not React state, and this avoids a synchronous setState inside
// an effect body.
function subscribe(): () => void {
  return () => undefined;
}

function getServerSnapshot(): string | null {
  return null;
}

export function useCssVar(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => {
      const computed = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return computed || null;
    },
    getServerSnapshot,
  );
}
