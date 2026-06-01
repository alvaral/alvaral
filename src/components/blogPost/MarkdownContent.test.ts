import { describe, expect, it } from "vitest";
import { parseMarkdownBlocks } from "@/components/blogPost/MarkdownContent";

describe("MarkdownContent parsing", () => {
  it("keeps fenced text blocks together and preserves blank lines", () => {
    const markdown = [
      "Intro",
      "",
      "```text",
      "line one",
      "",
      "line three",
      "```",
      "",
      "Outro",
    ].join("\n");

    expect(parseMarkdownBlocks(markdown)).toEqual([
      {
        type: "text",
        value: "Intro",
      },
      {
        type: "code",
        language: "text",
        value: "line one\n\nline three",
      },
      {
        type: "text",
        value: "Outro",
      },
    ]);
  });

  it("parses markdown separators as thematic breaks", () => {
    expect(parseMarkdownBlocks("Intro\n\n---\n\nOutro")).toEqual([
      {
        type: "text",
        value: "Intro",
      },
      {
        type: "thematicBreak",
      },
      {
        type: "text",
        value: "Outro",
      },
    ]);
  });
});
