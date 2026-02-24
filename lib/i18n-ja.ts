import type { Impact } from "@/lib/types";

export function impactToJa(impact: string | null | undefined): Impact {
  switch (impact) {
    case "critical":
      return "critical";
    case "serious":
      return "serious";
    case "moderate":
      return "moderate";
    case "minor":
      return "minor";
    default:
      return "unknown";
  }
}

export function impactLabelJa(impact: string | null | undefined): string {
  switch (impact) {
    case "critical":
      return "重大";
    case "serious":
      return "高";
    case "moderate":
      return "中";
    case "minor":
      return "低";
    default:
      return "未分類";
  }
}
