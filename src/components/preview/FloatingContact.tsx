import { translate, type Locale } from "@/lib/catalog";
import { WhatsAppMarkIcon } from "@/components/ui/icons";
import { buildWhatsAppPlaceholderUrl } from "@/lib/placeholders";
import styles from "./FloatingContact.module.css";

interface FloatingContactProps {
  locale: Locale;
}

// Desktop WhatsApp floating action. Hidden below 1024px, where the sticky
// dock carries the same deep link. Not a phone widget and not a form (D-09).
export function FloatingContact({ locale }: FloatingContactProps) {
  return (
    <a
      className={styles.fab}
      href={buildWhatsAppPlaceholderUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={translate(locale, "float.whatsapp")}
    >
      <WhatsAppMarkIcon size={32} />
    </a>
  );
}
