import { describe, expect, it } from "vitest";
import {
  clampDurationMinutes,
  isCompletedTask,
  isFocusTask,
  isSameLocalDay,
  updateCompletedTasks,
} from "@/components/focusTimer/pomodoro-utils";

describe("pomodoro utilities", () => {
  it("clamps settings durations to supported minute bounds", () => {
    expect(clampDurationMinutes(0, 25)).toBe(1);
    expect(clampDurationMinutes(181, 25)).toBe(180);
    expect(clampDurationMinutes(Number.NaN, 25)).toBe(25);
    expect(clampDurationMinutes(12.8, 25)).toBe(12);
  });

  it("validates tasks for the current local day", () => {
    const now = new Date("2026-05-20T12:00:00");

    expect(
      isFocusTask(
        {
          id: "task-1",
          text: "Write",
          completed: false,
          time: new Date("2026-05-20T08:00:00").getTime(),
        },
        now
      )
    ).toBe(true);
    expect(
      isFocusTask(
        {
          id: "task-1",
          text: "Write",
          completed: false,
          time: new Date("2026-05-19T23:59:00").getTime(),
        },
        now
      )
    ).toBe(false);
  });

  it("checks local-day equality", () => {
    expect(
      isSameLocalDay(
        new Date("2026-05-20T01:00:00").getTime(),
        new Date("2026-05-20T23:00:00")
      )
    ).toBe(true);
  });

  it("keeps completed task counters non-negative", () => {
    expect(updateCompletedTasks([], "May 20", 1)).toEqual([
      { date: "May 20", count: 1 },
    ]);
    expect(
      updateCompletedTasks([{ date: "May 20", count: 1 }], "May 20", -1)
    ).toEqual([]);
  });

  it("rejects invalid completed task counters", () => {
    expect(isCompletedTask({ date: "May 20", count: 0 })).toBe(true);
    expect(isCompletedTask({ date: "May 20", count: -1 })).toBe(false);
  });
});
