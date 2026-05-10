"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ClientSectionBoundaryProps {
  children: ReactNode;
  label: string;
}

interface ClientSectionBoundaryState {
  hasError: boolean;
}

export class ClientSectionBoundary extends Component<ClientSectionBoundaryProps, ClientSectionBoundaryState> {
  state: ClientSectionBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Section failure: ${this.props.label}`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="glass rounded-[28px] p-5">
          <h2 className="text-lg font-semibold text-[var(--navy)]">Falha ao carregar {this.props.label}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Esta secao encontrou um erro no cliente. Recarregue a pagina para tentar novamente.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
