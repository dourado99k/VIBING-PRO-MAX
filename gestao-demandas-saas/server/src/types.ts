import type { Task, TaskNote, TaskPriority, TaskStatus } from "@prisma/client";

export type { Task, TaskNote, TaskPriority, TaskStatus };

export type TaskWithNotes = Task & { notes: TaskNote[] };

