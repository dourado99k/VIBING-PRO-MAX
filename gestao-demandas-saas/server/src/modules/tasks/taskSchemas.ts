import { z } from "zod";

export const TaskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW"]);
export const TaskStatusSchema = z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  priority: TaskPrioritySchema.optional(),
  status: TaskStatusSchema.optional(),
  startDate: z.coerce.date().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  completedAt: z.coerce.date().optional().nullable(),
});

export const ListTasksQuerySchema = z.object({
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  q: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  includeDone: z.coerce.boolean().optional().default(true),
});

