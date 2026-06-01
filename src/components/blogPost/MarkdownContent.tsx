import HighlightedParagraph from "@/components/HighlightedParagraph";
import PostHeading from "@/components/blogPost/PostHeading";
import PostParagraph from "@/components/blogPost/PostParagraph";

type MarkdownContentProps = {
  content: string;
};

export type MarkdownBlock =
  | {
      type: "text";
      value: string;
    }
  | {
      type: "code";
      language: string;
      value: string;
    }
  | {
      type: "thematicBreak";
    };

const CODE_FENCE_PATTERN = /^```([a-zA-Z0-9_-]*)\s*$/;
const THEMATIC_BREAK_PATTERN = /^(?:-{3,}|\*{3,}|_{3,})$/;

function isThematicBreak(line: string) {
  return THEMATIC_BREAK_PATTERN.test(line.trim());
}

export function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let textLines: string[] = [];

  function flushTextBlock() {
    const value = textLines.join("\n").trim();
    textLines = [];

    if (value) {
      blocks.push({
        type: "text",
        value,
      });
    }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.trim().match(CODE_FENCE_PATTERN);

    if (fenceMatch) {
      flushTextBlock();

      const codeLines: string[] = [];
      const language = fenceMatch[1] ?? "";
      index += 1;

      while (
        index < lines.length &&
        !CODE_FENCE_PATTERN.test(lines[index].trim())
      ) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({
        type: "code",
        language,
        value: codeLines.join("\n"),
      });
      continue;
    }

    if (!line.trim()) {
      flushTextBlock();
      continue;
    }

    if (isThematicBreak(line)) {
      flushTextBlock();
      blocks.push({ type: "thematicBreak" });
      continue;
    }

    textLines.push(line);
  }

  flushTextBlock();
  return blocks;
}

function renderInline(text: string) {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }

      return part;
    });
}

function renderLines(block: string) {
  return block.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {renderInline(line)}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "thematicBreak") {
          return (
            <hr
              key={index}
              className="my-8 border-0 border-t border-gray-200"
            />
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="mb-6 overflow-x-auto rounded-md border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-900"
            >
              <code
                className={
                  block.language ? `language-${block.language}` : undefined
                }
              >
                {block.value}
              </code>
            </pre>
          );
        }

        if (block.value.startsWith("# ")) {
          return (
            <PostHeading key={index} level={1}>
              {block.value.replace(/^#\s+/, "")}
            </PostHeading>
          );
        }

        if (block.value.startsWith("## ")) {
          return (
            <PostHeading key={index} level={2}>
              {block.value.replace(/^##\s+/, "")}
            </PostHeading>
          );
        }

        if (block.value.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-semibold mt-8 mb-3">
              {block.value.replace(/^###\s+/, "")}
            </h3>
          );
        }

        const lines = block.value.split("\n");
        const isList = lines.every((line) => /^[-*]\s+/.test(line));

        if (isList) {
          return (
            <ul key={index} className="list-disc pl-6 mb-5 space-y-2">
              {lines.map((line, lineIndex) => (
                <li key={`${line}-${lineIndex}`}>
                  {renderInline(line.replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        if (block.value.startsWith(">")) {
          return (
            <HighlightedParagraph key={index}>
              {renderLines(block.value.replace(/^>\s?/gm, ""))}
            </HighlightedParagraph>
          );
        }

        return (
          <PostParagraph key={index}>{renderLines(block.value)}</PostParagraph>
        );
      })}
    </>
  );
}
