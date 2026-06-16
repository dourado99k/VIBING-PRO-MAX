import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { badRequest, notFound } from "../../http/errors.js";
import { broadcast } from "../../realtime/io.js";
import { prisma } from "../../db.js";
import { CreateNoteSchema } from "./noteSchemas.js";
import { noteRepo } from "./noteRepo.js";

export const noteRoutes = Router();

noteRoutes.get(
  "/task/:taskId",
  asyncHandler(async (req, res) => {
    const taskId = Number(req.params.taskId);
    const notes = await noteRepo.listByTask(taskId);
    res.json({ data: notes });
  }),
);

noteRoutes.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = CreateNoteSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("Body inválido");
    const exists = await prisma.task.findUnique({ where: { id: parsed.data.taskId } });
    if (!exists) throw notFound("Demanda não encontrada");
    const note = await noteRepo.create(parsed.data);
    broadcast({ type: "note:created", payload: note });
    res.status(201).json({ data: note });
  }),
);

