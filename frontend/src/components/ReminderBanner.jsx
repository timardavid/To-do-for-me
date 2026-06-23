import { AnimatePresence, motion } from "framer-motion";
import { BellRing, X } from "lucide-react";
import { dueLabel } from "../lib/format";

export default function ReminderBanner({ task, onDismiss }) {
  return (
    <AnimatePresence>
      {task && (
        <motion.div
          key={task.id}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[90] bg-secondary text-white shadow-lg shadow-black/30"
        >
          <div className="flex items-center gap-4 px-8 py-4 max-w-5xl mx-auto">
            <BellRing size={22} strokeWidth={2} className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[15px]">Emlékeztető</p>
              <p className="text-[15px] text-white/85 truncate">
                {task.title} · {dueLabel(task)}
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              aria-label="Bezárás"
            >
              <X size={17} strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
