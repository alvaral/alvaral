import HighlightedParagraph from "@/components/HighlightedParagraph";
import PostHeading from "@/components/blogPost/PostHeading";
import PostParagraph from "@/components/blogPost/PostParagraph";

type MarkdownContentProps = {
  content: string;
};

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
  const blocks = content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.startsWith("# ")) {
          return (
            <PostHeading key={index} level={1}>
              {block.replace(/^#\s+/, "")}
            </PostHeading>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <PostHeading key={index} level={2}>
              {block.replace(/^##\s+/, "")}
            </PostHeading>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-semibold mt-8 mb-3">
              {block.replace(/^###\s+/, "")}
            </h3>
          );
        }

        const lines = block.split("\n");
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

        if (block.startsWith(">")) {
          return (
            <HighlightedParagraph key={index}>
              {renderLines(block.replace(/^>\s?/gm, ""))}
            </HighlightedParagraph>
          );
        }

        return <PostParagraph key={index}>{renderLines(block)}</PostParagraph>;
      })}
    </>
  );
}
