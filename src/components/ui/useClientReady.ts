"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

function clientSnapshot(): true {
  return true;
}

function serverSnapshot(): false {
  return false;
}

// True only after hydration. The server snapshot is false so the first
// client render matches SSR (React #418). This replaces useEffect plus
// setMounted, which react-hooks/set-state-in-effect forbids.
export function useClientReady(): boolean {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
