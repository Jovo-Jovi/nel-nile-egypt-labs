import type { ReactNode } from "react";

// I18N_MODEL.md §6 — every Latin run inside Arabic text is isolated, here by
// wrapping in an element carrying dir="ltr". This is the one place §4's
// "no component sets dir on itself" is relaxed, and only for this.
export function Isolate({ children }: { children: ReactNode }) {
  return <span dir="ltr">{children}</span>;
}
