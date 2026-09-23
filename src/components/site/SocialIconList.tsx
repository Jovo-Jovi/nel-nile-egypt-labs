import { translate, type Locale } from "@/lib/catalog";
import type { PublicSocialLink, SocialNetwork } from "@/lib/publicChrome";
import {
  FacebookMarkIcon,
  InstagramMarkIcon,
  LinkedInMarkIcon,
  XBrandIcon,
  YoutubeMarkIcon,
} from "@/components/ui/icons";
import styles from "./SocialIconList.module.css";

const SOCIAL_ORDER: SocialNetwork[] = ["facebook", "instagram", "x", "linkedin", "youtube"];

function SocialIcon({ network }: { network: SocialNetwork }) {
  if (network === "facebook") return <FacebookMarkIcon />;
  if (network === "instagram") return <InstagramMarkIcon />;
  if (network === "youtube") return <YoutubeMarkIcon />;
  if (network === "x") return <XBrandIcon />;
  return <LinkedInMarkIcon />;
}

interface SocialIconListProps {
  locale: Locale;
  links: PublicSocialLink[];
  label: string;
  tone: "onPrimary" | "onSurface";
}

export function SocialIconList({ locale, links, label, tone }: SocialIconListProps) {
  const ordered = [...links].sort((a, b) => SOCIAL_ORDER.indexOf(a.network) - SOCIAL_ORDER.indexOf(b.network));
  if (ordered.length === 0) return null;
  return (
    <ul className={styles.list} aria-label={label}>
      {ordered.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className={tone === "onPrimary" ? styles.btnOnPrimary : styles.btnOnSurface}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={translate(locale, item.labelKey)}
          >
            <SocialIcon network={item.network} />
          </a>
        </li>
      ))}
    </ul>
  );
}
