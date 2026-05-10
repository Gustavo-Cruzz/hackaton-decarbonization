import { ChatbotPanel } from "@/components/ChatbotPanel";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("ChatbotPanel", () => {
  it("shows error state and disables submit during loading", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const { rerender } = render(
      <ChatbotPanel
        isOpen
        question="Qual estado e melhor?"
        status="loading"
        response={null}
        errorMessage={null}
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByRole("button", { name: "Consultando..." })).toBeDisabled();
    expect(screen.getByPlaceholderText("Ex.: Qual estado devo priorizar para hidrogenio verde agora?")).toBeVisible();

    rerender(
      <ChatbotPanel
        isOpen
        question="Qual estado e melhor?"
        status="error"
        response={null}
        errorMessage="Falhou"
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText("Falhou")).toBeVisible();

    rerender(
      <ChatbotPanel
        isOpen
        question="Qual estado e melhor?"
        status="success"
        response={{
          answer: "Bahia lidera.",
          criteriaUsed: "Criterios usados aqui.",
          recommendation: "Recomendacao aqui.",
          referencedTerritories: ["BA"]
        }}
        errorMessage={null}
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    await user.click(screen.getByRole("button", { name: "Perguntar" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Bahia lidera.")).toBeVisible();
    expect(screen.getByText("Criterios usados aqui.")).toBeVisible();
  });

  it("uses a growing textarea and submits with ctrl+enter", () => {
    const onSubmit = vi.fn();

    render(
      <ChatbotPanel
        isOpen
        question={"Preciso comparar um texto bem maior\ncom varias linhas\npara conseguir ler melhor"}
        status="idle"
        response={null}
        errorMessage={null}
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    const textarea = screen.getAllByLabelText("Pergunta para o chatbot").at(-1) as HTMLTextAreaElement;
    expect(textarea.tagName).toBe("TEXTAREA");

    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
