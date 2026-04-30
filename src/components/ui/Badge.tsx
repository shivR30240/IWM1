import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple" | "accent";
  className?: string;
  dot?: boolean;
}

const variantClasses = {
  default: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] border-[var(--color-border)]",
  success: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
  warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
  danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20",
  info: "bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20",
};

const dotColors = {
  default: "bg-[var(--color-muted-foreground)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]",
  info: "bg-[var(--color-info)]",
  purple: "bg-purple-400",
  accent: "bg-[var(--color-accent)]",
};

export function Badge({ children, variant = "default", className, dot = false }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
      variantClasses[variant],
      className
    )}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])} />}
      {children}
    </span>
  );
}

// Utility to get badge variant from ticket status
export function getStatusVariant(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    open: "info",
    assigned: "purple",
    in_progress: "warning",
    resolved: "success",
    closed: "default",
    escalated: "danger",
  };
  return map[status] || "default";
}

export function getPriorityVariant(priority: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    low: "success",
    medium: "warning",
    high: "danger",
    critical: "danger",
  };
  return map[priority] || "default";
}
