export type SwipeAxis = "pending" | "horizontal" | "vertical";

// Lock the gesture once; a vertical scroll must never become a delete swipe.
export function getSwipeAxis(dx: number, dy: number): SwipeAxis {
  const x = Math.abs(dx);
  const y = Math.abs(dy);
  if (y >= 10 && x <= y * 1.5) return "vertical";
  if (x >= 14 && x > y * 1.5) return "horizontal";
  return "pending";
}

export function clampDeleteOffset(offset: number): number {
  return Math.max(-76, Math.min(0, offset));
}
