import { cn } from "../../lib/cn";
import type { TaskPriority, TaskStatus } from "../../lib/types";

export function PriorityBadge({ value }: { value: TaskPriority }) {
  const cls =
    value === "HIGH"
      ? "bg-red-500/15 text-red-300 ring-red-500/30"
      : value === "MEDIUM"
        ? "bg-amber-500/15 text-amber-200 ring-amber-500/30"
        : "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30";
  const label = value === "HIGH" ? "Alta" : value === "MEDIUM" ? "Média" : "Baixa";
  return <span className={cn("px-2 py-1 rounded-lg text-xs ring-1", cls)}>{label}</span>;
}

export function StatusBadge({ value }: { value: TaskStatus }) {
  const cls =
    value === "NOT_STARTED"
      ? "bg-slate-500/15 text-slate-200 ring-slate-500/30"
      : value === "IN_PROGRESS"
        ? "bg-orange-500/15 text-orange-200 ring-orange-500/30"
        : "bg-emerald-500/15 text-emerald-200 ring-emerald-500/30";
  const label =
    value === "NOT_STARTED" ? "Não iniciado" : value === "IN_PROGRESS" ? "Em andamento" : "Concluído";
  return <span className={cn("px-2 py-1 rounded-lg text-xs ring-1", cls)}>{label}</span>;
}

export function OverdueBadge() {
  return (
    <span className="px-2 py-1 rounded-lg text-xs ring-1 bg-red-500/15 text-red-200 ring-red-500/30">
      Atrasada
    </span>
  );
}

