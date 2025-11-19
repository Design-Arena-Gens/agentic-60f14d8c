import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { PropsWithChildren } from "react";

const navigation = [
  { name: "Dashboard", href: "#dashboard" },
  { name: "Projects", href: "#projects" },
  { name: "Milestones", href: "#milestones" },
  { name: "Updates", href: "#updates" }
];

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
              <span className="text-lg font-semibold">PT</span>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">PulseTrack</p>
              <p className="text-xs text-slate-500">Visibility for product and delivery teams</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="transition hover:text-brand-600">
                {item.name}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 md:hidden"
          >
            <Bars3Icon className="mr-2 h-5 w-5" />
            Menu
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
