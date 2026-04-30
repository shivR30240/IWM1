import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  glow?: boolean;
}

export function Card({ children, className, padding = true, glow = false }: CardProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]",
      "transition-all duration-300",
      padding && "p-6",
      glow && "hover:border-[var(--color-accent)]/30 hover:shadow-lg hover:shadow-[var(--color-accent)]/5",
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-6", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold text-[var(--color-foreground)] tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-[var(--color-muted-foreground)] mt-1", className)}>
      {children}
    </p>
  );
}
