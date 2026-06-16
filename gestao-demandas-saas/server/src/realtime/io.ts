import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../env.js";

export type RealtimeEvents =
  | { type: "task:created"; payload: any }
  | { type: "task:updated"; payload: any }
  | { type: "task:deleted"; payload: { id: number } }
  | { type: "note:created"; payload: any };

let io: Server | null = null;

export function initRealtime(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: env.CORS_ORIGIN, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.join("global");
  });

  return io;
}

export function broadcast(event: RealtimeEvents) {
  io?.to("global").emit("event", event);
}

