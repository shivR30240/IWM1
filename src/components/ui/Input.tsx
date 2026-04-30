import { cn } from "@/lib/utils/cn";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-2.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-foreground)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200",
            "bg-[var(--color-muted)] border-[var(--color-border)]",
            "text-[var(--color-foreground)]",
            "focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20",
            "placeholder:text-[var(--color-muted-foreground)]",
            "hover:border-[var(--color-muted-foreground)]/50",
            error && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--color-danger)] flex items-center gap-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-[var(--color-muted-foreground)]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
