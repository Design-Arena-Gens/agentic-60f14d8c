import { useTrackingStore } from "@/store/useTrackingStore";
import type { Project } from "@/types/tracking";
import { progressLabel } from "@/utils/metrics";
import { ArrowTrendingUpIcon, CalendarIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "classnames";
import dayjs from "@/lib/dayjs";
import { useMemo } from "react";

interface ProjectListProps {
  projects: Project[];
}

const healthLabels: Record<Project["health"], string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  "off-track": "Off track"
};

const healthAccent: Record<Project["health"], string> = {
  "on-track": "bg-emerald-50 text-emerald-600 border border-emerald-100",
  "at-risk": "bg-amber-50 text-amber-600 border border-amber-100",
  "off-track": "bg-rose-50 text-rose-600 border border-rose-100"
};

export function ProjectList({ projects }: ProjectListProps) {
  const { updateProjectHealth } = useTrackingStore((state) => ({ updateProjectHealth: state.updateProjectHealth }));
  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        const order = { "off-track": 0, "at-risk": 1, "on-track": 2 } as const;
        if (order[a.health] !== order[b.health]) {
          return order[a.health] - order[b.health];
        }
        return dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf();
      }),
    [projects]
  );

  return (
    <section id="projects" className="mt-10 space-y-4" aria-label="Projects">
      {sortedProjects.map((project) => (
        <article
          key={project.id}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", healthAccent[project.health])}>
                  {healthLabels[project.health]}
                </span>
              </div>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">{project.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4" />
                  {project.owner}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Due {dayjs(project.dueDate).format("MMM D")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-wide text-slate-500" htmlFor={`${project.id}-health`}>
                Health
              </label>
              <select
                id={`${project.id}-health`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400"
                value={project.health}
                onChange={(event) => updateProjectHealth(project.id, event.target.value as Project["health"])}
              >
                <option value="on-track">On track</option>
                <option value="at-risk">At risk</option>
                <option value="off-track">Off track</option>
              </select>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-500">Progress</p>
                <span className="text-sm font-semibold text-slate-700">{project.progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div
                  className={clsx("h-2 rounded-full transition-all", {
                    "bg-emerald-500": project.health === "on-track",
                    "bg-amber-500": project.health === "at-risk",
                    "bg-rose-500": project.health === "off-track"
                  })}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">{progressLabel(project.progress)}</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Key metrics</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {project.metrics.map((metric) => {
                  const percentage = Math.round((metric.current / metric.target) * 100);
                  const deltaClass = percentage >= 100 ? "text-emerald-600" : "text-slate-500";
                  return (
                    <div key={metric.id} className="rounded-xl border border-slate-200 px-4 py-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-slate-900">
                          {metric.current}
                          {metric.unit ? metric.unit : ""}
                        </span>
                        <span className="text-xs text-slate-400">/ {metric.target}</span>
                      </div>
                      <p className={`mt-1 flex items-center gap-1 text-xs ${deltaClass}`}>
                        <ArrowTrendingUpIcon className="h-4 w-4" /> {percentage}% of target
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
