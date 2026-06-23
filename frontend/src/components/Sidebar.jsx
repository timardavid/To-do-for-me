import { motion } from "framer-motion";
import { CheckCheck } from "lucide-react";
import StatCard from "./StatCard";
import { NAV_ITEMS } from "../lib/constants";

export default function Sidebar({ counts, currentView, onSwitchView }) {
  return (
    <aside className="w-[280px] shrink-0 bg-panel flex flex-col h-full border-r border-line/60">
      <div className="px-6 pt-7 pb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-[9px] bg-primary flex items-center justify-center shrink-0">
          <CheckCheck size={20} strokeWidth={2.5} className="text-white" />
        </div>
        <div>
          <h1 className="text-ink font-semibold text-[17px] leading-none">Ne felejtsd el</h1>
          <p className="text-muted text-[13px] mt-1 leading-none">személyes teendőlista</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-5 pb-5">
        <StatCard label="Aktív feladatok" value={counts.all} />
        <StatCard label="Ma esedékes" value={counts.today} />
        <StatCard label="Lejárt" value={counts.overdue} danger />
        <StatCard label="Kész ma" value={counts.done_today} />
      </div>

      <div className="h-px bg-line/60 mx-5 mb-4" />

      <nav className="px-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = item.key === currentView;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onSwitchView(item.key)}
              className="relative h-11 rounded-[10px] flex items-center px-3.5 text-left group"
            >
              {active ? (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-[10px] bg-primary/15"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : (
                <div className="absolute inset-0 rounded-[10px] bg-transparent group-hover:bg-base transition-colors" />
              )}
              <Icon
                size={19}
                strokeWidth={2}
                className={`relative z-10 mr-3 shrink-0 ${active ? "text-primary" : "text-muted"}`}
              />
              <span
                className={`relative z-10 text-[15px] font-medium ${active ? "text-ink" : "text-muted"}`}
              >
                {item.label}
              </span>
              <span
                className={`relative z-10 ml-auto text-[13px] tabular-nums rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                {counts[item.key] ?? 0}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="h-px bg-line/60 mx-5 mb-4" />
      <p className="text-[12.5px] text-muted/80 px-6 pb-6 leading-relaxed tracking-tight">
        ⌘/Ctrl+N Új feladat
        <br />
        Ctrl+F Keresés · Esc Bezárás
      </p>
    </aside>
  );
}
