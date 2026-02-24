import { cn } from "@/lib/utils";
import { getImpactLabel } from "@/lib/axe-ja";
import type { Impact } from "@/lib/types";

const impactStyles: Record<Impact, string> = {
  critical:
    "bg-severity-critical text-severity-critical-foreground",
  serious:
    "bg-severity-serious text-severity-serious-foreground",
  moderate:
    "bg-severity-moderate text-severity-moderate-foreground",
  minor: "bg-severity-minor text-severity-minor-foreground",
  unknown: "bg-muted text-muted-foreground",
};

export function SeverityBadge({
  impact,
  className,
}: {
  impact: Impact;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium",
        impactStyles[impact],
        className
      )}
    >
      {getImpactLabel(impact)}
    </span>
  );
}
