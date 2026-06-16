import { useEffect, useMemo, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "../../lib/types";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useCreateTask, usePredictDelivery, useUpdateTask } from "./taskQueries";
import { NotesTimeline } from "./NotesTimeline";
import { cn } from "../../lib/cn";

const priorities: { value: TaskPriority; label: string }[] = [
  { value: "HIGH", label: "Alta" },
  { value: "MEDIUM", label: "Média" },
  { value: "LOW", label: "Baixa" },
];
const statuses: { value: TaskStatus; label: string }[] = [
  { value: "NOT_STARTED", label: "Não iniciado" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "DONE", label: "Concluído" },
];

function dateInputValue(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function TaskModal({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}) {
  const isEdit = Boolean(task?.id);
  const create = useCreateTask();
  const update = useUpdateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("NOT_STARTED");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? "MEDIUM");
    setStatus(task?.status ?? "NOT_STARTED");
    setStartDate(dateInputValue(task?.startDate ?? null));
    setDueDate(dateInputValue(task?.dueDate ?? null));
  }, [open, task]);

  const predictParams = useMemo(() => ({ priority, title }), [priority, title]);
  const prediction = usePredictDelivery(predictParams);

  async function onSave() {
    const payload = {
      title,
      description: description.trim() ? description.trim() : null,
      priority,
      status,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    } as Partial<Task>;

    if (isEdit && task) {
      await update.mutateAsync({ id: task.id, input: payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? `Demanda #${task?.id}` : "Nova demanda"}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xs text-[rgb(var(--muted))]">Título</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(
                "w-full rounded-xl px-3 py-2 text-sm",
                "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
                "focus:ring-2 focus:ring-[rgb(var(--brand))]/50",
              )}
              placeholder="Ex: Cardápio Online"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-[rgb(var(--muted))]">Observações gerais</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={cn(
                "w-full min-h-[90px] rounded-xl px-3 py-2 text-sm resize-y",
                "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
                "focus:ring-2 focus:ring-[rgb(var(--brand))]/50",
              )}
              placeholder="Detalhes da demanda, contexto, links..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-xs text-[rgb(var(--muted))]">Prioridade</div>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-sm",
                  "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
                )}
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-[rgb(var(--muted))]">Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-sm",
                  "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
                )}
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-xs text-[rgb(var(--muted))]">Data de início</div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-sm",
                  "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
                )}
              />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-[rgb(var(--muted))]">Data de entrega</div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-sm",
                  "bg-[rgb(var(--panel-2))] border border-[rgb(var(--border))] outline-none",
                )}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-3">
            <div className="text-xs text-[rgb(var(--muted))]">Previsão inteligente de prazo</div>
            <div className="mt-2 text-sm">
              {prediction.isFetching ? "Analisando histórico…" : prediction.data?.data.message ?? "—"}
            </div>
            <div className="mt-1 text-xs text-[rgb(var(--muted))]">
              Base: {prediction.data?.data.sampleSize ?? 0} demandas concluídas com filtro aplicado
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button disabled={!title.trim() || create.isPending || update.isPending} onClick={onSave}>
              Salvar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {isEdit && task ? (
            <NotesTimeline taskId={task.id} />
          ) : (
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel-2))] p-4 text-sm text-[rgb(var(--muted))]">
              Crie a demanda para habilitar a timeline de observações.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

