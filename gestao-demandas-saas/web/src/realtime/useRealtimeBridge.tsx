import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "./socket";
import type { Task, TaskNote } from "../lib/types";

type RealtimeEvent =
  | { type: "task:created"; payload: Task }
  | { type: "task:updated"; payload: Task }
  | { type: "task:deleted"; payload: { id: number } }
  | { type: "note:created"; payload: TaskNote };

export function useRealtimeBridge() {
  const qc = useQueryClient();

  useEffect(() => {
    const s = getSocket();
    const handler = (event: RealtimeEvent) => {
      // Mantém tudo 100% consistente (tabela, finalizadas e calendário)
      // e simples de manter: invalida listas e métricas ao receber eventos.
      if (event.type === "note:created") {
        qc.invalidateQueries({ queryKey: ["notes", event.payload.taskId] });
      }
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
    };

    s.on("event", handler);
    return () => {
      s.off("event", handler);
    };
  }, [qc]);
}

