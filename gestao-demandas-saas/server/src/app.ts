import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { taskRoutes } from "./modules/tasks/taskRoutes.js";
import { noteRoutes } from "./modules/notes/noteRoutes.js";
import { metricsRoutes } from "./modules/metrics/metricsRoutes.js";
import { errorMiddleware } from "./http/errorMiddleware.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/tasks", taskRoutes);
  app.use("/api/notes", noteRoutes);
  app.use("/api/metrics", metricsRoutes);

  app.use(errorMiddleware);

  return app;
}

