import { prisma } from "../../db.js";
import type { Prisma, TaskPriority, TaskStatus } from "@prisma/client";

export const taskRepo = {
  async create(data: Prisma.TaskCreateInput) {
    return prisma.task.create({
      data,
      include: { notes: { orderBy: { createdAt: "desc" } } },
    });
  },

  async update(id: number, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({
      where: { id },
      data,
      include: { notes: { orderBy: { createdAt: "desc" } } },
    });
  },

  async remove(id: number) {
    return prisma.task.delete({ where: { id } });
  },

  async get(id: number) {
    return prisma.task.findUnique({
      where: { id },
      include: { notes: { orderBy: { createdAt: "desc" } } },
    });
  },

  async list(args: {
    status?: TaskStatus;
    priority?: TaskPriority;
    q?: string;
    from?: Date;
    to?: Date;
    includeDone?: boolean;
  }) {
    const where: Prisma.TaskWhereInput = {};

    if (args.status) where.status = args.status;
    if (args.priority) where.priority = args.priority;
    if (args.q) {
      where.OR = [
        { title: { contains: args.q, mode: "insensitive" } },
        { description: { contains: args.q, mode: "insensitive" } },
      ];
    }

    if (args.includeDone === false) {
      where.status = { not: "DONE" };
    }

    if (args.from || args.to) {
      where.OR = [
        { startDate: { gte: args.from, lte: args.to } },
        { dueDate: { gte: args.from, lte: args.to } },
      ];
    }

    return prisma.task.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      include: { notes: { orderBy: { createdAt: "desc" } } },
    });
  },
};

