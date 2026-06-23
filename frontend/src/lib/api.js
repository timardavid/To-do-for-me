import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
});

export async function fetchTasks(view, search) {
  const { data } = await client.get("/tasks", { params: { view, search } });
  return data;
}

export async function createTask(payload) {
  const { data } = await client.post("/tasks", payload);
  return data.task;
}

export async function updateTask(id, payload) {
  const { data } = await client.put(`/tasks/${id}`, payload);
  return data.task;
}

export async function completeTask(id) {
  const { data } = await client.patch(`/tasks/${id}/complete`);
  return data.task;
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}

export async function fetchDueReminders() {
  const { data } = await client.get("/tasks/due-reminders");
  return data.tasks;
}

export function apiErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}
