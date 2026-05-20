import { format } from "date-fns";

export type TimerMode = "work" | "break";

export type FocusTask = {
  id: string;
  text: string;
  completed: boolean;
  time: number;
};

export type CompletedTask = {
  date: string;
  count: number;
};

export const DEFAULT_WORK_MINUTES = 25;
export const DEFAULT_BREAK_MINUTES = 5;
export const MIN_DURATION_MINUTES = 1;
export const MAX_DURATION_MINUTES = 180;
export const TASK_STORAGE_KEY = "pomodoro_tasks";
export const COMPLETED_TASKS_STORAGE_KEY = "pomodoro_completed_tasks";

export function clampDurationMinutes(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;

  return Math.min(
    MAX_DURATION_MINUTES,
    Math.max(MIN_DURATION_MINUTES, Math.trunc(value))
  );
}

export function isSameLocalDay(timestamp: number, date: Date) {
  const taskDate = new Date(timestamp);

  return (
    taskDate.getFullYear() === date.getFullYear() &&
    taskDate.getMonth() === date.getMonth() &&
    taskDate.getDate() === date.getDate()
  );
}

export function isFocusTask(
  value: unknown,
  now = new Date()
): value is FocusTask {
  if (!value || typeof value !== "object") return false;

  const task = value as Partial<FocusTask>;

  return (
    typeof task.id === "string" &&
    typeof task.text === "string" &&
    task.text.trim().length > 0 &&
    typeof task.completed === "boolean" &&
    typeof task.time === "number" &&
    task.time > 0 &&
    isSameLocalDay(task.time, now)
  );
}

export function isCompletedTask(value: unknown): value is CompletedTask {
  if (!value || typeof value !== "object") return false;

  const task = value as Partial<CompletedTask>;

  return (
    typeof task.date === "string" &&
    task.date.trim().length > 0 &&
    typeof task.count === "number" &&
    Number.isInteger(task.count) &&
    task.count >= 0
  );
}

export function isFocusTaskList(value: unknown): value is FocusTask[] {
  return Array.isArray(value) && value.every((task) => isFocusTask(task));
}

export function isCompletedTaskList(value: unknown): value is CompletedTask[] {
  return Array.isArray(value) && value.every(isCompletedTask);
}

export function createTaskId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function getCompletedTaskKey(date = new Date()) {
  return format(date, "MMM dd");
}

export function updateCompletedTasks(
  completedTasks: CompletedTask[],
  date: string,
  delta: number
) {
  const nextCompletedTasks = [...completedTasks];
  const todayIndex = nextCompletedTasks.findIndex((task) => task.date === date);

  if (todayIndex < 0) {
    return delta > 0
      ? [...nextCompletedTasks, { date, count: delta }]
      : nextCompletedTasks;
  }

  const nextCount = Math.max(0, nextCompletedTasks[todayIndex].count + delta);

  if (nextCount === 0) {
    nextCompletedTasks.splice(todayIndex, 1);
    return nextCompletedTasks;
  }

  nextCompletedTasks[todayIndex] = {
    ...nextCompletedTasks[todayIndex],
    count: nextCount,
  };

  return nextCompletedTasks;
}
