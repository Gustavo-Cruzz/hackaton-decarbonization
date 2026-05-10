"use client";

import { useEffect, useRef } from "react";
import { ChatHistoryEntry, ChatUiState } from "@/lib/types";

interface ChatbotPanelProps {
  isOpen: boolean;
  question: string;
  status: ChatUiState;
  errorMessage: string | null;
  territorialContextLabel?: string;
  history: ChatHistoryEntry[];
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
  onToggle: () => void;
  onClose: () => void;
}

export function ChatbotPanel({
  isOpen,
  question,
  status,
  errorMessage,
  territorialContextLabel,
  history,
  onQuestionChange,
  onSubmit,
  onToggle,
  onClose
}: ChatbotPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isLoading = status === "loading";

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = "0px";
    const nextHeight = Math.min(element.scrollHeight, 220);
    element.style.height = `${Math.max(nextHeight, 88)}px`;
  }, [question, isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Fechar chatbot" : "Abrir chatbot"}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,var(--coral),var(--coral-deep))] px-4 py-3 text-sm font-semibold text-white shadow-[0_24px_48px_rgba(22,56,77,0.24)] transition hover:brightness-105 lg:bottom-7 lg:right-7"
        onClick={onToggle}
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/16 text-lg">AI</span>
        <span>Chat territorial</span>
        {history.length > 0 ? (
          <span className="rounded-full bg-white/18 px-2 py-1 text-xs font-semibold">{history.length}</span>
        ) : null}
      </button>

      {isOpen ? (
        <section className="fixed inset-x-4 bottom-24 z-[65] max-h-[calc(100vh-7rem)] overflow-hidden rounded-[30px] border border-[rgba(242,111,99,0.24)] bg-[linear-gradient(160deg,rgba(255,255,255,0.97),rgba(255,240,236,0.93)_42%,rgba(228,246,241,0.95)_100%)] shadow-[0_32px_96px_rgba(22,56,77,0.22)] lg:left-auto lg:right-7 lg:w-[460px]">
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(22,56,77,0.08)] px-5 py-4">
            <div>
              <div className="inline-flex items-center rounded-full border border-[rgba(242,111,99,0.2)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--coral-deep)]">
                Spotlight IA
              </div>
              <h2 className="mt-3 text-xl font-semibold text-[var(--navy)]">Chatbot territorial</h2>
              <p className="text-sm text-[var(--muted)]">
                Pergunte por territorio, objetivo e contexto do mapa sem sair da tela principal.
              </p>
            </div>
            <button
              type="button"
              aria-label="Fechar painel do chatbot"
              className="rounded-full border border-[var(--border)] bg-white/85 px-3 py-2 text-sm font-semibold text-[var(--navy)]"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>

          <div className="max-h-[calc(100vh-22rem)] overflow-y-auto px-5 py-4 lg:max-h-[420px]">
            {territorialContextLabel ? (
              <div className="mb-4 rounded-[22px] border border-[rgba(22,56,77,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground)]">
                Contexto atual: {territorialContextLabel}
              </div>
            ) : null}

            {history.length === 0 && !isLoading ? (
              <div className="rounded-[24px] border border-dashed border-[rgba(22,56,77,0.16)] bg-white/70 p-4 text-sm text-[var(--muted)]">
                Nenhuma conversa ainda. Abra uma pergunta guiada ou escreva sua primeira pergunta abaixo.
              </div>
            ) : null}

            <div className="space-y-4">
              {history.map((entry) => (
                <article key={entry.id} className="space-y-3 rounded-[24px] border border-[rgba(22,56,77,0.08)] bg-white/76 p-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Pergunta</div>
                    <p className="mt-2 text-sm text-[var(--foreground)]">{entry.question}</p>
                  </div>

                  {entry.status === "success" && entry.response ? (
                    <>
                      <div className="rounded-[22px] bg-[linear-gradient(135deg,rgba(22,56,77,0.97),rgba(15,118,110,0.88)_58%,rgba(242,111,99,0.74))] p-4 text-white shadow-[0_18px_36px_rgba(22,56,77,0.18)]">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Resposta direta</div>
                        <p className="mt-2 text-sm text-white">{entry.response.answer}</p>
                      </div>

                      <div className="surface-strong rounded-[22px] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Criterios usados</div>
                        <p className="mt-2 text-xs text-[var(--foreground)]">{entry.response.criteriaUsed}</p>
                      </div>

                      {entry.response.territorialContext || entry.territorialContextLabel ? (
                        <div className="surface-strong rounded-[22px] p-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Contexto territorial</div>
                          <p className="mt-2 text-xs text-[var(--foreground)]">
                            {entry.response.territorialContext ?? `Contexto atual: ${entry.territorialContextLabel}`}
                          </p>
                        </div>
                      ) : null}

                      <div className="surface-strong rounded-[22px] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Recomendacao</div>
                        <p className="mt-2 text-sm text-[var(--foreground)]">{entry.response.recommendation}</p>
                      </div>
                    </>
                  ) : null}

                  {entry.status === "error" && entry.errorMessage ? (
                    <div className="rounded-2xl border border-[rgba(220,38,38,0.16)] bg-[rgba(220,38,38,0.06)] p-4 text-sm text-[#991b1b]">
                      {entry.errorMessage}
                    </div>
                  ) : null}
                </article>
              ))}

              {isLoading ? (
                <div className="rounded-[22px] border border-[rgba(22,56,77,0.08)] bg-white/76 p-4 text-sm text-[var(--muted)]">
                  Consultando dados do MVP...
                </div>
              ) : null}

              {!isLoading && status === "error" && errorMessage && history.length === 0 ? (
                <div className="rounded-2xl border border-[rgba(220,38,38,0.16)] bg-[rgba(220,38,38,0.06)] p-4 text-sm text-[#991b1b]">
                  {errorMessage}
                </div>
              ) : null}
            </div>
          </div>

          <div className="border-t border-[rgba(22,56,77,0.08)] bg-white/68 px-5 py-4">
            <div className="rounded-[26px] border border-[rgba(242,111,99,0.18)] bg-[rgba(255,255,255,0.8)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--coral-deep)]">
                Pergunta guiada
              </div>
              <div className="flex gap-2">
                <textarea
                  aria-label="Pergunta para o chatbot"
                  ref={textareaRef}
                  rows={3}
                  className="w-full resize-none overflow-y-auto rounded-[22px] border border-[rgba(22,56,77,0.08)] bg-white px-4 py-3.5 text-[15px] outline-none transition placeholder:text-[rgba(97,120,112,0.9)] focus:border-[rgba(242,111,99,0.45)] focus:ring-4 focus:ring-[rgba(242,111,99,0.12)]"
                  placeholder="Ex.: Qual estado devo priorizar para hidrogenio verde agora?"
                  value={question}
                  onChange={(event) => onQuestionChange(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !isLoading && question.trim().length > 0) {
                      event.preventDefault();
                      onSubmit();
                    }
                  }}
                />
                <button
                  type="button"
                  className="rounded-[22px] bg-[linear-gradient(135deg,var(--coral),var(--coral-deep))] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(242,111,99,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={onSubmit}
                  disabled={isLoading || question.trim().length === 0}
                >
                  {isLoading ? "Consultando..." : "Perguntar"}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
