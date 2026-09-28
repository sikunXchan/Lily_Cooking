type ScreenLock = Pick<WakeLockSentinel, "release" | "released" | "addEventListener">;
type ScreenLockAPI = { request: (type: "screen") => Promise<ScreenLock> };
type VisibleDocument = Pick<Document, "visibilityState" | "addEventListener" | "removeEventListener">;

/** One owner's wake lock. Safe when requests finish after navigation/unmount. */
export function keepScreenAwake(doc: VisibleDocument, api?: ScreenLockAPI): () => void {
  if (!api) return () => {};
  let lock: ScreenLock | null = null;
  let pending = false;
  let disposed = false;
  let revision = 0;

  const release = () => {
    const current = lock;
    lock = null;
    if (current && !current.released) void current.release().catch(() => {});
  };
  const request = async () => {
    if (disposed || pending || lock || doc.visibilityState !== "visible") return;
    pending = true;
    const startedAt = revision;
    try {
      const acquired = await api.request("screen");
      if (disposed || startedAt !== revision || doc.visibilityState !== "visible") {
        await acquired.release().catch(() => {});
      } else {
        lock = acquired;
        acquired.addEventListener("release", () => {
          if (lock === acquired) lock = null;
        }, { once: true });
      }
    } catch {
      // Unsupported webviews, low battery and denied permissions must not block a recipe.
    } finally {
      pending = false;
      if (!disposed && startedAt !== revision && doc.visibilityState === "visible") void request();
    }
  };
  const onVisibilityChange = () => {
    revision += 1;
    if (doc.visibilityState === "visible") void request();
    else release();
  };
  doc.addEventListener("visibilitychange", onVisibilityChange);
  void request();
  return () => {
    disposed = true;
    doc.removeEventListener("visibilitychange", onVisibilityChange);
    release();
  };
}
