import { calculateDashboardMetrics } from "@/utils/metrics";
import type { Project, Update } from "@/types/tracking";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  FolderIcon,
  RocketLaunchIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

interface SummaryCardsProps {
  projects: Project[];
  updates: Update[];
}

const cards = [
  {
    key: "totalProjects" as const,
    label: "Active initiatives",
    icon: FolderIcon,
    accent: "bg-brand-50 text-brand-600"
  },
  {
    key: "onTrack" as const,
    label: "On track",
    icon: CheckCircleIcon,
    accent: "bg-emerald-50 text-emerald-600"
  },
  {
    key: "atRisk" as const,
    label: "At risk",
    icon: ExclamationTriangleIcon,
    accent: "bg-amber-50 text-amber-600"
  },
  {
    key: "offTrack" as const,
    label: "Off track",
    icon: FireIcon,
    accent: "bg-rose-50 text-rose-600"
  },
  {
    key: "avgProgress" as const,
    label: "Average progress",
    icon: RocketLaunchIcon,
    accent: "bg-sky-50 text-sky-600",
    suffix: "%"
  },
  {
    key: "updatesThisWeek" as const,
    label: "Updates this week",
    icon: SparklesIcon,
    accent: "bg-violet-50 text-violet-600"
  }
];

export function SummaryCards({ projects, updates }: SummaryCardsProps) {
  const metrics = calculateDashboardMetrics(projects, updates);

  return (
    <section
      id="dashboard"
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      aria-label="Portfolio metrics"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const value = metrics[card.key];
        const formatted = card.suffix ? `${value}${card.suffix}` : value;
        return (
          <article
            key={card.key}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{formatted}</p>
            </div>
            <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}>
              <Icon className="h-6 w-6" aria-hidden />
            </span>
          </article>
        );
      })}
    </section>
  );
}
