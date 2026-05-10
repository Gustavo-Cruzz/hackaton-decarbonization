import { ChatbotPanel } from "@/components/ChatbotPanel";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
});

describe("ChatbotPanel", () => {
  it("renders floating launcher, drawer history, and disables submit during loading", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onToggle = vi.fn();
    const onClose = vi.fn();

    const { rerender } = render(
      <ChatbotPanel
        isOpen
        question="Qual estado e melhor?"
        status="loading"
        errorMessage={null}
        history={[]}
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
        onToggle={onToggle}
        onClose={onClose}
      />
    );

    expect(screen.getByRole("button", { name: "Fechar chatbot" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Consultando..." })).toBeDisabled();
    expect(screen.getByPlaceholderText("Ex.: Qual estado devo priorizar para hidrogenio verde agora?")).toBeVisible();

    rerender(
      <ChatbotPanel
        isOpen
        question="Qual estado e melhor?"
        status="error"
        errorMessage="Falhou"
        history={[
          {
            id: "1",
            question: "Qual estado e melhor?",
            status: "error",
            errorMessage: "Falhou"
          }
        ]}
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
        onToggle={onToggle}
        onClose={onClose}
      />
    );

    expect(screen.getByText("Falhou")).toBeVisible();

    rerender(
      <ChatbotPanel
        isOpen
        question="Qual estado e melhor?"
        status="success"
        errorMessage={null}
        history={[
          {
            id: "2",
            question: "Qual estado e melhor?",
            status: "success",
            response: {
              answer: "Bahia lidera.",
              criteriaUsed: "Criterios usados aqui.",
              recommendation: "Recomendacao aqui.",
              referencedTerritories: ["BA"]
            }
          }
        ]}
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
        onToggle={onToggle}
        onClose={onClose}
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
        errorMessage={null}
        history={[]}
        onQuestionChange={vi.fn()}
        onSubmit={onSubmit}
        onToggle={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const textarea = screen.getAllByLabelText("Pergunta para o chatbot").at(-1) as HTMLTextAreaElement;
    expect(textarea.tagName).toBe("TEXTAREA");

    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders only the floating button when closed and toggles open state", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <ChatbotPanel
        isOpen={false}
        question=""
        status="idle"
        errorMessage={null}
        history={[]}
        onQuestionChange={vi.fn()}
        onSubmit={vi.fn()}
        onToggle={onToggle}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Abrir chatbot" })).toBeVisible();
    expect(screen.queryAllByRole("heading", { name: "Chatbot territorial" })).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Abrir chatbot" }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
