import { translate, type Locale } from "@/lib/catalog";
import { WhatsAppAction } from "@/components/ui/WhatsAppAction";
import { ResultsPortalLinkAction } from "@/components/ui/ResultsPortalLinkAction";
import styles from "./DockBar.module.css";

interface DockBarProps {
  locale: Locale;
}

// Compact sticky bar: Results Portal + WhatsApp. Hidden from 1024px up,
// where the header carries the portal and the FAB carries WhatsApp.
export function DockBar({ locale }: DockBarProps) {
  return (
    <div className={styles.dock} role="region" aria-label={translate(locale, "dock.label")}>
      <ResultsPortalLinkAction label={translate(locale, "hero.portalAction")} variant="secondary" />
      <span className={styles.whatsapp}>
        <WhatsAppAction label={translate(locale, "header.whatsappCompactLabel")} variant="whatsappOutlined" />
      </span>
    </div>
  );
}
