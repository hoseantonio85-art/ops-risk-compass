import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type StatusTone = "calm" | "attention" | "critical" | "neutral";

interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  icon?: LucideIcon;
  size?: "sm" | "md";
  className?: string;
}

const toneStyles: Record<StatusTone, string> = {
  calm: "bg-calm-soft text-calm",
  attention: "bg-attention-soft text-attention",
  critical: "bg-critical-soft text-critical",
  neutral: "bg-neutral-soft text-muted-foreground",
};

export const StatusBadge = ({ tone, children, icon: Icon, size = "md", className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        toneStyles[tone],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      {Icon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.5} />}
      <span className="leading-none">{children}</span>
    </span>
  );
};
