import { useEffect } from "react";

export function useKeyboardShortcuts({ onNew, onFocusSearch, onEscape }) {
  useEffect(() => {
    function handleKeyDown(e) {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "n") {
        e.preventDefault();
        onNew?.();
      } else if (mod && e.key.toLowerCase() === "f") {
        e.preventDefault();
        onFocusSearch?.();
      } else if (e.key === "Escape") {
        onEscape?.();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNew, onFocusSearch, onEscape]);
}
