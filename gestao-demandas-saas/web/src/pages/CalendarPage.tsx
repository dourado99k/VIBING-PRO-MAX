import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/daygrid/index.css";
import "@fullcalendar/timegrid/index.css";
import { useMemo, useState } from "react";
import { useTasks, useUpdateTask } from "../features/tasks/taskQueries";
import type { Task } from "../lib/types";
import { TaskModal } from "../features/tasks/TaskModal";

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function eventColor(t: Task) {
  if (t.priority === "HIGH") return "#ef4444";
  if (t.priority === "MEDIUM") return "#f59e0b";
  return "#10b981";
}

export function CalendarPage() {
  const tasksQ = useTasks({ includeDone: true });
  const tasks = tasksQ.data?.data ?? [];
  const update = useUpdateTask();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = selectedId ? tasks.find((t) => t.id === selectedId) ?? null : null;

  const events = useMemo(() => {
    return tasks
      .filter((t) => t.startDate || t.dueDate)
      .map((t) => {
        const start = new Date(t.startDate ?? t.createdAt);
        const due = t.dueDate ? new Date(t.dueDate) : start;
        const endExclusive = addDays(new Date(due.toISOString().slice(0, 10)), 1);
        return {
          id: String(t.id),
          title: t.title,
          start: start.toISOString().slice(0, 10),
          end: endExclusive.toISOString().slice(0, 10),
          allDay: true,
          backgroundColor: eventColor(t),
          borderColor: eventColor(t),
          extendedProps: { task: t },
        };
      });
  }, [tasks]);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-xl font-semibold">Calendário</div>
        <div className="text-sm text-[rgb(var(--muted))]">
          Arraste/redimensione para ajustar datas — sincroniza em tempo real com a tabela.
        </div>
      </div>

      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] p-4">
        <div className="fc-dark">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek",
            }}
            height="auto"
            events={events as any}
            editable
            eventResizableFromStart
            eventDrop={async (info) => {
              const id = Number(info.event.id);
              const start = info.event.start ? info.event.start.toISOString() : null;
              const end = info.event.end ? addDays(info.event.end, -1).toISOString() : null;
              await update.mutateAsync({ id, input: { startDate: start, dueDate: end } as any });
            }}
            eventResize={async (info) => {
              const id = Number(info.event.id);
              const start = info.event.start ? info.event.start.toISOString() : null;
              const end = info.event.end ? addDays(info.event.end, -1).toISOString() : null;
              await update.mutateAsync({ id, input: { startDate: start, dueDate: end } as any });
            }}
            eventClick={(info) => {
              setSelectedId(Number(info.event.id));
              setModalOpen(true);
            }}
            eventContent={(arg) => {
              const t: Task | undefined = (arg.event.extendedProps as any)?.task;
              const notesCount = t?.notes?.length ?? 0;
              const overdue = t?.dueDate && t.status !== "DONE" && new Date(t.dueDate).getTime() < Date.now();
              return (
                <div className="px-1 py-0.5 text-[12px] leading-tight">
                  <div className="font-medium truncate">
                    {arg.event.title}
                    {overdue ? " • ATRASADA" : ""}
                  </div>
                  <div className="opacity-90 truncate">
                    {notesCount ? `${notesCount} obs.` : ""}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} task={selected} />
    </div>
  );
}

