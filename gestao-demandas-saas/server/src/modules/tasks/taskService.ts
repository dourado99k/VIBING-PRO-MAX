import type { TaskPriority } from "@prisma/client";
import { notFound } from "../../http/errors.js";
import { taskRepo } from "./taskRepo.js";

function daysBetween(a: Date, b: Date) {
  const ms = Math.max(0, b.getTime() - a.getTime());
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export const taskService = {
  async create(input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    status?: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
    startDate?: Date | null;
    dueDate?: Date | null;
  }) {
    const completedAt = input.status === "DONE" ? new Date() : null;
    return taskRepo.create({
      title: input.title,
      description: input.description ?? null,
      priority: input.priority,
      status: input.status,
      startDate: input.startDate ?? null,
      dueDate: input.dueDate ?? null,
      completedAt,
    });
  },

  async update(id: number, input: Record<string, unknown>) {
    const existing = await taskRepo.get(id);
    if (!existing) throw notFound("Demanda não encontrada");

    const nextStatus = input.status as string | undefined;

    const completedAt =
      nextStatus === "DONE"
        ? existing.completedAt ?? new Date()
        : nextStatus && nextStatus !== "DONE"
          ? null
          : undefined;

    return taskRepo.update(id, {
      ...(input as any),
      ...(completedAt !== undefined ? { completedAt } : {}),
    });
  },

  async remove(id: number) {
    const existing = await taskRepo.get(id);
    if (!existing) throw notFound("Demanda não encontrada");
    await taskRepo.remove(id);
  },

  async list(args: Parameters<typeof taskRepo.list>[0]) {
    return taskRepo.list(args);
  },

  async get(id: number) {
    const task = await taskRepo.get(id);
    if (!task) throw notFound("Demanda não encontrada");
    return task;
  },

  async predictDelivery(args: { priority?: TaskPriority; title?: string }) {
    const tasks = await taskRepo.list({ includeDone: true });
    const done = tasks.filter((t) => t.status === "DONE" && t.completedAt);

    const byPriority = args.priority ? done.filter((t) => t.priority === args.priority) : done;

    const durations = byPriority
      .map((t) => {
        const start = t.startDate ?? t.createdAt;
        const end = t.completedAt ?? t.updatedAt;
        return daysBetween(start, end);
      })
      .filter((d) => d > 0 && d < 365);

    const avg = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 4;

    const label =
      args.priority === "HIGH"
        ? "alta"
        : args.priority === "MEDIUM"
          ? "média"
          : args.priority === "LOW"
            ? "baixa"
            : "geral";

    return {
      averageDays: avg,
      sampleSize: durations.length,
      message: `Demandas de prioridade ${label} semelhantes costumam levar ${avg} dias para conclusão.`,
    };
  },
};

