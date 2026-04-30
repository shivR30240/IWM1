import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  className?: string;
  iconColor?: string;
  accentColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className, 
  iconColor = "text-[var(--color-accent)]",
  accentColor = "var(--color-accent)"
}: StatCardProps) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6",
      "transition-all duration-300 hover:border-[var(--color-border)]/80",
      "hover:shadow-lg hover:shadow-black/20",
      className
    )}>
      {/* Subtle gradient overlay on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, transparent 0%, ${accentColor}05 100%)` }}
      />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">{value}</p>
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.isPositive 
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" 
                : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <span className="text-[var(--color-muted-foreground)]">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          "bg-[var(--color-muted)] transition-colors group-hover:bg-[var(--color-border)]",
          iconColor
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
