function pad(n) {
  return String(n).padStart(2, "0");
}

export function parseDueDate(task) {
  if (!task.due_date) return null;
  const date = new Date(task.due_date);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDatetimeLocalValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function datetimeLocalToApi(value) {
  if (!value) return "";
  return value.replace("T", " ");
}

export function isOverdue(task) {
  const due = parseDueDate(task);
  return Boolean(due) && !task.done && due.getTime() < Date.now();
}

export function isDueToday(task) {
  const due = parseDueDate(task);
  if (!due || task.done) return false;
  return due.toDateString() === new Date().toDateString();
}

export function isUpcoming(task) {
  const due = parseDueDate(task);
  if (!due || task.done) return false;
  const now = Date.now();
  return due.getTime() >= now && due.getTime() <= now + 7 * 24 * 60 * 60 * 1000;
}

export function dueLabel(task) {
  const due = parseDueDate(task);
  if (!due) return "Nincs határidő";
  const now = new Date();
  const time = `${pad(due.getHours())}:${pad(due.getMinutes())}`;
  if (due.toDateString() === now.toDateString()) return `Ma, ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (due.toDateString() === tomorrow.toDateString()) return `Holnap, ${time}`;
  return `${due.getFullYear()}-${pad(due.getMonth() + 1)}-${pad(due.getDate())} ${time}`;
}
