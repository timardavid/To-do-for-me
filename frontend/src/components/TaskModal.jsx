import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { apiErrorMessage } from "../lib/api";
import { CATEGORIES, PRIORITIES, REMINDER_OPTIONS } from "../lib/constants";
import { datetimeLocalToApi, parseDueDate, toDatetimeLocalValue } from "../lib/format";

const inputClass =
  "w-full bg-base rounded-[10px] px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow";

export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = Boolean(task);
  const titleRef = useRef(null);

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDateLocal, setDueDateLocal] = useState(() => {
    if (!task) return "";
    const due = parseDueDate(task);
    return due ? toDatetimeLocalValue(due) : "";
  });
  const [priority, setPriority] = useState(task?.priority ?? "medium");
  const [category, setCategory] = useState(task?.category ?? CATEGORIES[0]);
  const [remindMinutes, setRemindMinutes] = useState(task?.remind_minutes ?? 0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("A cím megadása kötelező.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        due_date: datetimeLocalToApi(dueDateLocal),
        priority,
        category,
        remind_minutes: remindMinutes,
      });
      onClose();
    } catch (err) {
      setError(apiErrorMessage(err, "Hiba történt a mentés közben."));
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="bg-surface rounded-[18px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-8 shadow-2xl shadow-black/20"
      >
        <h2 className="text-[20px] font-semibold text-ink mb-6 tracking-tight">
          {isEdit ? "Feladat szerkesztése" : "Új feladat"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[13px] text-muted mb-1.5">Cím *</label>
            <input
              ref={titleRef}
              className={inputClass}
              placeholder="Mit kell elvégezni?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[13px] text-muted mb-1.5">Leírás</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[13px] text-muted mb-1.5">Határidő</label>
            <input
              type="datetime-local"
              className={inputClass}
              value={dueDateLocal}
              onChange={(e) => setDueDateLocal(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[13px] text-muted mb-1.5">Prioritás</label>
            <div className="flex gap-2.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPriority(p.key)}
                  className={`flex-1 py-2.5 rounded-[10px] text-[15px] font-medium transition-colors ${
                    priority === p.key ? "bg-primary text-white" : "bg-base text-muted hover:bg-line/40"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] text-muted mb-1.5">Kategória</label>
            <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] text-muted mb-1.5">Emlékeztető</label>
            <select
              className={inputClass}
              value={remindMinutes}
              onChange={(e) => setRemindMinutes(Number(e.target.value))}
            >
              {REMINDER_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.minutes}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-danger text-[14px]">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-[10px] bg-base hover:bg-line/40 text-ink font-medium text-[15px] transition-colors"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-[10px] bg-primary hover:bg-secondary text-white font-medium text-[15px] transition-colors disabled:opacity-60"
            >
              Mentés
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
