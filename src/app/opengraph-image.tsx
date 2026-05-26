import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "alvaral";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f8fafc",
          color: "#111827",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          <span>{siteConfig.name}</span>
          <span style={{ color: "#64748b", fontSize: 24 }}>
            Software engineering
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 86,
              fontWeight: 800,
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            {siteConfig.author}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              color: "#475569",
              fontSize: 34,
              lineHeight: 1.25,
            }}
          >
            Technical writing, software projects, and notes from developer life.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: 8,
            width: "100%",
            background: "#111827",
          }}
        />
      </div>
    ),
    size
  );
}
