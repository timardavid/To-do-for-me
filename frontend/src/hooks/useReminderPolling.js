import { useEffect, useRef } from "react";
import { fetchDueReminders } from "../lib/api";
import { dueLabel } from "../lib/format";

const POLL_INTERVAL_MS = 30000;

export function useReminderPolling(onDue) {
  const onDueRef = useRef(onDue);
  onDueRef.current = onDue;

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    async function poll() {
      try {
        const due = await fetchDueReminders();
        // Note: due-reminders marks tasks as reminded server-side as a
        // side effect of this call, so a result must always be processed
        // once received — even if this effect instance was since cleaned
        // up (e.g. React StrictMode's dev-only double-invoke) — otherwise
        // the reminder is consumed on the server but never shown.
        for (const task of due) {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            try {
              new Notification("⏰ Emlékeztető", {
                body: `${task.title} — ${dueLabel(task)}`,
              });
            } catch (e) {
              console.error("[Notification] failed", e);
            }
          }
          onDueRef.current?.(task);
        }
      } catch (e) {
        console.error("[ReminderPolling] failed", e);
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
}
