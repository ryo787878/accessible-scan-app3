import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PageIntroProps = {
  title: string;
  description?: string;
  meta?: string;
};

export function PageIntro({ title, description, meta }: PageIntroProps) {
  return (
    <Card className="bg-muted/30 border-dashed">
      <CardHeader className="gap-2">
        <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
        {description ? <CardDescription className="text-base leading-relaxed">{description}</CardDescription> : null}
        {meta ? <p className="text-muted-foreground text-sm">{meta}</p> : null}
      </CardHeader>
    </Card>
  );
}
