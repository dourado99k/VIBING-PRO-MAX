import { prisma } from "../../db.js";

export const noteRepo = {
  async create(input: { taskId: number; note: string; author?: string }) {
    return prisma.taskNote.create({
      data: {
        taskId: input.taskId,
        note: input.note,
        author: input.author ?? "Usuário",
      },
    });
  },

  async listByTask(taskId: number) {
    return prisma.taskNote.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });
  },
};

