import { act } from "@testing-library/react";
import { initialTrackingState, useTrackingStore } from "@/store/useTrackingStore";

const getFreshState = () => JSON.parse(JSON.stringify(initialTrackingState));

describe("useTrackingStore", () => {
  beforeEach(() => {
    useTrackingStore.setState(getFreshState());
    window.localStorage.clear();
  });

  it("adds updates and adjusts project progress", () => {
    const { addUpdate } = useTrackingStore.getState();
    const targetProject = useTrackingStore.getState().projects[0];

    act(() => {
      addUpdate({
        author: "Test User",
        projectId: targetProject.id,
        summary: "Progress moved forward",
        category: "success",
        progressDelta: 5
      });
    });

    const state = useTrackingStore.getState();
    expect(state.updates[0]?.summary).toContain("Progress moved forward");
    const updatedProject = state.projects.find((project) => project.id === targetProject.id);
    expect(updatedProject).toBeDefined();
    expect(updatedProject?.progress).toBeGreaterThan(targetProject.progress);
  });

  it("toggles milestone completion", () => {
    const { milestones, toggleMilestone } = useTrackingStore.getState();
    const milestone = milestones[0];

    act(() => {
      toggleMilestone(milestone.id);
    });

    expect(useTrackingStore.getState().milestones[0].completed).toBe(!milestone.completed);
  });
});
