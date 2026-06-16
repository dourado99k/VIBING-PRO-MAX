import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { prisma } from "../../db.js";

function daysBetween(a: Date, b: Date) {
  const ms = Math.max(0, b.getTime() - a.getTime());
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export const metricsRoutes = Router();

metricsRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    const tasks = await prisma.task.findMany();
    const now = new Date();

    const done = tasks.filter((t) => t.status === "DONE" && t.completedAt);
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
    const notStarted = tasks.filter((t) => t.status === "NOT_STARTED");
    const overdue = tasks.filter((t) => t.dueDate && t.dueDate < now && t.status !== "DONE");

    const durations = done
      .map((t) => daysBetween(t.startDate ?? t.createdAt, t.completedAt ?? t.updatedAt))
      .filter((d) => d > 0 && d < 365);
    const avgCompletionDays = durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    const doneByMonth: Record<string, number> = {};
    for (const t of done) {
      const d = t.completedAt!;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      doneByMonth[key] = (doneByMonth[key] ?? 0) + 1;
    }

    const avgByPriority: Record<string, number> = {};
    for (const p of ["HIGH", "MEDIUM", "LOW"] as const) {
      const subset = done.filter((t) => t.priority === p);
      const ds = subset
        .map((t) => daysBetween(t.startDate ?? t.createdAt, t.completedAt ?? t.updatedAt))
        .filter((d) => d > 0 && d < 365);
      avgByPriority[p] = ds.length ? Math.round(ds.reduce((a, b) => a + b, 0) / ds.length) : 0;
    }

    const createdToDone = done
      .map((t) => daysBetween(t.createdAt, t.completedAt!))
      .filter((d) => d > 0 && d < 365);
    const avgCreatedToDoneDays = createdToDone.length
      ? Math.round(createdToDone.reduce((a, b) => a + b, 0) / createdToDone.length)
      : 0;

    const completionRate = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;

    res.json({
      data: {
        counts: {
          total: tasks.length,
          done: done.length,
          inProgress: inProgress.length,
          notStarted: notStarted.length,
          overdue: overdue.length,
        },
        avgCompletionDays,
        avgByPriority,
        avgCreatedToDoneDays,
        completionRate,
        doneByMonth,
      },
    });
  }),
);

