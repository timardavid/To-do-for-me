import { useCallback, useEffect, useRef, useState } from "react";
import { completeTask, createTask, deleteTask, fetchTasks, updateTask } from "../lib/api";

const EMPTY_COUNTS = { all: 0, today: 0, upcoming: 0, overdue: 0, done: 0, done_today: 0 };

export function useTasks(view, search) {
  const [tasks, setTasks] = useState([]);
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [loading, setLoading] = useState(true);
  const [justAddedId, setJustAddedId] = useState(null);
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const data = await fetchTasks(view, search);
      if (id !== requestId.current) return;
      setTasks(data.tasks);
      setCounts(data.counts);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [view, search]);

  useEffect(() => {
    const handle = setTimeout(refresh, search ? 200 : 0);
    return () => clearTimeout(handle);
  }, [refresh, search]);

  useEffect(() => {
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  const addTask = useCallback(
    async (payload) => {
      const task = await createTask(payload);
      setJustAddedId(task.id);
      await refresh();
      return task;
    },
    [refresh]
  );

  const editTask = useCallback(
    async (id, payload) => {
      const task = await updateTask(id, payload);
      await refresh();
      return task;
    },
    [refresh]
  );

  const completeTaskById = useCallback(
    async (id) => {
      await completeTask(id);
      await refresh();
    },
    [refresh]
  );

  const removeTask = useCallback(
    async (id) => {
      await deleteTask(id);
      await refresh();
    },
    [refresh]
  );

  return {
    tasks,
    counts,
    loading,
    justAddedId,
    clearJustAdded: () => setJustAddedId(null),
    refresh,
    addTask,
    editTask,
    completeTaskById,
    removeTask,
  };
}
