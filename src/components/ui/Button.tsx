"use client";

import type { MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.css";

// DESIGN_SYSTEM.md §10 — three variants, all 44px minimum block size.
export type ButtonVariant = "primary" | "secondary" | "text";

// DESIGN_SYSTEM.md §11 — six interaction states. `forceState` lets the
// System view gallery demonstrate a state without simulating real pointer
// or keyboard input; the landing view never passes it and gets the real
// pseudo-classes instead.
export type ButtonForcedState = "hover" | "focus" | "active" | "disabled" | "loading";

interface ButtonProps {
  variant: ButtonVariant;
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler;
  ariaLabel?: string;
  forceState?: ButtonForcedState;
  disabled?: boolean;
}

export function Button({
  variant,
  children,
  href,
  target,
  rel,
  onClick,
  ariaLabel,
  forceState,
  disabled,
}: ButtonProps) {
  const isLoading = forceState === "loading";
  const isDisabled = Boolean(disabled) || forceState === "disabled";
  const classes = [styles.button, styles[variant]].join(" ");

  const inner = (
    <>
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      <span className={styles.label}>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={isDisabled || isLoading ? undefined : href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        aria-disabled={isDisabled || isLoading || undefined}
        data-force-state={forceState}
        onClick={isDisabled || isLoading ? (event) => event.preventDefault() : onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={isLoading || undefined}
      data-force-state={forceState}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
