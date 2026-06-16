import { z } from "zod";

export const CreateNoteSchema = z.object({
  taskId: z.coerce.number().int().positive(),
  note: z.string().min(1),
  author: z.string().min(1).max(120).optional(),
});

