"use client";

import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TimerProps {
  timeLeft: number;
  isRunning: boolean;
  mode: "work" | "break";
  totalTime: number;
  onToggle: () => void;
  onReset: () => void;
  onSettingsClick?: () => void;
}

export function Timer({
  timeLeft,
  isRunning,
  mode,
  totalTime,
  onToggle,
  onReset,
  onSettingsClick,
}: TimerProps) {
  const t = useTranslations("focus.timer");
  const safeTotalTime = Math.max(totalTime, 1);

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(seconds, 0);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressColor = (timeLeft: number, totalTime: number) => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage > 60) return "bg-emerald-500 dark:bg-emerald-600";
    if (percentage > 20) return "bg-sky-500 dark:bg-sky-600";
    if (percentage > 8) return "bg-amber-500 dark:bg-amber-600";
    return "bg-rose-500 dark:bg-rose-600";
  };

  return (
    <Card className="p-8 sm:p-12 text-center shadow-lg border-2 bg-gradient-to-b from-background to-muted/20">
      <div className="flex justify-end mb-4">
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            aria-label={t("settingsLabel")}
            className="p-1 rounded bg-white hover:bg-gray-100 hover:cursor-pointer"
          >
            <Settings className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            {mode === "work" ? t("focusTime") : t("breakTime")}
          </h2>
          <div className="text-6xl sm:text-8xl font-bold mb-6 text-primary tracking-tight">
            {formatTime(timeLeft)}
          </div>
        </div>
        <Progress
          value={(timeLeft / safeTotalTime) * 100}
          className={cn(
            "h-3 transition-colors duration-300",
            getProgressColor(timeLeft, safeTotalTime)
          )}
        />

        <div className="flex justify-center items-center flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
          <Button
            onClick={onToggle}
            size="lg"
            className="w-36 h-12 text-lg hover:cursor-pointer hover:bg-gray-100"
          >
            {isRunning ? (
              <Pause className="mr-2 h-6 w-6" />
            ) : (
              <Play className="mr-2 h-6 w-6" />
            )}
            {isRunning ? t("pause") : t("start")}
          </Button>
          <Button
            size="lg"
            onClick={onReset}
            className="w-36 h-12 text-lg hover:cursor-pointer hover:bg-gray-100"
          >
            <RotateCcw className="mr-2 h-6 w-6" /> {t("reset")}
          </Button>
        </div>
      </div>
    </Card>
  );
}
