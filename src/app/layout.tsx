import type { ReactNode } from "react";
import "@/styles/fonts.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";

// html/body live on the [locale] layout so lang/dir are set from the
// segment (CF-61, I18N_MODEL.md §4). This root layout only loads global
// styles and must not render a page at `/`.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
