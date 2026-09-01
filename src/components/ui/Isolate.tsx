import type { ReactNode } from "react";
import type { Locale } from "@/lib/locale";

// I18N_MODEL.md §6 — every Latin run inside Arabic text is isolated, here by
// wrapping in an element carrying dir="ltr". This is the one place §4's
// "no component sets dir on itself" is relaxed, and only for this.
export function Isolate({ children }: { children: ReactNode }) {
  return <span dir="ltr">{children}</span>;
}

// A Latin run is a maximal sequence of Latin-script tokens together with
// the whitespace and punctuation BETWEEN them, wrapped in ONE Isolate.
// Leading and trailing whitespace stays outside: a run starts at the
// first token and ends at the last. Token class is the P03-T05 LATIN_RUN
// (`[A-Za-z]` then letters, digits, `+./-`). Bare digits do not start a
// token — they are weak and resolve without an isolate. An Arabic letter
// in the gap breaks the run.
//
// Trailing "." is inside the isolate. Mechanically it continues a token
// (`D.` is one token). Bidi: HTML `[dir]:not(bdi) { unicode-bidi: isolate }`
// means `dir="ltr"` does not leak LTR to adjacent neutrals. UBA N1 assigns
// a neutral the surrounding strong direction only when both sides agree;
// a trailing ON after an isolate in an RTL embedding has no matching
// strong on the far side, so N2 gives it the paragraph direction and the
// period renders on the wrong side of the run.
const LATIN_TOKEN = /[A-Za-z][A-Za-z0-9+./-]*/g;
const BETWEEN = /^[\s\p{P}]*$/u;

type IsolatedCopyPart = string | { readonly isolate: string };

function isolatedCopyNodes(locale: Locale, text: string): string | IsolatedCopyPart[] {
  if (locale !== "ar") return text;

  const tokens = [...text.matchAll(LATIN_TOKEN)];
  if (tokens.length === 0) return text;

  const runs: { start: number; end: number }[] = [];
  for (const token of tokens) {
    const start = token.index ?? 0;
    const end = start + token[0].length;
    const prev = runs[runs.length - 1];
    if (prev !== undefined && BETWEEN.test(text.slice(prev.end, start))) {
      prev.end = end;
    } else {
      runs.push({ start, end });
    }
  }

  const parts: IsolatedCopyPart[] = [];
  let lastIndex = 0;
  for (const run of runs) {
    if (run.start > lastIndex) parts.push(text.slice(lastIndex, run.start));
    parts.push({ isolate: text.slice(run.start, run.end) });
    lastIndex = run.end;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function IsolatedCopy({ locale, text }: { locale: Locale; text: string }) {
  const parts = isolatedCopyNodes(locale, text);
  if (typeof parts === "string") return parts;
  return parts.map((part, key) =>
    typeof part === "string" ? part : <Isolate key={key}>{part.isolate}</Isolate>,
  );
}
