"use client";

import { useEffect } from "react";
import { keepScreenAwake } from "./screenWakeLock";

export function useScreenWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    return keepScreenAwake(document, navigator.wakeLock);
  }, [active]);
}
