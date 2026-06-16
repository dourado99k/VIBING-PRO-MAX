import { useMemo, useState } from "react";
import { TaskModal } from "../features/tasks/TaskModal";
import { TaskTable } from "../features/tasks/TaskTable";
import { useTasks } from "../features/tasks/taskQueries";
import { Button } from "../components/ui/Button";
import { RefreshCw } from "lucide-react";
import { cn } from "../lib/cn";

export function FinishedDemandsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const filters = useMemo(
    () => ({
      status: "DONE" as const,
      q: q.trim() || undefined,
      includeDone: true,
    }),
    [q],
  );

  const tasksQ = useTasks(filters);
  const tasks = tasksQ.data?.data ?? [];
  const selected = selectedId ? tasks.find((t) => t.id === selectedId) ?? null : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xl font-semibold">Demandas finalizadas</div>
          <div className="text-sm text-[rgb(var(--muted))]">
            Histórico completo, busca e observações (não sai da base).
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar…"
            className={cn(
              "rounded-xl px-3 py-2 text-sm w-[280px]",
              "bg-[rgb(var(--panel))] border border-[rgb(var(--border))] outline-none",
            )}
          />
          <Button variant="ghost" onClick={() => tasksQ.refetch()} disabled={tasksQ.isFetching}>
            <RefreshCw className={cn("h-4 w-4", tasksQ.isFetching && "animate-spin")} />
            Atualizar
          </Button>
        </div>
      </div>

      <TaskTable
        tasks={tasks}
        onOpen={(t) => {
          setSelectedId(t.id);
          setModalOpen(true);
        }}
      />

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} task={selected} />
    </div>
  );
}

