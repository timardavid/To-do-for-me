import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import MainArea from "./components/MainArea";
import TaskModal from "./components/TaskModal";
import ReminderBanner from "./components/ReminderBanner";
import { ToastProvider, useToast } from "./context/ToastContext";
import { useTasks } from "./hooks/useTasks";
import { useReminderPolling } from "./hooks/useReminderPolling";
import { useBannerQueue } from "./hooks/useBannerQueue";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

function AppContent() {
  const [currentView, setCurrentView] = useState("all");
  const [query, setQuery] = useState("");
  const [modalState, setModalState] = useState(null); // null | "new" | <task object>
  const searchInputRef = useRef(null);
  const toast = useToast();

  const {
    tasks,
    counts,
    justAddedId,
    clearJustAdded,
    addTask,
    editTask,
    completeTaskById,
    removeTask,
    refresh,
  } = useTasks(currentView, query);

  const { current: bannerTask, push: pushBanner, dismiss: dismissBanner } = useBannerQueue();

  useReminderPolling((task) => {
    pushBanner(task);
    refresh();
  });

  useKeyboardShortcuts({
    onNew: () => setModalState("new"),
    onFocusSearch: () => searchInputRef.current?.focus(),
    onEscape: () => setModalState(null),
  });

  useEffect(() => {
    if (!justAddedId) return;
    const timer = setTimeout(clearJustAdded, 1200);
    return () => clearTimeout(timer);
  }, [justAddedId, clearJustAdded]);

  async function handleComplete(id) {
    await completeTaskById(id);
    toast("Kész! Jól csináltad.", "success");
  }

  async function handleDelete(id) {
    await removeTask(id);
    toast("Feladat törölve.", "danger", 2200);
  }

  async function handleSave(payload) {
    if (modalState && modalState !== "new") {
      await editTask(modalState.id, payload);
      toast("Feladat frissítve.", "warning");
    } else {
      await addTask(payload);
      toast("Feladat sikeresen hozzáadva!", "success");
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar counts={counts} currentView={currentView} onSwitchView={setCurrentView} />
      <MainArea
        currentView={currentView}
        tasks={tasks}
        query={query}
        onQueryChange={setQuery}
        searchInputRef={searchInputRef}
        justAddedId={justAddedId}
        onComplete={handleComplete}
        onEdit={(task) => setModalState(task)}
        onDelete={handleDelete}
        onOpenAdd={() => setModalState("new")}
      />
      <ReminderBanner task={bannerTask} onDismiss={dismissBanner} />
      <AnimatePresence>
        {modalState && (
          <TaskModal
            task={modalState === "new" ? null : modalState}
            onClose={() => setModalState(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
