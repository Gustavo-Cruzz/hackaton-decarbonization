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
  async function completeBusinessOnboarding(user: ReturnType<typeof userEvent.setup>) {
    await user.type(await screen.findByLabelText(/Nome completo/i), "Maria da Silva");
    await user.type(screen.getByLabelText(/E-mail/i), "maria@example.com");
    await user.type(screen.getByLabelText(/Organizacao/i), "Empresa Verde");
    await user.type(screen.getByLabelText(/Estado de atuacao/i), "Bahia");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(screen.getByRole("button", { name: "Pessoa Juridica" }));
    await user.click(screen.getByRole("button", { name: /Empresarial/i }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.selectOptions(screen.getByLabelText(/Qual setor da empresa/i), "energy");
    await user.selectOptions(screen.getByLabelText(/Qual seu principal interesse/i), "investment-viability");
    await user.click(screen.getByRole("button", { name: "ROI de projetos verdes" }));
    await user.click(screen.getByRole("button", { name: "Sim" }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(screen.getByRole("button", { name: "Hidrogenio verde" }));
    await user.click(screen.getByRole("button", { name: "Avancado" }));
    await user.click(screen.getAllByRole("button", { name: "Sim" }).at(-1)!);
    await user.click(screen.getByRole("button", { name: "Entrar na plataforma" }));
  }

  it("asks the user to choose a profile before entering the app", async () => {
    const user = userEvent.setup();
    render(<HomePageClient />);

    expect(await screen.findByText("Configure sua experiencia em quatro etapas")).toBeVisible();
    expect(screen.queryByLabelText("Objetivo")).not.toBeInTheDocument();

    await completeBusinessOnboarding(user);

    expect(await screen.findByLabelText("Objetivo")).toBeVisible();
    expect(screen.queryByLabelText("Perfil")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mapa interativo com bot" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Ocultar chatbot" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir chatbot" })).toBeVisible();
  });

  it("switches to the Power BI experience from the header", async () => {
    const user = userEvent.setup();
    render(<HomePageClient />);

    await completeBusinessOnboarding(user);
    await user.click(screen.getAllByRole("button", { name: "Projetos ANP e ANEEL" })[0]);

    expect(await screen.findByTitle("Projetos ANP e ANEEL")).toBeVisible();
  });
});
