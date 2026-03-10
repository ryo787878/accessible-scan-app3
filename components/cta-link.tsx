import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaPriority = "primary" | "secondary" | "tertiary";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  priority?: CtaPriority;
  size?: "sm" | "default" | "lg";
  showArrow?: boolean;
  fullWidth?: boolean;
  className?: string;
};

const variantByPriority: Record<CtaPriority, "default" | "outline" | "ghost"> = {
  primary: "default",
  secondary: "outline",
  tertiary: "ghost",
};

export function CtaLink({
  href,
  children,
  priority = "secondary",
  size = "default",
  showArrow = false,
  fullWidth = false,
  className,
}: CtaLinkProps) {
  return (
    <Button
      asChild
      size={size}
      variant={variantByPriority[priority]}
      className={cn(fullWidth ? "w-full" : "", className)}
    >
      <Link href={href} scroll>
        {children}
        {showArrow ? <ArrowRight aria-hidden="true" /> : null}
      </Link>
    </Button>
  );
}
