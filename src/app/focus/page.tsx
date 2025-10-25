"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Timer } from "@/components/focusTimer/timer";
import { TaskList } from "@/components/focusTimer/task-list";
import { CollapsibleCard } from "@/components/focusTimer/collapsible-card";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

import { format } from "date-fns";
import Section from "@/components/Section";

const nanoId = (length = 4) => {
  let id = "";
  while (id.length < length) {
    id += Math.random().toString(36).substr(2);
  }
  return id.substr(0, length);
};

type Task = {
  id: string;
  text: string;
  completed: boolean;
  time: number;
};

type CompletedTask = {
  date: string;
  count: number;
};

export default function Focus() {
  const t = useTranslations("focus");
  const today = new Date();
  const todayString = today.toLocaleDateString();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const tmr = new Date();
  tmr.setDate(tmr.getDate() + 1);

  const [mounted, setMounted] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [tempWorkMinutes, setTempWorkMinutes] = useState(workMinutes);
  const [tempBreakMinutes, setTempBreakMinutes] = useState(breakMinutes);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");

  const POMODORO_TIME = workMinutes * 60;
  const SHORT_BREAK = breakMinutes * 60;

  const [showCompleted, setShowCompleted] = useState(false);

  const [tasks, setTasks] = useLocalStorage<Task[]>(
    "pomodoro_tasks",
    [],
    (value) => {
      if (!Array.isArray(value)) return false;
      if (
        value.some((task) => {
          return (
            typeof task.id !== "string" ||
            typeof task.text !== "string" ||
            typeof task.completed !== "boolean" ||
            typeof task.time !== "number" ||
            task.time <= 0 ||
            new Date(task.time).toLocaleDateString() !== todayString ||
            new Date(task.time).getTime() < oneWeekAgo.getTime() ||
            new Date(task.time).getTime() > tmr.getTime()
          );
        })
      )
        return false;
      return true;
    }
  );
  const [newTask, setNewTask] = useState("");
  const [completedTasks, setCompletedTasks] = useLocalStorage<CompletedTask[]>(
    "pomodoro_completed_tasks",
    [],
    (value) => {
      if (!Array.isArray(value)) return false;
      if (
        value.some(
          (task) =>
            typeof task.date !== "string" || typeof task.count !== "number"
        )
      )
        return false;
      return true;
    }
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      new Audio("/notif.mp3").play().catch(() => {});
      if (mode === "work") {
        setMode("break");
        setTimeLeft(SHORT_BREAK);
      } else {
        setMode("work");
        setTimeLeft(POMODORO_TIME);
      }
      setIsRunning(false);
    }
    return () => interval && clearInterval(interval);
  }, [isRunning, timeLeft, mode, POMODORO_TIME, SHORT_BREAK]);

  const openSettings = () => {
    setTempWorkMinutes(workMinutes);
    setTempBreakMinutes(breakMinutes);
    setShowSettings(true);
  };

  const saveSettings = () => {
    setWorkMinutes(tempWorkMinutes);
    setBreakMinutes(tempBreakMinutes);
    setTimeLeft(tempWorkMinutes * 60);
    setMode("work");
    setShowSettings(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: nanoId(),
          text: newTask.trim(),
          completed: false,
          time: new Date().getTime(),
        },
      ]);
      setNewTask("");
    }
  };

  const handleToggleTask = (id: string) => {
    const toggledTask = tasks.find((t) => t.id === id);

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    if (!toggledTask) return;

    const todayFormatted = format(new Date(), "MMM dd");
    const updatedTasks = [...completedTasks];
    const todayIndex = updatedTasks.findIndex((t) => t.date === todayFormatted);

    const { completed } = toggledTask;
    const newCompleted = !completed;

    if (todayIndex >= 0) {
      updatedTasks[todayIndex].count += newCompleted ? 1 : -1;
    } else {
      updatedTasks.push({ date: todayFormatted, count: 1 });
    }

    setCompletedTasks(updatedTasks);
  };

  const filteredTasks = useMemo(() => {
    const ftasks = tasks.filter((task) =>
      showCompleted ? true : !task.completed
    );
    ftasks.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return a.time - b.time;
    });

    return ftasks;
  }, [showCompleted, tasks]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div className="max-w-2xl mx-auto w-full">
            <Section>
              <Timer
                timeLeft={timeLeft}
                isRunning={isRunning}
                mode={mode}
                totalTime={mode === "work" ? POMODORO_TIME : SHORT_BREAK}
                onToggle={() => setIsRunning(!isRunning)}
                onSettingsClick={openSettings}
                onReset={() => {
                  setTimeLeft(workMinutes * 60);
                  setIsRunning(false);
                  setMode("work");
                }}
              />
            </Section>
          </div>
          <div className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols gap-8">
            <Section delay={0.5}>
              <CollapsibleCard title={t("taskManager")}>
                <TaskList
                  tasks={filteredTasks}
                  newTask={newTask}
                  onNewTaskChange={setNewTask}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={(id) =>
                    setTasks(tasks.filter((t) => t.id !== id))
                  }
                  showCompleted={showCompleted}
                  onShowCompletedChange={setShowCompleted}
                />
              </CollapsibleCard>
            </Section>
          </div>
        </div>
        {showSettings && (
          <>
            <div
              className="fixed inset-0 z-40 bg-opacity-20 backdrop-blur-lg"
              onClick={() => setShowSettings(false)}
            ></div>

            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg w-[300px] border-2">
              <h2 className="text-lg font-semibold mb-4">
                {t("settings.title")}
              </h2>
              <label className="block mb-2">
                {t("settings.workDuration")}
                <input
                  type="number"
                  min={1}
                  value={tempWorkMinutes}
                  onChange={(e) => setTempWorkMinutes(Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </label>
              <label className="block mb-4">
                {t("settings.breakDuration")}
                <input
                  type="number"
                  min={1}
                  value={tempBreakMinutes}
                  onChange={(e) => setTempBreakMinutes(Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </label>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowSettings(false)}
                >
                  {t("settings.cancel")}
                </Button>
                <Button
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={saveSettings}
                >
                  {t("settings.save")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
