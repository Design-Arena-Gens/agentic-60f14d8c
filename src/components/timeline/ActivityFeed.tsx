import type { Project, Update } from "@/types/tracking";
import { ChatBubbleOvalLeftEllipsisIcon, TrophyIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import clsx from "classnames";
import dayjs from "@/lib/dayjs";

const categoryMeta = {
  milestone: {
    label: "Milestone",
    icon: TrophyIcon,
    accent: "bg-emerald-50 text-emerald-600"
  },
  success: {
    label: "Win",
    icon: TrophyIcon,
    accent: "bg-sky-50 text-sky-600"
  },
  risk: {
    label: "Risk",
    icon: ExclamationTriangleIcon,
    accent: "bg-amber-50 text-amber-600"
  },
  general: {
    label: "Update",
    icon: ChatBubbleOvalLeftEllipsisIcon,
    accent: "bg-slate-100 text-slate-600"
  }
} as const;

interface ActivityFeedProps {
  updates: Update[];
  projects: Project[];
}

export function ActivityFeed({ updates, projects }: ActivityFeedProps) {
  return (
    <section
      id="updates"
      className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft"
      aria-label="Recent updates"
    >
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Signal stream</h2>
        <p className="mt-1 text-sm text-slate-500">Latest updates from project owners and leads.</p>
      </header>
      <div className="space-y-5">
        {updates.map((update) => {
          const project = projects.find((item) => item.id === update.projectId);
          const category = categoryMeta[update.category];
          const Icon = category.icon;
          return (
            <article key={update.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", category.accent)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{project?.name ?? "Unknown project"}</p>
                    <p className="text-xs text-slate-500">
                      {update.author} · {dayjs(update.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                {typeof update.progressDelta === "number" && (
                  <span
                    className={clsx(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      update.progressDelta >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}
                  >
                    {update.progressDelta >= 0 ? "+" : ""}
                    {update.progressDelta}% progress
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{update.summary}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
