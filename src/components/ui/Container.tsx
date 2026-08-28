import type { ReactNode } from "react";
import styles from "./Container.module.css";

// DESIGN_SYSTEM.md §9 — three container widths.
export type ContainerVariant = "narrow" | "default" | "wide";

interface ContainerProps {
  variant?: ContainerVariant;
  children: ReactNode;
  className?: string;
}

export function Container({ variant = "default", children, className }: ContainerProps) {
  const classes = [styles.container, styles[variant], className].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
