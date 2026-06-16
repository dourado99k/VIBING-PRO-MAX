import { api, endpoints } from "../../lib/api";
import type { Metrics, Task, TaskNote, TaskPriority, TaskStatus } from "../../lib/types";

export function listTasks(params?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  q?: string;
  from?: string;
  to?: string;
  includeDone?: boolean;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.priority) qs.set("priority", params.priority);
  if (params?.q) qs.set("q", params.q);
  if (params?.from) qs.set("from", params.from);
  if (params?.to) qs.set("to", params.to);
  if (params?.includeDone !== undefined) qs.set("includeDone", String(params.includeDone));
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return api<{ data: Task[] }>(`${endpoints.tasks}${suffix}`);
}

export function createTask(input: Partial<Task>) {
  return api<{ data: Task }>(endpoints.tasks, { method: "POST", body: JSON.stringify(input) });
}

export function updateTask(id: number, input: Partial<Task>) {
  return api<{ data: Task }>(`${endpoints.tasks}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTask(id: number) {
  return api<void>(`${endpoints.tasks}/${id}`, { method: "DELETE" });
}

export function createNote(input: { taskId: number; note: string; author?: string }) {
  return api<{ data: TaskNote }>(endpoints.notes, { method: "POST", body: JSON.stringify(input) });
}

export function listNotes(taskId: number) {
  return api<{ data: TaskNote[] }>(`${endpoints.notes}/task/${taskId}`);
}

export function getMetrics() {
  return api<{ data: Metrics }>(endpoints.metrics);
}

export function predictDelivery(params: { priority?: TaskPriority; title?: string }) {
  const qs = new URLSearchParams();
  if (params.priority) qs.set("priority", params.priority);
  if (params.title) qs.set("title", params.title);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  return api<{ data: { averageDays: number; sampleSize: number; message: string } }>(
    `${endpoints.tasks}/predict/delivery${suffix}`,
  );
}

