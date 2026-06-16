import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
        "transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-[rgb(var(--brand))] hover:bg-[rgb(var(--brand))]/90 text-white",
        variant === "ghost" &&
          "bg-transparent hover:bg-[rgb(var(--panel-2))] text-[rgb(var(--text))] ring-1 ring-[rgb(var(--border))]",
        variant === "danger" && "bg-red-600 hover:bg-red-500 text-white",
        className,
      )}
    />
  );
}

