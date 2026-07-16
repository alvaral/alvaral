"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import Section from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

const CSHARP_SAMPLES = [
  `public static string HelloWorld()
{
\treturn "Hello, World!";
}`,
  `public static int[] TwoSum(int[] nums, int target)
{
\tDictionary<int, int> indices = new Dictionary<int, int>();

\tfor (int i = 0; i < nums.Length; i++)
\t{
\t\tint diff = target - nums[i];
\t\tif (indices.ContainsKey(diff))
\t\t{
\t\t\treturn new int[] { indices[diff], i };
\t\t}

\t\tindices[nums[i]] = i;
\t}

\treturn new int[0];
}`,
  `public static bool IsPalindrome(string text)
{
\tint left = 0;
\tint right = text.Length - 1;

\twhile (left < right)
\t{
\t\tif (char.ToLower(text[left]) != char.ToLower(text[right]))
\t\t{
\t\t\treturn false;
\t\t}

\t\tleft++;
\t\tright--;
\t}

\treturn true;
}`,
  `public static int Factorial(int value)
{
\tif (value <= 1)
\t{
\t\treturn 1;
\t}

\treturn value * Factorial(value - 1);
}`,
];

function getRandomCSharpSample() {
  return CSHARP_SAMPLES[Math.floor(Math.random() * CSHARP_SAMPLES.length)];
}

type ContentMode = "text" | "csharp";

const CSHARP_KEYWORDS = new Set([
  "abstract",
  "as",
  "base",
  "bool",
  "break",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "decimal",
  "default",
  "delegate",
  "do",
  "double",
  "else",
  "enum",
  "event",
  "explicit",
  "extern",
  "false",
  "finally",
  "fixed",
  "float",
  "for",
  "foreach",
  "if",
  "implicit",
  "in",
  "int",
  "interface",
  "internal",
  "is",
  "lock",
  "long",
  "namespace",
  "new",
  "null",
  "object",
  "operator",
  "out",
  "override",
  "params",
  "private",
  "protected",
  "public",
  "readonly",
  "ref",
  "return",
  "sealed",
  "short",
  "sizeof",
  "stackalloc",
  "static",
  "string",
  "struct",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "uint",
  "ulong",
  "unchecked",
  "unsafe",
  "ushort",
  "using",
  "var",
  "virtual",
  "void",
  "volatile",
  "while",
]);

function countCorrectChars(source: string, typed: string) {
  let correct = 0;
  const limit = Math.min(source.length, typed.length);

  for (let index = 0; index < limit; index += 1) {
    if (source[index] === typed[index]) {
      correct += 1;
    }
  }

  return correct;
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function getStatusLabel(
  t: ReturnType<typeof useTranslations>,
  isCompleted: boolean,
  isRunning: boolean
) {
  if (isCompleted) return t("status.completed");
  if (isRunning) return t("status.running");
  return t("status.ready");
}

function getFirstWrongIndex(sourceText: string, typedText: string) {
  const limit = Math.min(sourceText.length, typedText.length);

  for (let index = 0; index < limit; index += 1) {
    if (sourceText[index] !== typedText[index]) {
      return index;
    }
  }

  if (typedText.length > sourceText.length) {
    return sourceText.length - 1;
  }

  return null;
}

function getCSharpSyntaxClasses(line: string) {
  const classes = Array.from({ length: line.length }, () => "");
  const commentStart = line.indexOf("//");
  const codeEnd = commentStart === -1 ? line.length : commentStart;

  if (commentStart !== -1) {
    for (let index = commentStart; index < line.length; index += 1) {
      classes[index] = "text-emerald-600";
    }
  }

  const stringPattern = /@"[^"]*(?:""[^"]*)*"|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])'/g;
  for (const match of line.slice(0, codeEnd).matchAll(stringPattern)) {
    const start = match.index ?? 0;
    for (let index = start; index < start + match[0].length; index += 1) {
      classes[index] = "text-amber-700";
    }
  }

  const tokenPattern = /\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b/g;
  for (const match of line.slice(0, codeEnd).matchAll(tokenPattern)) {
    const token = match[0];
    const start = match.index ?? 0;
    const syntaxClass = /^\d/.test(token)
      ? "text-orange-600"
      : CSHARP_KEYWORDS.has(token)
        ? "text-blue-600"
        : /^[A-Z]/.test(token)
          ? "text-cyan-700"
          : "";

    if (!syntaxClass) {
      continue;
    }

    for (let index = start; index < start + token.length; index += 1) {
      if (!classes[index]) {
        classes[index] = syntaxClass;
      }
    }
  }

  return classes;
}

