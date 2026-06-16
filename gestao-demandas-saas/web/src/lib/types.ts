export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "DONE";

export type TaskNote = {
  id: number;
  taskId: number;
  note: string;
  author: string;
  createdAt: string;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  notes: TaskNote[];
};

export type Metrics = {
  counts: {
    total: number;
    done: number;
    inProgress: number;
    notStarted: number;
    overdue: number;
  };
  avgCompletionDays: number;
  avgByPriority: Record<TaskPriority, number>;
  avgCreatedToDoneDays: number;
  completionRate: number;
  doneByMonth: Record<string, number>;
};

