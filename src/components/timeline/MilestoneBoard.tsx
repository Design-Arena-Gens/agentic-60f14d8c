import { useTrackingStore } from "@/store/useTrackingStore";
import type { Milestone, Project } from "@/types/tracking";
import { CalendarDaysIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import clsx from "classnames";
import dayjs from "@/lib/dayjs";

interface MilestoneBoardProps {
  milestones: Milestone[];
  projects: Project[];
}

export function MilestoneBoard({ milestones, projects }: MilestoneBoardProps) {
  const { toggleMilestone } = useTrackingStore((state) => ({ toggleMilestone: state.toggleMilestone }));
  const sortedMilestones = [...milestones].sort(
    (a, b) => dayjs(a.targetDate).valueOf() - dayjs(b.targetDate).valueOf()
  );

  return (
    <section
      id="milestones"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
      aria-label="Upcoming milestones"
    >
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Upcoming milestones</h2>
        <p className="mt-1 text-sm text-slate-500">Track commitments across initiatives.</p>
      </header>
      <div className="mt-5 space-y-4">
        {sortedMilestones.map((milestone) => {
          const project = projects.find((item) => item.id === milestone.projectId);
          const daysUntil = dayjs(milestone.targetDate).diff(dayjs(), "day");
          return (
            <article
              key={milestone.id}
              className={clsx(
                "flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-brand-300 md:flex-row md:items-center md:justify-between",
                milestone.completed ? "bg-slate-50" : "bg-white"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">{milestone.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {project?.name ?? "Unknown project"}
                  </span>
                </div>
                {milestone.description && (
                  <p className="mt-1 text-sm text-slate-600">{milestone.description}</p>
                )}
                <p className="mt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <CalendarDaysIcon className="h-4 w-4" />
                  {dayjs(milestone.targetDate).format("MMM D, YYYY")} ·{" "}
                  {daysUntil >= 0 ? `${daysUntil} days remaining` : "Past target"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleMilestone(milestone.id)}
                className={clsx(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                  milestone.completed
                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                )}
              >
                <CheckBadgeIcon className="h-5 w-5" />
                {milestone.completed ? "Completed" : "Mark complete"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
