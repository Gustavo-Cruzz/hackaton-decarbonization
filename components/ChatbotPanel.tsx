"use client";

import { ChatResponse, ChatUiState } from "@/lib/types";

interface ChatbotPanelProps {
  isOpen: boolean;
  question: string;
  status: ChatUiState;
  response: ChatResponse | null;
  errorMessage: string | null;
  territorialContextLabel?: string;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChatbotPanel({
  isOpen,
  question,
  status,
  response,
  errorMessage,
  territorialContextLabel,
  onQuestionChange,
  onSubmit
}: ChatbotPanelProps) {
  if (!isOpen) {
    return null;
  }

  const isLoading = status === "loading";

  return (
    <section className="glass rounded-[28px] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--navy)]">Chatbot territorial</h2>
          <p className="text-sm text-[var(--muted)]">
            Pergunte como um copiloto: ele consulta territorio, perfil, objetivo, ranking e contexto do mapa antes de responder.
          </p>
        </div>
        <div className="rounded-full bg-[rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
          Dados locais
        </div>
      </div>
      {territorialContextLabel ? (
        <div className="mt-3 rounded-[20px] bg-[rgba(19,53,75,0.06)] px-4 py-3 text-sm text-[var(--foreground)]">
          Contexto atual: {territorialContextLabel}
        </div>
      ) : null}
      <div className="mt-4 flex gap-2">
        <input
          aria-label="Pergunta para o chatbot"
          className="surface-strong w-full rounded-2xl px-4 py-3 outline-none"
          placeholder="Ex.: Qual estado devo priorizar para hidrogenio verde agora?"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
        />
        <button
          type="button"
          className="rounded-2xl bg-[var(--teal)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onSubmit}
          disabled={isLoading || question.trim().length === 0}
        >
          {isLoading ? "Consultando..." : "Perguntar"}
        </button>
      </div>
      {status === "loading" ? <p className="mt-4 text-sm text-[var(--muted)]">Consultando dados do MVP...</p> : null}
      {status === "error" && errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[rgba(220,38,38,0.16)] bg-[rgba(220,38,38,0.06)] p-4 text-sm text-[#991b1b]">
          {errorMessage}
        </div>
      ) : null}
      {response ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(19,53,75,0.95),rgba(15,118,110,0.88))] p-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Resposta direta</div>
            <p className="mt-2 text-base text-white">{response.answer}</p>
          </div>
          <div className="surface-strong rounded-2xl p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Criterios usados</div>
            <p className="mt-2 text-xs text-[var(--foreground)]">{response.criteriaUsed}</p>
          </div>
          {response.territorialContext ? (
            <div className="surface-strong rounded-2xl p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Contexto territorial</div>
              <p className="mt-2 text-xs text-[var(--foreground)]">{response.territorialContext}</p>
            </div>
          ) : null}
          <div className="surface-strong rounded-2xl p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Recomendacao</div>
            <p className="mt-2 text-sm text-[var(--foreground)]">{response.recommendation}</p>
          </div>
          <p className="text-xs text-[var(--muted)]">{response.mvpDisclaimer}</p>
        </div>
      ) : null}
    </section>
  );
}
