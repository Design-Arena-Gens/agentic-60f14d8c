import { seedMilestones, seedProjects, seedUpdates } from "@/data/seed";
import type { HealthStatus, Milestone, Project, Update } from "@/types/tracking";
import dayjs from "@/lib/dayjs";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface TrackingState {
  projects: Project[];
  updates: Update[];
  milestones: Milestone[];
  addUpdate: (payload: Omit<Update, "id" | "createdAt"> & { createdAt?: string }) => void;
  updateProjectHealth: (projectId: string, health: HealthStatus) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  toggleMilestone: (milestoneId: string) => void;
}

const enhanceProjectProgress = (projects: Project[], updates: Update[]): Project[] => {
  return projects.map((project) => {
    const projectUpdates = updates.filter((update) => update.projectId === project.id);
    if (!projectUpdates.length) {
      return project;
    }

    const totalDelta = projectUpdates.reduce((delta, update) => delta + (update.progressDelta ?? 0), 0);
    const progress = Math.min(100, Math.max(0, project.progress + totalDelta * 0.25));
    return { ...project, progress };
  });
};

export const initialTrackingState = {
  projects: enhanceProjectProgress(seedProjects, seedUpdates),
  updates: seedUpdates,
  milestones: seedMilestones
};

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set, get) => ({
      ...initialTrackingState,
      addUpdate: (payload) => {
        const id = `upd-${
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2, 9)
        }`;
        const createdAt = payload.createdAt ?? dayjs().toISOString();
        const update: Update = { ...payload, id, createdAt };
        set(({ updates, projects }) => {
          const nextUpdates = [update, ...updates];
          const nextProjects = projects.map((project) => {
            if (project.id !== update.projectId) {
              return project;
            }

            if (typeof update.progressDelta !== "number") {
              return project;
            }

            const progress = Math.min(100, Math.max(0, project.progress + update.progressDelta));
            return { ...project, progress };
          });

          return { updates: nextUpdates, projects: nextProjects };
        });
      },
      updateProjectHealth: (projectId, health) => {
        set(({ projects }) => ({
          projects: projects.map((project) => (project.id === projectId ? { ...project, health } : project))
        }));
      },
      updateProjectProgress: (projectId, progress) => {
        set(({ projects }) => ({
          projects: projects.map((project) =>
            project.id === projectId ? { ...project, progress: Math.min(100, Math.max(0, progress)) } : project
          )
        }));
      },
      toggleMilestone: (milestoneId) => {
        set(({ milestones }) => ({
          milestones: milestones.map((milestone) =>
            milestone.id === milestoneId ? { ...milestone, completed: !milestone.completed } : milestone
          )
        }));
      }
    }),
    {
      name: "pulse-track-store",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined" && window.localStorage) {
          return window.localStorage;
        }
        const memoryStorage: Storage = {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
          clear: () => undefined,
          key: () => null,
          get length() {
            return 0;
          }
        };
        return memoryStorage;
      })
    }
  )
);
