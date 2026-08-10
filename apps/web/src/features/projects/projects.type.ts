export type Project = {
  id: string;
  clientName: string;
  projectName: string;
  description: string | null;
  status: Status;
  priority: Priority;
  startDate: string;
  dueDate: string;
};
export type CreateProject = Omit<Project, "id" | "description"> & {
  description?: string;
};
export type UpdateProject = CreateProject;

export const Status = {
  Planning: "planning",
  InProgress: "in_progress",
  OnHold: "on_hold",
  Completed: "completed",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Priority = {
  Low: "low",
  Medium: "medium",
  High: "high",
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];
