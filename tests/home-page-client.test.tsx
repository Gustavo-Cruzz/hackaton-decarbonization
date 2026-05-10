import HomePageClient from "@/components/HomePageClient";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const replaceState = vi.fn();

beforeEach(() => {
  replaceState.mockReset();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    },
    configurable: true
  });
  Object.defineProperty(window, "history", {
    value: { replaceState },
    configurable: true
  });
  Object.defineProperty(window, "location", {
    value: { search: "", pathname: "/", origin: "http://localhost:3000" },
    configurable: true
  });
});

describe("HomePageClient onboarding", () => {
  it("asks the user to choose a profile before entering the app", async () => {
    const user = userEvent.setup();
    render(<HomePageClient />);

    expect(await screen.findByText("Escolha seu perfil")).toBeVisible();
    expect(screen.queryByLabelText("Objetivo")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Entrar como Investidor/i }));

    expect(await screen.findByLabelText("Objetivo")).toBeVisible();
    expect(screen.queryByLabelText("Perfil")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mapa interativo com bot" })).toBeVisible();
  });

  it("switches to the Power BI experience from the header", async () => {
    const user = userEvent.setup();
    render(<HomePageClient />);

    await user.click(await screen.findByRole("button", { name: /Entrar como Investidor/i }));
    await user.click(screen.getAllByRole("button", { name: "Projetos ANP e ANEEL" })[0]);

    expect(await screen.findByTitle("Projetos ANP e ANEEL")).toBeVisible();
  });
});
