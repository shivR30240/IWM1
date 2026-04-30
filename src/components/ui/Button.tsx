import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base = cn(
      "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
      "disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
      "active:scale-[0.98]"
    );

    const variants = {
      primary: cn(
        "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-[var(--color-primary)] font-semibold",
        "shadow-lg shadow-[var(--color-accent)]/25",
        "hover:shadow-xl hover:shadow-[var(--color-accent)]/30 hover:brightness-110"
      ),
      secondary: cn(
        "bg-[var(--color-muted)] text-[var(--color-foreground)]",
        "border border-[var(--color-border)]",
        "hover:bg-[var(--color-border)] hover:border-[var(--color-muted-foreground)]"
      ),
      outline: cn(
        "border border-[var(--color-border)] text-[var(--color-foreground)] bg-transparent",
        "hover:bg-[var(--color-muted)] hover:border-[var(--color-muted-foreground)]"
      ),
      ghost: cn(
        "text-[var(--color-muted-foreground)] bg-transparent",
        "hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      ),
      danger: cn(
        "bg-[var(--color-danger)] text-white",
        "hover:bg-[var(--color-danger-light)]",
        "shadow-lg shadow-[var(--color-danger)]/25"
      ),
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
