"use client";

import { useState } from "react";
import { translate, type CatalogKey, type Locale } from "@/lib/catalog";
import { ApprovalGate, type ApprovalState } from "@/components/ui/ApprovalGate";
import { IsolatedCopy } from "@/components/ui/Isolate";
import { ProgrammeCard } from "@/components/ui/ProgrammeCard";
import { SkeletonBar } from "@/components/ui/SkeletonBar";
import styles from "./SitePanels.module.css";

export type HomeProgrammeCard = {
  id: string;
  name: string;
  description: string;
  href: string;
};

export type HomePanelBranch = {
  id: string;
  name: string;
};

interface SitePanelsProps {
  locale: Locale;
  programmes: HomeProgrammeCard[];
  branches: HomePanelBranch[];
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
  if (id === "programmes") return "approval.pending.publishedProgramme";
  if (id === "branches") return "approval.pending.businessData";
  return "approval.pending.newsModule";
}

function panelApprovalState(
  id: (typeof PANELS)[number]["id"],
  programmes: HomeProgrammeCard[],
  branches: HomePanelBranch[],
): ApprovalState {
  if (id === "programmes") return programmes.length > 0 ? "approved" : "pending";
  if (id === "branches") return branches.length > 0 ? "approved" : "pending";
  return "pending";
}

export function SitePanels({ locale, programmes, branches }: SitePanelsProps) {
  const [active, setActive] = useState<(typeof PANELS)[number]["id"]>("programmes");
  const panel = PANELS.find((item) => item.id === active) ?? PANELS[0];
  const slots = Array.from({ length: panel.itemCount }, (_, index) => index);
  const gateState = panelApprovalState(panel.id, programmes, branches);

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
        <ApprovalGate locale={locale} state={gateState} pendingLabelKey={panelGateKey(panel.id)}>
          {panel.id === "programmes" && programmes.length > 0 ? (
            <ul className={styles.cardList}>
              {programmes.map((row) => (
                <li key={row.id}>
                  <ProgrammeCard
                    locale={locale}
                    name={row.name}
                    description={row.description}
                    href={row.href}
                  />
                </li>
              ))}
            </ul>
          ) : panel.id === "branches" && branches.length > 0 ? (
            <ul className={styles.list}>
              {branches.map((row) => (
                <li key={row.id}>
                  <strong>
                    <IsolatedCopy locale={locale} text={row.name} />
                  </strong>
                </li>
              ))}
            </ul>
          ) : (
            <ul className={styles.list}>
              {slots.map((index) => (
                <li key={`${panel.id}-${index}`}>
                  <SkeletonBar size="base" widthPercent={72} />
                  <SkeletonBar size="sm" widthPercent={88} />
                </li>
              ))}
            </ul>
          )}
        </ApprovalGate>
      </div>
    </div>
  );
}
