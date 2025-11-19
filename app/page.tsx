"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { ProjectList } from "@/components/dashboard/ProjectList";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ActivityFeed } from "@/components/timeline/ActivityFeed";
import { MilestoneBoard } from "@/components/timeline/MilestoneBoard";
import { NewUpdateForm } from "@/components/forms/NewUpdateForm";
import { useTrackingStore } from "@/store/useTrackingStore";
import { useMemo } from "react";

export default function Page() {
  const { projects, updates, milestones } = useTrackingStore((state) => ({
    projects: state.projects,
    updates: state.updates,
    milestones: state.milestones
  }));

  const latestUpdates = useMemo(() => updates.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)), [updates]);

  return (
    <AppShell>
      <SummaryCards projects={projects} updates={updates} />

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
        <PortfolioChart projects={projects} />
        <NewUpdateForm projects={projects} />
      </div>

      <ProjectList projects={projects} />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <ActivityFeed updates={latestUpdates} projects={projects} />
        <MilestoneBoard milestones={milestones} projects={projects} />
      </div>
    </AppShell>
  );
}
