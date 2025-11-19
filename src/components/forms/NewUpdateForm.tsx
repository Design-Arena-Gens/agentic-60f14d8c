import { useTrackingStore } from "@/store/useTrackingStore";
import type { Project } from "@/types/tracking";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateSchema = z.object({
  projectId: z.string().min(1, "Select a project"),
  summary: z.string().min(10, "Provide more detail").max(220),
  category: z.enum(["milestone", "risk", "success", "general"]),
  progressDelta: z
    .string()
    .optional()
    .transform((value) => (value && value.length ? Number(value) : undefined))
    .refine(
      (value) => value === undefined || (!Number.isNaN(value) && value >= -20 && value <= 20),
      "Use a value between -20 and 20"
    )
});

type UpdateFormValues = z.infer<typeof updateSchema>;

const defaultValues: UpdateFormValues = {
  projectId: "",
  summary: "",
  category: "general",
  progressDelta: undefined
};

interface NewUpdateFormProps {
  projects: Project[];
}

export function NewUpdateForm({ projects }: NewUpdateFormProps) {
  const addUpdate = useTrackingStore((state) => state.addUpdate);
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues
  });

  const onSubmit = (data: UpdateFormValues) => {
    addUpdate({
      author: "You",
      projectId: data.projectId,
      summary: data.summary,
      category: data.category,
      progressDelta: data.progressDelta
    });
    reset(defaultValues);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <section className="rounded-3xl border border-dashed border-brand-200 bg-white p-6 shadow-soft">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">Log a pulse update</h2>
        <p className="mt-1 text-sm text-slate-500">
          Share the latest signal so stakeholders can stay aligned.
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500" htmlFor="projectId">
            Project
          </label>
          <select
            id="projectId"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
            {...register("projectId")}
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.projectId && <p className="mt-1 text-xs text-rose-500">{errors.projectId.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500" htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
            rows={3}
            placeholder="Share key outcomes, blockers, or next steps..."
            {...register("summary")}
          />
          {errors.summary && <p className="mt-1 text-xs text-rose-500">{errors.summary.message}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
              {...register("category")}
            >
              <option value="general">General</option>
              <option value="milestone">Milestone</option>
              <option value="risk">Risk</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-500" htmlFor="progressDelta">
              Progress delta (optional)
            </label>
            <input
              id="progressDelta"
              type="number"
              placeholder="+3"
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
              {...register("progressDelta")}
            />
            {errors.progressDelta && <p className="mt-1 text-xs text-rose-500">{errors.progressDelta.message}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between">
          {submitted ? (
            <span className="text-sm font-medium text-emerald-600">Update logged successfully</span>
          ) : (
            <span className="text-xs text-slate-500">Progress delta updates the project instantly.</span>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? "Logging..." : "Share update"}
          </button>
        </div>
      </form>
    </section>
  );
}
