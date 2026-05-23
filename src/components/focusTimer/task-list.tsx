"use client";

import { X, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  newTask: string;
  onNewTaskChange: (value: string) => void;
  onAddTask: (e: React.FormEvent) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  showCompleted: boolean;
  onShowCompletedChange: (value: boolean) => void;
}

export function TaskList({
  tasks,
  newTask,
  onNewTaskChange,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  showCompleted = false,
  onShowCompletedChange,
}: TaskListProps) {
  const t = useTranslations("focus.taskList");

  return (
    <div className="p-6 text-gray-950">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-950">
            {t("showCompleted")}
          </span>
          <Switch
            checked={showCompleted}
            onCheckedChange={onShowCompletedChange}
            style={{ backgroundColor: "black" }}
          />
        </div>
      </div>
      <form onSubmit={onAddTask} className="flex gap-2 mb-4">
        <Input
          placeholder={t("addTaskPlaceholder")}
          value={newTask}
          onChange={(e) => onNewTaskChange(e.target.value)}
          className="text-gray-950 placeholder:text-gray-900"
        />
        <Button type="submit" className="cursor-pointer">
          <Plus className="mr-2" /> {t("addButton")}
        </Button>
      </form>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
            >
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={task.completed ? "default" : "outline"}
                  className="w-6 h-6 p-0"
                  onClick={() => onToggleTask(task.id)}
                >
                  {task.completed && <Check className="h-4 w-4" />}
                </Button>
                <span
                  className={
                    task.completed
                      ? "text-gray-700 line-through"
                      : "text-gray-950"
                  }
                >
                  {task.text}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => onDeleteTask(task.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
