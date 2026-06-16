import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Task, TaskPriority, TaskStatus } from "../../lib/types";
import { PriorityBadge, StatusBadge, OverdueBadge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { cn } from "../../lib/cn";
import { useDeleteTask, useUpdateTask } from "./taskQueries";

function toDateLabel(iso: string | null) {
  if (!iso) return "—";
  return format(new Date(iso), "dd/MM/yyyy");
}

function isOverdue(t: Task) {
  if (!t.dueDate) return false;
  if (t.status === "DONE") return false;
  return new Date(t.dueDate).getTime() < Date.now();
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: "HIGH", label: "Alta" },
  { value: "MEDIUM", label: "Média" },
  { value: "LOW", label: "Baixa" },
];
const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Não iniciado" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "DONE", label: "Concluído" },
];

export function TaskTable({
  tasks,
  onOpen,
}: {
  tasks: Task[];
  onOpen: (t: Task) => void;
}) {
  const update = useUpdateTask();
  const del = useDeleteTask();
  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => <span className="text-[rgb(var(--muted))]">#{info.getValue<number>()}</span>,
      },
      {
        accessorKey: "title",
        header: "Demanda",
        cell: ({ row }) => {
          const t = row.original;
          return (
            <button
              className="text-left hover:underline"
              onClick={() => onOpen(t)}
              title="Abrir detalhes"
            >
              <div className="font-medium text-white">{t.title}</div>
              <div className="text-xs text-[rgb(var(--muted))] line-clamp-1">
                {t.description ?? "—"}
              </div>
            </button>
          );
        },
      },
      {
        accessorKey: "priority",
        header: "Prioridade",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <PriorityBadge value={row.original.priority} />
            <select
              value={row.original.priority}
              onChange={(e) =>
                update.mutate({ id: row.original.id, input: { priority: e.target.value as TaskPriority } })
              }
              className={cn(
                "text-xs rounded-lg px-2 py-1 bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))]",
                "outline-none",
              )}
            >
              {priorityOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <StatusBadge value={row.original.status} />
            <select
              value={row.original.status}
              onChange={(e) =>
                update.mutate({ id: row.original.id, input: { status: e.target.value as TaskStatus } })
              }
              className={cn(
                "text-xs rounded-lg px-2 py-1 bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))]",
                "outline-none",
              )}
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        ),
      },
      {
        id: "startDate",
        header: "Início",
        accessorFn: (t) => t.startDate,
        cell: ({ row }) => (
          <input
            type="date"
            value={row.original.startDate ? new Date(row.original.startDate).toISOString().slice(0, 10) : ""}
            onChange={(e) =>
              update.mutate({
                id: row.original.id,
                input: { startDate: e.target.value ? new Date(e.target.value).toISOString() : null },
              })
            }
            className="text-xs rounded-lg px-2 py-1 bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none"
          />
        ),
      },
      {
        id: "dueDate",
        header: "Entrega",
        accessorFn: (t) => t.dueDate,
        cell: ({ row }) => (
          <input
            type="date"
            value={row.original.dueDate ? new Date(row.original.dueDate).toISOString().slice(0, 10) : ""}
            onChange={(e) =>
              update.mutate({
                id: row.original.id,
                input: { dueDate: e.target.value ? new Date(e.target.value).toISOString() : null },
              })
            }
            className="text-xs rounded-lg px-2 py-1 bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none"
          />
        ),
      },
      {
        id: "notes",
        header: "Observações",
        cell: ({ row }) => {
          const notes = row.original.notes ?? [];
          const last = notes[0]?.note ?? "";
          return (
            <div>
              <div className="text-xs text-[rgb(var(--muted))]">{notes.length} registro(s)</div>
              <div className="text-xs line-clamp-1">{last || "—"}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Atualização",
        cell: ({ row }) => (
          <div className="text-xs text-[rgb(var(--muted))]">{toDateLabel(row.original.updatedAt)}</div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            {isOverdue(row.original) && <OverdueBadge />}
            <Button
              variant="ghost"
              onClick={() => onOpen(row.original)}
              className="px-2 py-1 text-xs rounded-lg"
            >
              Detalhes
            </Button>
            <Button
              variant="danger"
              className="px-2 py-1 text-xs rounded-lg"
              onClick={async () => {
                const ok = confirm(`Excluir demanda #${row.original.id}?`);
                if (!ok) return;
                try {
                  await del.mutateAsync(row.original.id);
                } catch {
                  toast.error("Falha ao excluir");
                }
              }}
            >
              Excluir
            </Button>
          </div>
        ),
      },
    ],
    [del, onOpen, update],
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] overflow-hidden bg-[rgb(var(--panel))]">
      <div className="overflow-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-[rgb(var(--panel-2))]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[rgb(var(--border))]">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className={cn(
                      "text-left px-3 py-3 text-xs font-semibold text-[rgb(var(--muted))] whitespace-nowrap",
                      h.column.getCanSort() && "cursor-pointer select-none",
                    )}
                    onClick={h.column.getToggleSortingHandler()}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === "asc" ? " ↑" : h.column.getIsSorted() === "desc" ? " ↓" : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr
                key={r.id}
                className={cn(
                  "border-b border-[rgb(var(--border))] hover:bg-[rgb(var(--panel-2))]/60 transition-colors",
                  isOverdue(r.original) && "bg-red-500/5",
                )}
              >
                {r.getVisibleCells().map((c) => (
                  <td key={c.id} className="px-3 py-3 align-top">
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10 text-center text-[rgb(var(--muted))]">
                  Nenhuma demanda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

