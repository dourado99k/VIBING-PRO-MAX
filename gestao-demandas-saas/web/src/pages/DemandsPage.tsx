import { useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { TaskModal } from "../features/tasks/TaskModal";
import { TaskTable } from "../features/tasks/TaskTable";
import { useMetrics, useTasks } from "../features/tasks/taskQueries";
import type { TaskPriority, TaskStatus } from "../lib/types";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/cn";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export function DemandsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [q, setQ] = useState("");
  const [priority, setPriority] = useState<TaskPriority | "ALL">("ALL");
  const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filters = useMemo(
    () => ({
      q: q.trim() || undefined,
      priority: priority === "ALL" ? undefined : priority,
      status: status === "ALL" ? undefined : status,
      from: from || undefined,
      to: to || undefined,
      includeDone: true,
    }),
    [from, priority, q, status, to],
  );

  const tasksQ = useTasks(filters);
  const tasks = tasksQ.data?.data ?? [];
  const metricsQ = useMetrics();
  const metrics = metricsQ.data?.data;

  const selectedTask = selectedId ? tasks.find((t) => t.id === selectedId) ?? null : null;

  const chartData = useMemo(() => {
    const entries = Object.entries(metrics?.doneByMonth ?? {}).sort((a, b) => a[0].localeCompare(b[0]));
    return entries.slice(-8).map(([k, v]) => ({ month: k, done: v }));
  }, [metrics?.doneByMonth]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xl font-semibold">Demandas</div>
          <div className="text-sm text-[rgb(var(--muted))]">
            Tabela operacional com edição inline, filtros e sincronização com calendário.
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => tasksQ.refetch()}
            className="whitespace-nowrap"
            disabled={tasksQ.isFetching}
          >
            <RefreshCw className={cn("h-4 w-4", tasksQ.isFetching && "animate-spin")} />
            Atualizar
          </Button>
          <Button
            onClick={() => {
              setSelectedId(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nova demanda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <MetricCard title="Concluídas" value={metrics?.counts.done ?? "—"} hint="No total" />
        <MetricCard title="Em andamento" value={metrics?.counts.inProgress ?? "—"} hint="Agora" />
        <MetricCard
          title="Atrasadas"
          value={metrics?.counts.overdue ?? "—"}
          hint="Entrega vencida"
          tone="danger"
        />
        <MetricCard title="Taxa de conclusão" value={`${metrics?.completionRate ?? 0}%`} hint="Done / total" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] p-4">
          <div className="text-sm font-semibold">Concluídas por mês</div>
          <div className="text-xs text-[rgb(var(--muted))] mt-1">Baseado em `completedAt`.</div>
          <div className="h-[180px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" tick={{ fill: "rgb(var(--muted))", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgb(var(--panel))",
                    border: "1px solid rgb(var(--border))",
                    color: "rgb(var(--text))",
                  }}
                />
                <Bar dataKey="done" fill="rgb(var(--brand))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] p-4">
          <div className="text-sm font-semibold">Médias (dias)</div>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Tempo médio de conclusão" value={metrics?.avgCompletionDays ?? 0} />
            <Row label="Criação → conclusão" value={metrics?.avgCreatedToDoneDays ?? 0} />
            <div className="pt-2 border-t border-[rgb(var(--border))]">
              <div className="text-xs text-[rgb(var(--muted))] mb-2">Tempo médio por prioridade</div>
              <Row label="Alta" value={metrics?.avgByPriority.HIGH ?? 0} />
              <Row label="Média" value={metrics?.avgByPriority.MEDIUM ?? 0} />
              <Row label="Baixa" value={metrics?.avgByPriority.LOW ?? 0} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título/descrição…"
            className={cn(
              "md:col-span-2 rounded-xl px-3 py-2 text-sm",
              "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
            )}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="rounded-xl px-3 py-2 text-sm bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none"
          >
            <option value="ALL">Prioridade (todas)</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Média</option>
            <option value="LOW">Baixa</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-xl px-3 py-2 text-sm bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none"
          >
            <option value="ALL">Status (todos)</option>
            <option value="NOT_STARTED">Não iniciado</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="DONE">Concluído</option>
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none"
              title="Período (de)"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none"
              title="Período (até)"
            />
          </div>
        </div>
      </div>

      <TaskTable
        tasks={tasks}
        onOpen={(t) => {
          setSelectedId(t.id);
          setModalOpen(true);
        }}
      />

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  hint,
  tone,
}: {
  title: string;
  value: any;
  hint: string;
  tone?: "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] p-4",
        tone === "danger" && "ring-1 ring-red-500/30",
      )}
    >
      <div className="text-xs text-[rgb(var(--muted))]">{title}</div>
      <div className={cn("mt-2 text-2xl font-semibold", tone === "danger" && "text-red-300")}>
        {value}
      </div>
      <div className="mt-1 text-xs text-[rgb(var(--muted))]">{hint}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-[rgb(var(--muted))]">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

