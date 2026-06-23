import { CalendarClock, CheckCircle2, ListTodo, PartyPopper, Sparkles, Sun, TriangleAlert } from "lucide-react";

export const PRIORITIES = [
  { key: "high", label: "Magas" },
  { key: "medium", label: "Közepes" },
  { key: "low", label: "Alacsony" },
];

export const PRIORITY_LABEL = Object.fromEntries(PRIORITIES.map((p) => [p.key, p.label]));
export const PRIORITY_KEY_BY_LABEL = Object.fromEntries(PRIORITIES.map((p) => [p.label, p.key]));

export const PRIORITY_COLOR = {
  high: "var(--color-danger)",
  medium: "var(--color-warning)",
  low: "var(--color-success)",
};

export const CATEGORIES = ["Általános", "Munka", "Személyes", "Üzlet", "Egészség", "Pénzügy"];

export const REMINDER_OPTIONS = [
  { label: "Nincs", minutes: 0 },
  { label: "10 perc előbb", minutes: 10 },
  { label: "30 perc előbb", minutes: 30 },
  { label: "1 óra előbb", minutes: 60 },
  { label: "1 nap előbb", minutes: 1440 },
];

export const NAV_ITEMS = [
  { key: "all", icon: ListTodo, label: "Összes" },
  { key: "today", icon: Sun, label: "Ma" },
  { key: "upcoming", icon: CalendarClock, label: "Közelgő" },
  { key: "overdue", icon: TriangleAlert, label: "Lejárt" },
  { key: "done", icon: CheckCircle2, label: "Kész" },
];

export const EMPTY_STATES = {
  all: { icon: ListTodo, message: "Nincs feladatod.\nAdj hozzá egyet a + gombbal!" },
  today: { icon: Sun, message: "Nincs mára ütemezett feladat." },
  upcoming: { icon: CalendarClock, message: "Nincs közelgő feladat a következő 7 napban." },
  overdue: { icon: Sparkles, message: "Nincs lejárt feladat. Szuper!" },
  done: { icon: PartyPopper, message: "Minden készen van!" },
};
