import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";

const ToastContext = createContext(null);

const KIND_STYLES = {
  success: { border: "border-success/40", iconColor: "text-success", icon: CircleCheck },
  warning: { border: "border-warning/40", iconColor: "text-warning", icon: CircleAlert },
  danger: { border: "border-danger/40", iconColor: "text-danger", icon: CircleX },
  info: { border: "border-secondary/40", iconColor: "text-secondary", icon: Info },
};

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message, kind = "success", duration = 3000) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, kind }]);
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed top-5 right-6 z-[100] flex flex-col gap-2.5 items-end">
        <AnimatePresence>
          {toasts.map((toast) => {
            const style = KIND_STYLES[toast.kind] || KIND_STYLES.info;
            const Icon = style.icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className={`bg-surface ${style.border} border rounded-[12px] shadow-xl shadow-black/10 px-5 py-4 max-w-md text-[15px] text-ink flex items-start gap-3`}
              >
                <Icon size={20} strokeWidth={2} className={`shrink-0 mt-0.5 ${style.iconColor}`} />
                <span>{toast.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
