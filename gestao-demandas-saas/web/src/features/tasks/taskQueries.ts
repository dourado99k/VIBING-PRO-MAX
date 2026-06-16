import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Task, TaskPriority, TaskStatus } from "../../lib/types";
import { createNote, createTask, deleteTask, getMetrics, listNotes, listTasks, predictDelivery, updateTask } from "./taskApi";

export function useTasks(filters?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  q?: string;
  from?: string;
  to?: string;
  includeDone?: boolean;
}) {
  return useQuery({
    queryKey: ["tasks", filters ?? {}],
    queryFn: () => listTasks(filters),
  });
}

export function useMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
    refetchInterval: 30_000,
  });
}

export function usePredictDelivery(params: { priority?: TaskPriority; title?: string }) {
  return useQuery({
    queryKey: ["predictDelivery", params],
    queryFn: () => predictDelivery(params),
    enabled: Boolean(params.priority || params.title),
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Task>) => createTask(input),
    onSuccess: () => {
      toast.success("Demanda criada");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<Task> }) => updateTask(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      toast.success("Demanda excluída");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useNotes(taskId?: number) {
  return useQuery({
    queryKey: ["notes", taskId],
    queryFn: () => listNotes(taskId!),
    enabled: Boolean(taskId),
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: (_res, vars) => {
      toast.success("Observação registrada");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["notes", vars.taskId] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

