import type { ReactNode } from "react";
import "@/styles/fonts.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";

// P03 replaces this — CONTENT_MODEL §3c. No locale segment exists yet, so
// lang/dir are not set here — see the page-root wrapper in PreviewRoot.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
