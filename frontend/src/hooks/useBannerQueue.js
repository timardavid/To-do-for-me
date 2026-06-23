import { useCallback, useEffect, useState } from "react";

export function useBannerQueue(displayMs = 5000) {
  const [queue, setQueue] = useState([]);

  const push = useCallback((task) => {
    setQueue((prev) => [...prev, task]);
  }, []);

  const current = queue[0] ?? null;

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setQueue((prev) => prev.slice(1)), displayMs);
    return () => clearTimeout(timer);
  }, [current, displayMs]);

  const dismiss = useCallback(() => setQueue((prev) => prev.slice(1)), []);

  return { current, push, dismiss };
}
