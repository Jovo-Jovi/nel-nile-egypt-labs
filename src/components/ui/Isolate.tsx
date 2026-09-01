import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";

// I18N_MODEL.md §6 — every Latin run inside Arabic text is isolated, here by
// wrapping in an element carrying dir="ltr". This is the one place §4's
// "no component sets dir on itself" is relaxed, and only for this.
export function Isolate({ children }: { children: ReactNode }) {
  return <span dir="ltr">{children}</span>;
}

const LATIN_RUN = /[A-Za-z][A-Za-z0-9+./-]*/g;

export function IsolatedCopy({ locale, text }: { locale: Locale; text: string }) {
  if (locale !== "ar") return text;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  for (const match of text.matchAll(LATIN_RUN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
    nodes.push(<Isolate key={key}>{match[0]}</Isolate>);
    key += 1;
    lastIndex = start + match[0].length;
  }
  if (lastIndex === 0) return text;
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
