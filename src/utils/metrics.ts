import type { Project, Update } from "@/types/tracking";
import dayjs from "@/lib/dayjs";

export interface DashboardMetrics {
  totalProjects: number;
  onTrack: number;
  atRisk: number;
  offTrack: number;
  avgProgress: number;
  dueSoon: number;
  updatesThisWeek: number;
}

export const calculateDashboardMetrics = (projects: Project[], updates: Update[]): DashboardMetrics => {
  const totalProjects = projects.length;
  const onTrack = projects.filter((project) => project.health === "on-track").length;
  const atRisk = projects.filter((project) => project.health === "at-risk").length;
  const offTrack = projects.filter((project) => project.health === "off-track").length;
  const avgProgress =
    totalProjects === 0
      ? 0
      : Math.round(projects.reduce((total, project) => total + project.progress, 0) / totalProjects);
  const dueSoon = projects.filter((project) => dayjs(project.dueDate).diff(dayjs(), "day") <= 30).length;
  const updatesThisWeek = updates.filter((update) => dayjs(update.createdAt).isAfter(dayjs().subtract(7, "day")))
    .length;

  return { totalProjects, onTrack, atRisk, offTrack, avgProgress, dueSoon, updatesThisWeek };
};

export interface ProgressHistory {
  date: string;
  onTrack: number;
  atRisk: number;
  offTrack: number;
}

export const buildProgressHistory = (projects: Project[]): ProgressHistory[] => {
  const weeks = 6;
  const now = dayjs();

  return Array.from({ length: weeks }).map((_, index) => {
    const date = now.subtract(weeks - index - 1, "week");
    const sample = projects.map((project) => ({
      ...project,
      progress: Math.max(
        0,
        Math.min(
          100,
          project.progress +
            (Math.sin(index + project.name.length) * 10 +
              (project.health === "off-track" ? -12 : project.health === "at-risk" ? -4 : 6))
        )
      )
    }));

    const computeAverage = (filter: (project: typeof sample[number]) => boolean) => {
      const items = sample.filter(filter);
      if (!items.length) return 0;
      const total = items.reduce((acc, project) => acc + project.progress, 0);
      return Math.round(total / items.length);
    };

    return {
      date: date.format("MMM D"),
      onTrack: computeAverage((project) => project.health === "on-track"),
      atRisk: computeAverage((project) => project.health === "at-risk"),
      offTrack: computeAverage((project) => project.health === "off-track")
    };
  });
};

export const progressLabel = (progress: number): string => {
  if (progress >= 80) return "Healthy progress";
  if (progress >= 50) return "Moderate progress";
  if (progress >= 20) return "Needs attention";
  return "Critical";
};
