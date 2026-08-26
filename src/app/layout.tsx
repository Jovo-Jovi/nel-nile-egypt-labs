import type { ReactNode } from "react";

// P03 replaces this — CONTENT_MODEL §3c
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
