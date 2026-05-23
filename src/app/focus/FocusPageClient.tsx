"use client";

import { useTranslations } from "next-intl";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/focusTimer/timer";
import { TaskList } from "@/components/focusTimer/task-list";
import { CollapsibleCard } from "@/components/focusTimer/collapsible-card";
import { usePomodoro } from "@/components/focusTimer/usePomodoro";

export function FocusPageClient() {
  const t = useTranslations("focus");
  const pomodoro = usePomodoro();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-8">
          <div className="max-w-2xl mx-auto w-full">
            <Section>
              <Timer
                timeLeft={pomodoro.timeLeft}
                isRunning={pomodoro.isRunning}
                mode={pomodoro.mode}
                totalTime={pomodoro.totalTime}
                onToggle={pomodoro.toggleTimer}
                onSettingsClick={pomodoro.openSettings}
                onReset={pomodoro.resetTimer}
              />
            </Section>
          </div>
          <div className="max-w-2xl mx-auto w-full grid grid-cols-1 gap-8">
            <Section delay={0.5}>
              <CollapsibleCard title={t("taskManager")}>
                <TaskList
                  tasks={pomodoro.filteredTasks}
                  newTask={pomodoro.newTask}
                  onNewTaskChange={pomodoro.setNewTask}
                  onAddTask={pomodoro.handleAddTask}
                  onToggleTask={pomodoro.handleToggleTask}
                  onDeleteTask={pomodoro.handleDeleteTask}
                  showCompleted={pomodoro.showCompleted}
                  onShowCompletedChange={pomodoro.setShowCompleted}
                />
              </CollapsibleCard>
            </Section>
          </div>
        </div>
        {pomodoro.showSettings && (
          <>
            <div
              className="fixed inset-0 z-40 bg-opacity-20 backdrop-blur-lg"
              onClick={pomodoro.cancelSettings}
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
                  max={180}
                  value={pomodoro.tempWorkMinutes}
                  onChange={(event) =>
                    pomodoro.setTempWorkMinutes(Number(event.target.value))
                  }
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </label>
              <label className="block mb-4">
                {t("settings.breakDuration")}
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={pomodoro.tempBreakMinutes}
                  onChange={(event) =>
                    pomodoro.setTempBreakMinutes(Number(event.target.value))
                  }
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </label>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={pomodoro.cancelSettings}
                >
                  {t("settings.cancel")}
                </Button>
                <Button
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={pomodoro.saveSettings}
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
