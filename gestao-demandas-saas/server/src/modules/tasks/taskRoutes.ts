import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { badRequest } from "../../http/errors.js";
import { broadcast } from "../../realtime/io.js";
import { CreateTaskSchema, ListTasksQuerySchema, UpdateTaskSchema } from "./taskSchemas.js";
import { taskService } from "./taskService.js";

export const taskRoutes = Router();

taskRoutes.get(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = ListTasksQuerySchema.safeParse(req.query);
    if (!parsed.success) throw badRequest("Query inválida");
    const tasks = await taskService.list(parsed.data);
    res.json({ data: tasks });
  }),
);

taskRoutes.get(
  "/predict/delivery",
  asyncHandler(async (req, res) => {
    const priority = req.query.priority as any | undefined;
    const title = req.query.title as string | undefined;
    const data = await taskService.predictDelivery({ priority, title });
    res.json({ data });
  }),
);

taskRoutes.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = CreateTaskSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("Body inválido");
    const task = await taskService.create(parsed.data);
    broadcast({ type: "task:created", payload: task });
    res.status(201).json({ data: task });
  }),
);

taskRoutes.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const parsed = UpdateTaskSchema.safeParse(req.body);
    if (!parsed.success) throw badRequest("Body inválido");
    const task = await taskService.update(id, parsed.data);
    broadcast({ type: "task:updated", payload: task });
    res.json({ data: task });
  }),
);

taskRoutes.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await taskService.remove(id);
    broadcast({ type: "task:deleted", payload: { id } });
    res.status(204).send();
  }),
);

taskRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const task = await taskService.get(id);
    res.json({ data: task });
  }),
);

