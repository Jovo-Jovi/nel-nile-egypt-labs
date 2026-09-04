"use client";

import { useState } from "react";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import { ApprovalGate } from "@/components/ui/ApprovalGate";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import styles from "./SitePanels.module.css";

interface SitePanelsProps {
  locale: Locale;
}

const PANELS = [
  {
    id: "programmes",
    tab: "header.nav.programmes" as const,
    title: "programmes.heading" as const,
    body: "programmes.standfirst" as const,
    itemCount: 3,
  },
  {
    id: "branches",
    tab: "header.nav.locations" as const,
    title: "branches.heading" as const,
    body: "branches.find" as const,
    itemCount: 3,
  },
  {
    id: "insights",
    tab: "header.nav.insights" as const,
    title: "newsShowcase.heading" as const,
    body: "newsShowcase.standfirst" as const,
    itemCount: 3,
  },
] as const;

function panelGateKey(id: (typeof PANELS)[number]["id"]): CatalogKey {
  if (id === "programmes") return "approval.pending.clinical";
  if (id === "branches") return "approval.pending.businessData";
  return "approval.pending.newsModule";
}

export function SitePanels({ locale }: SitePanelsProps) {
  const [active, setActive] = useState<(typeof PANELS)[number]["id"]>("programmes");
  const panel = PANELS.find((item) => item.id === active) ?? PANELS[0];
  const slots = Array.from({ length: panel.itemCount }, (_, index) => index);

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label={translate(locale, "header.nav.label")}>
        {PANELS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === active}
            className={styles.tab}
            onClick={() => setActive(item.id)}
          >
            {translate(locale, item.tab)}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        <h3 className={styles.title}>{translate(locale, panel.title)}</h3>
        <p className={styles.body}>{translate(locale, panel.body)}</p>
        <ApprovalGate locale={locale} state="pending" pendingLabelKey={panelGateKey(panel.id)}>
          <ul className={styles.list}>
            {slots.map((index) => (
              <li key={`${panel.id}-${index}`}>
                <SkeletonBar size="base" widthPercent={72} />
                <SkeletonBar size="sm" widthPercent={88} />
              </li>
            ))}
          </ul>
        </ApprovalGate>
      </div>
    </div>
  );
}
