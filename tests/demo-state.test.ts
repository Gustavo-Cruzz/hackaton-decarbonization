import {
  createDefaultDemoState,
  DEMO_STATE_STORAGE_KEY,
  loadDemoState,
  nextWeightsForSlider,
  sanitizeDemoState,
  saveDemoState,
  toggleCompareUfs
} from "@/lib/demo-state";
import { describe, expect, it, vi } from "vitest";

describe("demo state helpers", () => {
  it("sanitizes invalid persisted values", () => {
    const state = sanitizeDemoState({
      profile: "broken",
      objective: "broken",
      selectedUf: 12,
      mapLevel: "broken",
      compareUfs: [4],
      chatOpen: "yes"
    });

    expect(state.profile).toBe("investidor");
    expect(state.activeProfileLabel).toBe("Empresarial");
    expect(state.objective).toBe("hidrogenio-verde");
    expect(state.selectedUf).toBe("BA");
    expect(state.mapLevel).toBe("national");
    expect(state.selectedExperience).toBe("map");
    expect(state.hasChosenProfile).toBe(false);
    expect(state.compareUfs).toEqual(["BA", "CE", "ES"]);
    expect(state.chatOpen).toBe(false);
  });

  it("loads default state when storage is unavailable or broken", () => {
    const state = loadDemoState({
      getItem: vi.fn(() => "{")
    });

    expect(state).toEqual(createDefaultDemoState());
  });

  it("saves serialized state", () => {
    const setItem = vi.fn();
    saveDemoState({ setItem }, createDefaultDemoState());

    expect(setItem).toHaveBeenCalledWith(DEMO_STATE_STORAGE_KEY, expect.any(String));
  });

  it("treats legacy persisted state as already onboarded", () => {
    const state = loadDemoState({
      getItem: vi.fn(() =>
        JSON.stringify({
          profile: "engenheiro",
          objective: "industria-baixo-carbono",
          selectedUf: "BA"
        })
      )
    });

    expect(state.hasChosenProfile).toBe(true);
    expect(state.profile).toBe("engenheiro");
    expect(state.activeProfileLabel).toBe("Empresarial");
  });

  it("updates comparison list with max three territories", () => {
    expect(toggleCompareUfs(["BA", "CE"], "ES")).toEqual(["BA", "CE", "ES"]);
    expect(toggleCompareUfs(["BA", "CE", "ES"], "SP")).toEqual(["CE", "ES", "SP"]);
    expect(toggleCompareUfs(["BA", "CE"], "BA")).toEqual(["CE"]);
  });

  it("normalizes slider weights", () => {
    const next = nextWeightsForSlider(createDefaultDemoState().weights, "logistica", 40);
    const total = Object.values(next).reduce((sum, value) => sum + value, 0);

    expect(total).toBeCloseTo(1, 3);
    expect(next.logistica).toBeGreaterThan(0.15);
  });
});
