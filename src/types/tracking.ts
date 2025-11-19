export type HealthStatus = "on-track" | "at-risk" | "off-track";

export type UpdateCategory = "milestone" | "risk" | "success" | "general";

export interface Metric {
  id: string;
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  startDate: string;
  dueDate: string;
  progress: number;
  health: HealthStatus;
  tags: string[];
  metrics: Metric[];
}

export interface Update {
  id: string;
  projectId: string;
  author: string;
  createdAt: string;
  summary: string;
  category: UpdateCategory;
  progressDelta?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  targetDate: string;
  completed: boolean;
  description?: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}
