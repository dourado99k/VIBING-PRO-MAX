import { PropsWithChildren, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
}>) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "w-full max-w-3xl rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] shadow-2xl",
            className,
          )}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgb(var(--border))]">
            <div className="text-sm font-semibold">{title}</div>
            <button
              className="h-9 w-9 rounded-xl hover:bg-[rgb(var(--panel-2))] flex items-center justify-center"
              onClick={onClose}
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

