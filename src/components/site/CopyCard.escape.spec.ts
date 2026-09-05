import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CopyCard } from "./InfoPage";

test("CopyCard escapes markup and splits blank-line paragraphs", () => {
  const body = "<script>alert(1)</script>\n\n<a href=\"mailto:a@b\">x</a>\n\n&amp;";
  const html = renderToStaticMarkup(createElement(CopyCard, { locale: "en", body }));

  assert.equal((html.match(/<p\b/g) ?? []).length, 3);
  assert.equal((html.match(/<script\b/gi) ?? []).length, 0);
  assert.equal((html.match(/<a\b/gi) ?? []).length, 0);
  assert.equal((html.match(/<iframe\b/gi) ?? []).length, 0);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&lt;a href=&quot;mailto:a@b&quot;&gt;x&lt;\/a&gt;/);
  assert.match(html, /&amp;amp;/);
});
