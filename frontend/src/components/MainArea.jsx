import { AnimatePresence } from "framer-motion";
import { Inbox, Plus, Search } from "lucide-react";
import TaskCard from "./TaskCard";
import { EMPTY_STATES, NAV_ITEMS } from "../lib/constants";

export default function MainArea({
  currentView,
  tasks,
  query,
  onQueryChange,
  searchInputRef,
  justAddedId,
  onComplete,
  onEdit,
  onDelete,
  onOpenAdd,
}) {
  const viewLabel = NAV_ITEMS.find((n) => n.key === currentView)?.label ?? "Összes";
  const empty = EMPTY_STATES[currentView] ?? { icon: Inbox, message: "Nincs találat." };
  const EmptyIcon = empty.icon;

  return (
    <main className="flex-1 flex flex-col h-full relative bg-base overflow-hidden">
      <div className="flex items-center justify-between px-10 pt-9 pb-5 gap-4">
        <h1 className="text-[28px] font-semibold text-ink tracking-tight">{viewLabel}</h1>
        <div className="flex items-center bg-surface border border-line rounded-[10px] px-3.5 focus-within:border-primary transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <Search size={17} strokeWidth={2} className="text-muted shrink-0" />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Keresés... (Ctrl+F)"
            className="bg-transparent text-[15px] text-ink placeholder:text-muted px-2.5 py-2.5 w-64 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted">
            <EmptyIcon size={36} strokeWidth={1.5} className="mb-4 text-muted/70" />
            <p className="text-[15px] whitespace-pre-line">{empty.message}</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                query={query}
                isNew={task.id === justAddedId}
                onComplete={onComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      <button
        onClick={onOpenAdd}
        aria-label="Új feladat"
        className="absolute bottom-9 right-9 w-16 h-16 rounded-full bg-primary hover:bg-secondary text-white shadow-lg shadow-black/25 flex items-center justify-center transition-colors"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>
    </main>
  );
}
