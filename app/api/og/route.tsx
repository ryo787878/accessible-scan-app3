import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = 86_400;

const themes = {
  lp: { label: "LP", color: "#0f172a", accent: "#22c55e" },
  blog: { label: "BLOG", color: "#111827", accent: "#38bdf8" },
  comparison: { label: "COMPARISON", color: "#1f2937", accent: "#f59e0b" },
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type");
  const titleParam = searchParams.get("title") ?? "Accessible Scan";

  const type = typeParam === "blog" || typeParam === "comparison" ? typeParam : "lp";
  const theme = themes[type];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${theme.color} 0%, #020617 100%)`,
          color: "white",
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            borderRadius: "9999px",
            border: `2px solid ${theme.accent}`,
            padding: "8px 20px",
            fontSize: 28,
            color: theme.accent,
          }}
        >
          {theme.label}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{titleParam}</div>
          <div style={{ fontSize: 34, color: "#cbd5e1" }}>Accessible Scan</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
        "CDN-Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}
