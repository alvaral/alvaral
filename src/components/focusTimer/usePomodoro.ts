"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";

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

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const MIN_DURATION_MINUTES = 1;
const MAX_DURATION_MINUTES = 180;
const TASK_STORAGE_KEY = "pomodoro_tasks";
const COMPLETED_TASKS_STORAGE_KEY = "pomodoro_completed_tasks";

function clampDurationMinutes(value: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;

  return Math.min(
    MAX_DURATION_MINUTES,
    Math.max(MIN_DURATION_MINUTES, Math.trunc(value))
  );
}

function isSameLocalDay(timestamp: number, date: Date) {
  const taskDate = new Date(timestamp);

  return (
    taskDate.getFullYear() === date.getFullYear() &&
    taskDate.getMonth() === date.getMonth() &&
    taskDate.getDate() === date.getDate()
  );
}

function isFocusTask(value: unknown, now = new Date()): value is FocusTask {
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

function isCompletedTask(value: unknown): value is CompletedTask {
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

function isFocusTaskList(value: unknown): value is FocusTask[] {
  return Array.isArray(value) && value.every((task) => isFocusTask(task));
}

function isCompletedTaskList(value: unknown): value is CompletedTask[] {
  return Array.isArray(value) && value.every(isCompletedTask);
}

function createTaskId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getCompletedTaskKey(date = new Date()) {
  return format(date, "MMM dd");
}

function updateCompletedTasks(
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

export function usePomodoro() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
  const [tempWorkMinutes, setTempWorkMinutes] = useState(workMinutes);
  const [tempBreakMinutes, setTempBreakMinutes] = useState(breakMinutes);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const [showCompleted, setShowCompleted] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useLocalStorage<FocusTask[]>(
    TASK_STORAGE_KEY,
    [],
    isFocusTaskList
  );
  const [, setCompletedTasks] = useLocalStorage<CompletedTask[]>(
    COMPLETED_TASKS_STORAGE_KEY,
    [],
    isCompletedTaskList
  );

  const workSeconds = workMinutes * 60;
  const breakSeconds = breakMinutes * 60;
  const totalTime = mode === "work" ? workSeconds : breakSeconds;

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setTimeLeft((currentTimeLeft) => Math.max(0, currentTimeLeft - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft > 0) return;

    new Audio("/notif.mp3").play().catch(() => {});
    setIsRunning(false);

    setMode((currentMode) => {
      const nextMode = currentMode === "work" ? "break" : "work";
      setTimeLeft(nextMode === "work" ? workSeconds : breakSeconds);
      return nextMode;
    });
  }, [breakSeconds, timeLeft, workSeconds]);

  const openSettings = useCallback(() => {
    setTempWorkMinutes(workMinutes);
    setTempBreakMinutes(breakMinutes);
    setShowSettings(true);
  }, [breakMinutes, workMinutes]);

  const cancelSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const saveSettings = useCallback(() => {
    const nextWorkMinutes = clampDurationMinutes(
      tempWorkMinutes,
      DEFAULT_WORK_MINUTES
    );
    const nextBreakMinutes = clampDurationMinutes(
      tempBreakMinutes,
      DEFAULT_BREAK_MINUTES
    );

    setWorkMinutes(nextWorkMinutes);
    setBreakMinutes(nextBreakMinutes);
    setTimeLeft(nextWorkMinutes * 60);
    setMode("work");
    setIsRunning(false);
    setShowSettings(false);
  }, [tempBreakMinutes, tempWorkMinutes]);

  const toggleTimer = useCallback(() => {
    setIsRunning((currentIsRunning) => !currentIsRunning);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(workSeconds);
    setIsRunning(false);
    setMode("work");
  }, [workSeconds]);

  const handleAddTask = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const text = newTask.trim();
      if (!text) return;

      setTasks((currentTasks) => [
        ...currentTasks,
        {
          id: createTaskId(),
          text,
          completed: false,
          time: Date.now(),
        },
      ]);
      setNewTask("");
    },
    [newTask, setTasks]
  );

  const handleToggleTask = useCallback(
    (id: string) => {
      const toggledTask = tasks.find((task) => task.id === id);
      if (!toggledTask) return;

      const nextCompleted = !toggledTask.completed;
      const delta = nextCompleted ? 1 : -1;
      const completedTaskKey = getCompletedTaskKey();

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? { ...task, completed: nextCompleted } : task
        )
      );
      setCompletedTasks((currentCompletedTasks) =>
        updateCompletedTasks(currentCompletedTasks, completedTaskKey, delta)
      );
    },
    [setCompletedTasks, setTasks, tasks]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      const deletedTask = tasks.find((task) => task.id === id);
      if (!deletedTask) return;

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));

      if (deletedTask.completed) {
        setCompletedTasks((currentCompletedTasks) =>
          updateCompletedTasks(currentCompletedTasks, getCompletedTaskKey(), -1)
        );
      }
    },
    [setCompletedTasks, setTasks, tasks]
  );

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => showCompleted || !task.completed)
      .sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return a.time - b.time;
      });
  }, [showCompleted, tasks]);

  return {
    breakMinutes,
    cancelSettings,
    filteredTasks,
    handleAddTask,
    handleDeleteTask,
    handleToggleTask,
    isRunning,
    mode,
    newTask,
    openSettings,
    resetTimer,
    saveSettings,
    setNewTask,
    setShowCompleted,
    setTempBreakMinutes,
    setTempWorkMinutes,
    showCompleted,
    showSettings,
    tempBreakMinutes,
    tempWorkMinutes,
    timeLeft,
    toggleTimer,
    totalTime,
    workMinutes,
  };
}
