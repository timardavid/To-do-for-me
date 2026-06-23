import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Pencil, Tag, X } from "lucide-react";
import HighlightedText from "./HighlightedText";
import { PRIORITY_COLOR } from "../lib/constants";
import { dueLabel, isOverdue } from "../lib/format";

function ActionButton({ icon: Icon, tone, onClick, label }) {
  const toneClass = {
    success: "text-muted hover:text-success hover:bg-success/10",
    secondary: "text-muted hover:text-secondary hover:bg-secondary/10",
    danger: "text-muted hover:text-danger hover:bg-danger/10",
  }[tone];
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-9 h-9 rounded-[8px] flex items-center justify-center transition-colors ${toneClass}`}
    >
      <Icon size={17} strokeWidth={2} />
    </button>
  );
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export default function TaskCard({ task, query, isNew, onComplete, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | completing | deleting
  const [collapsing, setCollapsing] = useState(false);

  const overdue = isOverdue(task);

  function handleComplete() {
    setPhase("completing");
    setTimeout(() => setCollapsing(true), 350);
  }

  function handleDeleteConfirm() {
    setPhase("deleting");
    setCollapsing(true);
  }

  const collapsedStyle =
    phase === "deleting"
      ? { opacity: 0, x: -420 }
      : { opacity: 0, scale: 0.94, height: 0, marginBottom: 0 };

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, x: 70 } : false}
      animate={collapsing ? collapsedStyle : { opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onAnimationComplete={() => {
        if (!collapsing) return;
        if (phase === "deleting") onDelete(task.id);
        else if (phase === "completing") onComplete(task.id);
      }}
      className="bg-surface rounded-[14px] overflow-hidden mb-3 flex group shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-shadow"
    >
      <div className="w-1 shrink-0" style={{ backgroundColor: PRIORITY_COLOR[task.priority] }} />

      <div className="flex-1 min-w-0 flex items-start gap-4 px-5 py-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <p
              className={`text-[16px] font-medium truncate ${
                task.done || phase === "completing" ? "line-through text-muted" : "text-ink"
              }`}
            >
              <HighlightedText text={task.title} query={query} />
            </p>
            {overdue && (
              <motion.span
                className="w-2 h-2 rounded-full bg-danger shrink-0"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
          </div>

          {task.description && (
            <p className="text-[14px] text-muted truncate mt-1">
              <HighlightedText text={truncate(task.description, 90)} query={query} />
            </p>
          )}

          <div className="flex items-center gap-4 mt-2.5 text-[13px] text-muted">
            <span className={`flex items-center gap-1.5 ${overdue ? "text-danger" : ""}`}>
              <Clock size={14} strokeWidth={2} />
              {dueLabel(task)}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={14} strokeWidth={2} />
              {task.category}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          {confirmingDelete ? (
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] text-ink whitespace-nowrap">Biztos törölni akarod?</span>
              <button
                onClick={handleDeleteConfirm}
                className="bg-danger hover:bg-[#dc2626] text-white text-[13px] font-medium rounded-[8px] px-3.5 py-2"
              >
                Törlés
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                className="bg-line/70 hover:bg-line text-ink text-[13px] font-medium rounded-[8px] px-3.5 py-2"
              >
                Mégse
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              {!task.done && <ActionButton icon={Check} tone="success" label="Kész" onClick={handleComplete} />}
              <ActionButton icon={Pencil} tone="secondary" label="Szerkesztés" onClick={() => onEdit(task)} />
              <ActionButton icon={X} tone="danger" label="Törlés" onClick={() => setConfirmingDelete(true)} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
