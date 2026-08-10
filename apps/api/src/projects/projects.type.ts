export const Status = {
  Planning: 'planning',
  InProgress: 'in_progress',
  OnHold: 'on_hold',
  Completed: 'completed',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

export type Priority = (typeof Priority)[keyof typeof Priority];
