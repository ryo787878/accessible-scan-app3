import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  title: string;
  description?: string;
  meta?: string;
  variant?: "default" | "index" | "article";
};

const variantClasses = {
  default: "bg-muted/30 border-dashed",
  index: "bg-muted/25 border",
  article: "bg-background border",
} as const;

export function PageIntro({ title, description, meta, variant = "default" }: PageIntroProps) {
  return (
    <Card className={cn(variantClasses[variant])}>
      <CardHeader className="gap-2">
        <CardTitle className={cn("font-bold tracking-tight", variant === "article" ? "text-2xl md:text-3xl" : "text-3xl")}>
          {title}
        </CardTitle>
        {description ? <CardDescription className="text-base leading-relaxed">{description}</CardDescription> : null}
        {meta ? <p className="text-muted-foreground text-sm">{meta}</p> : null}
      </CardHeader>
    </Card>
  );
}
