import { describe, expect, it } from "vitest";
import { getLatestPost, getPostById, getPosts } from "@/posts/posts";

describe("post helpers", () => {
  it("returns posts sorted from newest to oldest", () => {
    const posts = getPosts("en");

    expect(posts.map((post) => post.id)).toEqual([
      "frontend-vs-backend",
      "ideal-developer",
    ]);
  });

  it("returns translated post metadata", () => {
    expect(getPostById("ideal-developer", "es")?.title).toBe(
      "El desarrollador de software ideal"
    );
  });

  it("falls back to English for unsupported locales", () => {
    expect(getPostById("ideal-developer", "fr")?.title).toBe(
      "The Ideal Software Developer"
    );
  });

  it("returns the latest post", () => {
    expect(getLatestPost("en").id).toBe("frontend-vs-backend");
  });
});