function visibleText(text: string) {
  return text
    .replaceAll(" ", "\u00a0")
    .replace(/([A-Za-z0-9])\-([A-Za-z0-9])/g, "$1\u2011$2");
}

function renderCorrectSegment({
  text,
  syntaxClasses,
  keyPrefix,
}: {
  text: string;
  syntaxClasses: string[];
  keyPrefix: string;
}) {
  if (!text) {
    return null;
  }

  const segments: ReactNode[] = [];
  let segmentStart = 0;

  for (let index = 1; index <= text.length; index += 1) {
    if (index < text.length && syntaxClasses[index] === syntaxClasses[segmentStart]) {
      continue;
    }

    const syntaxClass = syntaxClasses[segmentStart];
    segments.push(
      <span
        key={`${keyPrefix}-${segmentStart}`}
        className={cn(syntaxClass || "text-slate-500 opacity-80")}
      >
        {visibleText(text.slice(segmentStart, index))}
      </span>
    );
    segmentStart = index;
  }

  return segments;
}

function renderLivePreview({
  sourceText,
  typedText,
  mistakeIndex,
  completed,
  contentMode,
  showLineNumbers,
}: {
  sourceText: string;
  typedText: string;
  mistakeIndex: number | null;
  completed: boolean;
  contentMode: ContentMode;
  showLineNumbers: boolean;
}) {
  const lines = sourceText.split("\n");
  const rows: ReactNode[] = [];
  let globalIndex = 0;
  const firstWrongIndex = getFirstWrongIndex(sourceText, typedText);
  const hasWrongCharacter = firstWrongIndex !== null;

  lines.forEach((line, lineIndex) => {
    const syntaxClasses =
      contentMode === "csharp" ? getCSharpSyntaxClasses(line) : [];
    const lineStart = globalIndex;
    const lineEnd = lineStart + line.length;
    const hasLineBreak = lineIndex < lines.length - 1;
    const typedLineBreak = typedText[lineEnd];
    const isLineBreakTyped = hasLineBreak && lineEnd < typedText.length;
    const isLineBreakWrong = isLineBreakTyped && typedLineBreak !== "\n";
    const isLineBreakForcedMistake = mistakeIndex === lineEnd;
    const isLineBreakCursor =
      hasLineBreak &&
      typedText.length === lineEnd &&
      !completed &&
      !isLineBreakForcedMistake;
    const isCurrentLine =
      typedText.length >= lineStart && typedText.length <= lineEnd && !completed;

    rows.push(
      <div
        key={`line-${lineIndex}`}
        className={cn(
          "grid rounded px-2 py-0.5",
          showLineNumbers ? "grid-cols-[2.25rem_1fr] gap-2" : "grid-cols-1",
          isCurrentLine ? "bg-slate-100" : ""
        )}
      >
        {showLineNumbers ? (
          <div className="select-none text-right text-slate-400">
            {lineIndex + 1}
          </div>
        ) : null}
        <div className="min-w-0 whitespace-pre-wrap break-words">
          {(() => {
            const typedEnd = Math.min(Math.max(typedText.length, lineStart), lineEnd);
            const correctEnd =
              firstWrongIndex !== null
                ? Math.min(typedEnd, Math.max(lineStart, firstWrongIndex))
                : typedEnd;
            const localCorrectEnd = Math.max(0, correctEnd - lineStart);
            const localCursor = Math.max(0, typedEnd - lineStart);
            const cursorIsInsideLine =
              typedText.length >= lineStart && typedText.length < lineEnd && !completed;
            const firstWrongIsInsideLine =
              firstWrongIndex !== null &&
              firstWrongIndex >= lineStart &&
              firstWrongIndex < lineEnd;
            const forcedMistakeIsInsideLine =
              mistakeIndex !== null &&
              mistakeIndex >= lineStart &&
              mistakeIndex < lineEnd;
            const firstMarkerIndex = forcedMistakeIsInsideLine
              ? mistakeIndex - lineStart
              : firstWrongIsInsideLine && firstWrongIndex !== null
                ? firstWrongIndex - lineStart
                : null;
            const showFirstMarker =
              firstMarkerIndex !== null && firstMarkerIndex >= localCorrectEnd;
            const firstMarkerEnd = showFirstMarker
              ? Math.min(firstMarkerIndex + 1, line.length)
              : localCorrectEnd;
            const showCursorMarker =
              cursorIsInsideLine &&
              localCursor >= firstMarkerEnd &&
              localCursor < line.length;
            const normalMiddleStart = showFirstMarker
              ? firstMarkerEnd
              : localCorrectEnd;
            const normalMiddleEnd = showCursorMarker ? localCursor : normalMiddleStart;
            const pendingStart = showCursorMarker
              ? Math.min(localCursor + 1, line.length)
              : normalMiddleStart;

            return (
              <>
                {renderCorrectSegment({
                  text: line.slice(0, localCorrectEnd),
                  syntaxClasses: syntaxClasses.slice(0, localCorrectEnd),
                  keyPrefix: `correct-${lineIndex}`,
                })}
                {showFirstMarker ? (
                  <span
                    className="rounded-[2px] bg-red-400/45 px-[0.08rem] text-slate-950 ring-1 ring-red-500/50"
                  >
                    {visibleText(line[firstMarkerIndex])}
                  </span>
                ) : null}
                <span className="text-slate-900">
                  {visibleText(line.slice(normalMiddleStart, normalMiddleEnd))}
                </span>
                {showCursorMarker ? (
                  <span
                    className={cn(
                      "rounded-[2px] underline-offset-4",
                      hasWrongCharacter
                        ? "text-slate-950 underline decoration-red-500 decoration-2"
                        : "animate-[typing-caret-slide_120ms_ease-out] bg-orange-300/65 px-[0.08rem] text-slate-950 ring-1 ring-orange-500/55"
                    )}
                  >
                    {visibleText(line[localCursor])}
                  </span>
                ) : null}
                <span className="text-slate-900">
                  {visibleText(line.slice(pendingStart))}
                </span>
                {line.length === 0 ? (
                  <span
                    className={cn(
                      "rounded-[2px] underline-offset-4",
                      typedText.length === lineStart &&
                        !completed &&
                        !hasWrongCharacter &&
                        "animate-[typing-caret-slide_120ms_ease-out] bg-orange-300/65 px-[0.08rem] text-slate-950 ring-1 ring-orange-500/55",
                      typedText.length === lineStart &&
                        !completed &&
                        hasWrongCharacter &&
                        "text-slate-950 underline decoration-red-500 decoration-2",
                      "text-slate-300"
                    )}
                  >
                    &nbsp;
                  </span>
                ) : null}
              </>
            );
          })()}
          {hasLineBreak &&
          (isLineBreakCursor || isLineBreakWrong || isLineBreakForcedMistake) ? (
            <span
              className={cn(
                "ml-0.5 rounded-[2px] px-[0.12rem] text-xs font-semibold underline-offset-4",
                (isLineBreakWrong || isLineBreakForcedMistake) &&
                  "bg-red-400/45 text-slate-950 ring-1 ring-red-500/50",
                isLineBreakCursor &&
                  !hasWrongCharacter &&
                  "animate-[typing-caret-slide_120ms_ease-out] bg-orange-300/65 text-slate-950 ring-1 ring-orange-500/55",
                isLineBreakCursor &&
                  hasWrongCharacter &&
                  "text-slate-950 underline decoration-red-500 decoration-2"
              )}
              aria-label="Enter"
            >
              ↵
            </span>
          ) : null}
        </div>
      </div>
    );

    globalIndex += line.length + 1;
  });

  return rows;
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

type CompletionSummary = {
  time: string;
  wpm: number;
  accuracy: number;
  errors: number;
};

export function TypingTrainerPageClient() {
  const t = useTranslations("typing");
  const [sourceDraft, setSourceDraft] = useState("");
  const [contentMode, setContentMode] = useState<ContentMode>("text");
  const [savedSourceText, setSavedSourceText] = useState("");
  const [savedContentMode, setSavedContentMode] =
    useState<ContentMode>("text");
  const [typedText, setTypedText] = useState("");
  const [forcedCorrection, setForcedCorrection] = useLocalStorage(
    "typing-forced-correction",
    true
  );
  const [splitView, setSplitView] = useLocalStorage("typing-split-view", false);
  const [showLineNumbers, setShowLineNumbers] = useLocalStorage(
    "typing-show-line-numbers",
    true
  );
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [elapsedBeforeSession, setElapsedBeforeSession] = useState(0);
  const [clock, setClock] = useState(() => Date.now());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [mistakeIndex, setMistakeIndex] = useState<number | null>(null);
  const [mistakeChar, setMistakeChar] = useState<string | null>(null);
  const [sessionErrors, setSessionErrors] = useState(0);
  const [maxProgressChars, setMaxProgressChars] = useState(0);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionSummary, setCompletionSummary] =
    useState<CompletionSummary | null>(null);
  const typingRef = useRef<HTMLTextAreaElement | null>(null);
  const errorStreakActiveRef = useRef(false);

  const hasSavedSource = savedSourceText.trim().length > 0;
  const activeSourceText = hasSavedSource ? savedSourceText : sourceDraft;

  const correctChars = useMemo(
    () => countCorrectChars(activeSourceText, typedText),
    [activeSourceText, typedText]
  );
  const errors = sessionErrors;
  const isCompleted =
    hasSavedSource && activeSourceText.length > 0 && typedText === activeSourceText;
  const elapsedMs = elapsedBeforeSession + (sessionStartedAt ? clock - sessionStartedAt : 0);
  const accuracy = activeSourceText.length
    ? Math.max(
        0,
        Math.min(
          100,
          Math.floor(
            ((activeSourceText.length - sessionErrors) / activeSourceText.length) *
              100
          )
        )
      )
    : 100;
  const wpm =
    elapsedMs > 0 ? Math.round((correctChars / 5 / elapsedMs) * 60000) : 0;
  const progress = activeSourceText.length
    ? Math.min(100, Math.round((maxProgressChars / activeSourceText.length) * 100))
    : 0;
  const canType = hasSavedSource && isRunning;
  const canSelectCompletedText = isCompleted && hasSavedSource;

  useEffect(() => {
    if (!isRunning || !sessionStartedAt || isCompleted) {
      return undefined;
    }

    const interval = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [isCompleted, isRunning, sessionStartedAt]);

  useEffect(() => {
    if (isRunning && sessionStartedAt === null) {
      setSessionStartedAt(Date.now());
      setClock(Date.now());
    }
  }, [isRunning, sessionStartedAt]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    window.requestAnimationFrame(() => typingRef.current?.focus());
  }, [isRunning, splitView]);

  useEffect(() => {
    if (isCompleted && isRunning) {
      const summary = {
        time: formatTime(elapsedMs),
        wpm,
        accuracy,
        errors,
      };
      setCompletionSummary(summary);
      setCompletionOpen(true);
      setIsRunning(false);
      if (sessionStartedAt) {
        setElapsedBeforeSession((previous) => previous + (Date.now() - sessionStartedAt));
      }
      setSessionStartedAt(null);
    }
  }, [accuracy, elapsedMs, errors, isCompleted, isRunning, sessionStartedAt, wpm]);

  useEffect(() => {
    if (!hasSavedSource) {
      setIsRunning(false);
      setSessionStartedAt(null);
      setElapsedBeforeSession(0);
      setTypedText("");
      setMistakeIndex(null);
      setMistakeChar(null);
      setSessionErrors(0);
      errorStreakActiveRef.current = false;
      setMaxProgressChars(0);
      setFeedback(null);
    }
  }, [hasSavedSource, setTypedText]);

  const saveSource = () => {
    const nextSource = sourceDraft.trimEnd();

    if (!nextSource.trim()) {
      setFeedback(t("feedback.saveSourceFirst"));
      return;
    }

    setSavedSourceText(nextSource);
    setSavedContentMode(contentMode);
    setTypedText("");
    setIsRunning(false);
    setSessionStartedAt(null);
    setElapsedBeforeSession(0);
    setMistakeIndex(null);
    setMistakeChar(null);
    setSessionErrors(0);
    errorStreakActiveRef.current = false;
    setMaxProgressChars(0);
    setFeedback(null);
    setCompletionOpen(false);
    setCompletionSummary(null);
    window.requestAnimationFrame(() => typingRef.current?.focus());
  };

  const toggleSession = () => {
    if (!hasSavedSource) {
      setFeedback(t("feedback.saveSourceFirst"));
      return;
    }

    if (isRunning) {
      if (sessionStartedAt) {
        setElapsedBeforeSession(
          (previous) => previous + (Date.now() - sessionStartedAt)
        );
      }
      setSessionStartedAt(null);
      setIsRunning(false);
      return;
    }

    setFeedback(null);
    setIsRunning(true);
    window.requestAnimationFrame(() => typingRef.current?.focus());
  };

  const handleSourceDraftChange = (value: string) => {
    setSourceDraft(value);
  };

  const handleSourceDraftKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${sourceDraft.slice(0, start)}\t${sourceDraft.slice(end)}`;

    setSourceDraft(nextValue);
    window.requestAnimationFrame(() => {
      textarea.selectionStart = start + 1;
      textarea.selectionEnd = start + 1;
    });
  };

  const handleTypingChange = (value: string) => {
    if (!hasSavedSource || !isRunning) {
      return;
    }

    const isAlignedWithSource = activeSourceText.startsWith(value);

    if (forcedCorrection && value && !isAlignedWithSource) {
      setMistakeIndex(typedText.length);
      setMistakeChar(value[typedText.length] ?? value[value.length - 1] ?? null);
      if (!errorStreakActiveRef.current) {
        setSessionErrors((previous) => previous + 1);
      }
      errorStreakActiveRef.current = true;
      setFeedback(t("feedback.forcedCorrection"));
      return;
    }

    if (!isAlignedWithSource) {
      if (!errorStreakActiveRef.current) {
        setSessionErrors((previous) => previous + 1);
      }
      errorStreakActiveRef.current = true;
    } else {
      errorStreakActiveRef.current = false;
      setMaxProgressChars((previous) => Math.max(previous, value.length));
    }

    setFeedback(null);
    setTypedText(value);
    setMistakeIndex(null);
    setMistakeChar(null);
  };

  const handleTypingKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();

    if (!hasSavedSource || !isRunning || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      handleTypingChange(typedText.slice(0, -1));
      return;
    }

    const nextCharacter =
      event.key === "Enter"
        ? "\n"
        : event.key === "Tab"
          ? "\t"
          : event.key.length === 1
            ? event.key
            : null;

    if (!nextCharacter) {
      return;
    }

    event.preventDefault();
    handleTypingChange(`${typedText}${nextCharacter}`);
  };

  const focusTypingArea = () => {
    if (!hasSavedSource) {
      setFeedback(t("feedback.saveSourceFirst"));
      return;
    }

    if (isCompleted) {
      return;
    }

    if (!isRunning) {
      toggleSession();
      return;
    }

    typingRef.current?.focus();
  };

  const handleReset = () => {
    setTypedText("");
    setIsRunning(false);
    setSessionStartedAt(null);
    setElapsedBeforeSession(0);
    setMistakeIndex(null);
    setMistakeChar(null);
    setSessionErrors(0);
    errorStreakActiveRef.current = false;
    setMaxProgressChars(0);
    setFeedback(null);
    window.requestAnimationFrame(() => typingRef.current?.focus());
  };

  const handleChangeSource = () => {
    setContentMode(savedContentMode);
    setSavedSourceText("");
    setTypedText("");
    setIsRunning(false);
    setSessionStartedAt(null);
    setElapsedBeforeSession(0);
    setMistakeIndex(null);
    setMistakeChar(null);
    setSessionErrors(0);
    errorStreakActiveRef.current = false;
    setMaxProgressChars(0);
    setFeedback(null);
    setCompletionOpen(false);
    setCompletionSummary(null);
  };

  const handleLoadSample = () => {
    const sample = getRandomCSharpSample();
    setSourceDraft(sample);
    setContentMode("csharp");
    setSavedSourceText("");
    setSavedContentMode("text");
    setTypedText("");
    setIsRunning(false);
    setSessionStartedAt(null);
    setElapsedBeforeSession(0);
    setMistakeIndex(null);
    setMistakeChar(null);
    setSessionErrors(0);
    errorStreakActiveRef.current = false;
    setMaxProgressChars(0);
    setFeedback(null);
    setCompletionOpen(false);
    setCompletionSummary(null);
  };

  const handleDialogReset = () => {
    setCompletionOpen(false);
    setCompletionSummary(null);
    handleReset();
  };

  const statusText = getStatusLabel(t, isCompleted, isRunning);
  const livePreview = renderLivePreview({
    sourceText: activeSourceText,
    typedText,
    mistakeIndex,
    completed: isCompleted,
    contentMode: savedContentMode,
    showLineNumbers,
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_42%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <Section
          customHeight={0}
          limitContentWidth={false}
          classes="rounded-[36px] border border-slate-200/80 bg-white p-6 shadow-[0_24px_100px_-70px_rgba(15,23,42,0.45)]"
        >
          <div className="space-y-3">
            <Badge variant="secondary" className="bg-slate-900 text-white">
              {t("hero.eyebrow")}
            </Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              {t("title")}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {t("description")}
            </p>
          </div>
        </Section>

        <Section
          customHeight={0}
          limitContentWidth={false}
          classes="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_90px_-70px_rgba(15,23,42,0.45)]"
        >
          <div className="flex h-full flex-col gap-5">
            {!hasSavedSource ? (
              <>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {t("source.title")}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {t("source.description")}
                      </p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {sourceDraft.length} {t("source.characterCount")}
                    </div>
                  </div>

                  <div className="mt-4 max-w-xs space-y-2">
                    <Label htmlFor="content-mode" className="text-sm text-slate-900">
                      {t("source.contentMode")}
                    </Label>
                    <Select
                      value={contentMode}
                      onValueChange={(value) =>
                        setContentMode(value as ContentMode)
                      }
                    >
                      <SelectTrigger id="content-mode" className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">
                          {t("source.contentModes.text")}
                        </SelectItem>
                        <SelectItem value="csharp">
                          {t("source.contentModes.csharp")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white p-4">
                      <div>
                        <Label
                          htmlFor="forced-correction"
                          className="text-sm text-slate-900"
                        >
                          {t("controls.forcedCorrection")}
                        </Label>
                        <p className="text-xs leading-5 text-slate-500">
                          {t("controls.forcedCorrectionHelp")}
                        </p>
                      </div>
                      <Switch
                        id="forced-correction"
                        checked={forcedCorrection}
                        onCheckedChange={setForcedCorrection}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white p-4">
                      <div>
                        <Label
                          htmlFor="split-view"
                          className="text-sm text-slate-900"
                        >
                          {t("controls.splitView")}
                        </Label>
                        <p className="text-xs leading-5 text-slate-500">
                          {t("controls.splitViewHelp")}
                        </p>
                      </div>
                      <Switch
                        id="split-view"
                        checked={splitView}
                        onCheckedChange={setSplitView}
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-white p-4">
                      <div>
                        <Label
                          htmlFor="line-numbers"
                          className="text-sm text-slate-900"
                        >
                          {t("controls.lineNumbers")}
                        </Label>
                        <p className="text-xs leading-5 text-slate-500">
                          {t("controls.lineNumbersHelp")}
                        </p>
                      </div>
                      <Switch
                        id="line-numbers"
                        checked={showLineNumbers}
                        onCheckedChange={setShowLineNumbers}
                      />
                    </div>
                  </div>

                  <Textarea
                    value={sourceDraft}
                    onChange={(event) => handleSourceDraftChange(event.target.value)}
                    onKeyDown={handleSourceDraftKeyDown}
                    placeholder={t("source.placeholder")}
                    className="mt-4 min-h-[170px] font-mono text-sm leading-6"
                    spellCheck={false}
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="bg-slate-900 text-white hover:bg-slate-800"
                      onClick={saveSource}
                      disabled={!sourceDraft.trim()}
                    >
                      {t("source.save")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      onClick={handleLoadSample}
                    >
                      {t("actions.loadSample")}
                    </Button>
                    <span className="text-sm text-slate-500">
                      {t("source.unsaved")}
                    </span>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  {t("session.idle")}
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="bg-slate-900 text-white hover:bg-slate-800"
                      onClick={toggleSession}
                      disabled={!hasSavedSource && !isRunning}
                    >
                      {isRunning ? t("session.stop") : t("session.start")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      onClick={handleReset}
                    >
                      {t("actions.reset")}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    onClick={handleChangeSource}
                  >
                    {t("actions.changeSource")}
                  </Button>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {t("session.title")}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t("session.description")}
                      </p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
                      {statusText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <MetricCard
                      label={t("stats.timer")}
                      value={formatTime(elapsedMs)}
                    />
                    <MetricCard label={t("stats.wpm")} value={String(wpm)} />
                    <MetricCard
                      label={t("stats.accuracy")}
                      value={`${accuracy}%`}
                    />
                    <MetricCard label={t("stats.errors")} value={String(errors)} />
                  </div>

                  <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
                      <span>{t("stats.progress")}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div
                    className={cn(
                      "mt-4 grid gap-4",
                      splitView && "xl:grid-cols-[1fr_0.95fr]"
                    )}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className="relative min-h-[260px] cursor-text rounded-[28px] border border-slate-200 bg-white p-4 text-left focus:outline-none focus:ring-2 focus:ring-slate-300"
                      onClick={canSelectCompletedText ? undefined : focusTypingArea}
                      onKeyDown={handleTypingKeyDown}
                    >
                      <div className="mb-2">
                        <p className="text-sm font-medium text-slate-900">
                          {splitView
                            ? t("livePreview.title")
                            : t("target.title")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {splitView
                            ? t("livePreview.description")
                            : t("target.description")}
                        </p>
                      </div>
                      <div className="mt-4 max-h-[420px] overflow-auto rounded-[8px] border border-slate-100 bg-slate-50 p-2 font-mono text-sm leading-5 text-slate-900 shadow-inner">
                        <div className={cn(canSelectCompletedText && "select-text")}>
                          {livePreview}
                        </div>
                      </div>
                      {!splitView ? (
                        <Textarea
                          ref={typingRef}
                          value={typedText}
                          onChange={(event) =>
                            handleTypingChange(event.target.value)
                          }
                          onKeyDown={handleTypingKeyDown}
                          className={cn(
                            "absolute inset-0 z-10 h-full min-h-full w-full cursor-text resize-none border-0 bg-transparent p-0 opacity-0 focus-visible:ring-0",
                            canSelectCompletedText && "pointer-events-none"
                          )}
                          spellCheck={false}
                          autoCapitalize="off"
                          autoCorrect="off"
                          autoComplete="off"
                          readOnly={!canType}
                          aria-label={t("target.title")}
                        />
                      ) : null}
                    </div>

                    {splitView ? (
                      <div
                        className="rounded-[28px] border border-slate-200 bg-white p-4"
                        onClick={focusTypingArea}
                      >
                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-900">
                            {t("target.title")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {t("target.description")}
                          </p>
                        </div>
                        <Textarea
                          ref={typingRef}
                          value={typedText}
                          onChange={(event) =>
                            handleTypingChange(event.target.value)
                          }
                          onKeyDown={handleTypingKeyDown}
                          placeholder={t("target.placeholder")}
                          className="min-h-[260px] border-slate-200 bg-white font-mono text-sm leading-6 text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-300"
                          spellCheck={false}
                          autoCapitalize="off"
                          autoCorrect="off"
                          autoComplete="off"
                          readOnly={!canType}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                {feedback ? (
                  <p className="text-sm text-amber-600">{feedback}</p>
                ) : isRunning ? (
                  <p className="text-sm text-slate-500">{t("tips.main")}</p>
                ) : (
                  <p className="text-sm text-slate-500">{t("session.idle")}</p>
                )}

                {mistakeChar ? (
                  <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                    {t("feedback.forcedMistake")}:{" "}
                    <span className="rounded bg-rose-100 px-1.5 py-0.5 text-rose-900">
                      {mistakeChar}
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </Section>
      </div>

      <Dialog open={completionOpen} onOpenChange={setCompletionOpen}>
        <DialogContent className="border-slate-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              {t("completion.title")}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {t("completion.description")}
            </DialogDescription>
          </DialogHeader>
          {completionSummary ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <MetricCard label={t("stats.timer")} value={completionSummary.time} />
              <MetricCard label={t("stats.wpm")} value={String(completionSummary.wpm)} />
              <MetricCard
                label={t("stats.accuracy")}
                value={`${completionSummary.accuracy}%`}
              />
              <MetricCard
                label={t("stats.errors")}
                value={String(completionSummary.errors)}
              />
            </div>
          ) : null}
          <DialogFooter className="mt-5 flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:w-auto"
              onClick={() => setCompletionOpen(false)}
            >
              {t("completion.keep")}
            </Button>
            <Button
              type="button"
              className="w-full bg-slate-900 text-white hover:bg-slate-800 sm:w-auto"
              onClick={handleDialogReset}
            >
              {t("completion.reset")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
