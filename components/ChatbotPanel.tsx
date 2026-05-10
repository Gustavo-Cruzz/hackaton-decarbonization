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
    <section className="rounded-[30px] border border-[rgba(242,111,99,0.24)] bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(255,240,236,0.92)_42%,rgba(228,246,241,0.94)_100%)] p-5 shadow-[0_28px_80px_rgba(22,56,77,0.16)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center rounded-full border border-[rgba(242,111,99,0.2)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--coral-deep)]">
            Spotlight IA
          </div>
          <h2 className="mt-3 text-xl font-semibold text-[var(--navy)]">Chatbot territorial</h2>
          <p className="text-sm text-[var(--muted)]">
            Pergunte como um copiloto: ele consulta territorio, perfil, objetivo, ranking e contexto do mapa antes de responder.
          </p>
        </div>
        <div className="rounded-full bg-[rgba(15,118,110,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
          Dados locais
        </div>
      </div>
      {territorialContextLabel ? (
        <div className="mt-4 rounded-[22px] border border-[rgba(22,56,77,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-3 text-sm text-[var(--foreground)]">
          Contexto atual: {territorialContextLabel}
        </div>
      ) : null}
      <div className="mt-4 rounded-[26px] border border-[rgba(242,111,99,0.18)] bg-[rgba(255,255,255,0.8)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--coral-deep)]">
          Pergunta guiada
        </div>
        <div className="flex gap-2">
          <input
            aria-label="Pergunta para o chatbot"
            className="w-full rounded-[22px] border border-[rgba(22,56,77,0.08)] bg-white px-4 py-3.5 text-[15px] outline-none transition placeholder:text-[rgba(97,120,112,0.9)] focus:border-[rgba(242,111,99,0.45)] focus:ring-4 focus:ring-[rgba(242,111,99,0.12)]"
            placeholder="Ex.: Qual estado devo priorizar para hidrogenio verde agora?"
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
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
      {status === "loading" ? <p className="mt-4 text-sm text-[var(--muted)]">Consultando dados do MVP...</p> : null}
      {status === "error" && errorMessage ? (
        <div className="mt-4 rounded-2xl border border-[rgba(220,38,38,0.16)] bg-[rgba(220,38,38,0.06)] p-4 text-sm text-[#991b1b]">
          {errorMessage}
        </div>
      ) : null}
      {response ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-[26px] bg-[linear-gradient(135deg,rgba(22,56,77,0.97),rgba(15,118,110,0.88)_58%,rgba(242,111,99,0.74))] p-5 text-white shadow-[0_22px_44px_rgba(22,56,77,0.24)]">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Resposta direta</div>
            <p className="mt-2 text-base text-white">{response.answer}</p>
          </div>
          <div className="surface-strong rounded-[24px] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Criterios usados</div>
            <p className="mt-2 text-xs text-[var(--foreground)]">{response.criteriaUsed}</p>
          </div>
          {response.territorialContext ? (
            <div className="surface-strong rounded-[24px] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Contexto territorial</div>
              <p className="mt-2 text-xs text-[var(--foreground)]">{response.territorialContext}</p>
            </div>
          ) : null}
          <div className="surface-strong rounded-[24px] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Recomendacao</div>
            <p className="mt-2 text-sm text-[var(--foreground)]">{response.recommendation}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
