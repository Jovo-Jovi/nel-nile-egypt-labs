// Split a CopyCard body on blank lines — one or more consecutive newlines
// that contain only whitespace. A body with no blank line is one paragraph.

export function splitCopyParagraphs(body: string): string[] {
  return body
    .split(/\r?\n(?:[^\S\n]*\r?\n)+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}
