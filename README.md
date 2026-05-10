# PID MVP

## Visão geral

O PID MVP é um MVP de pitch para uma plataforma territorial de transição energética e descarbonização industrial no Brasil.

A plataforma combina mapa, IMTE, rankings, análises personalizadas, perfis de usuário e chatbot contextual para transformar informação territorial em decisão.

Na versão atual, o MVP usa uma base híbrida:

- `ANEEL SIGA` para usinas, fontes e potência instalada;
- `IBGE` para estados, malha oficial por UF, população e indicadores econômicos;
- sinais curados temporários para `logística` e parte de `infraestrutura`.

## Proposta de valor

O MVP demonstra como governos, investidores, engenheiros e pesquisadores podem identificar territórios com maior maturidade para projetos de transição energética e descarbonização industrial no Brasil.

A plataforma não é apenas um mapa com camadas: ela funciona como um copiloto de decisão territorial.

## Funcionalidades implementadas

- [x] Mapa interativo do Brasil com malha oficial simplificada por UF
- [x] Seleção de estados
- [x] Painel IMTE
- [x] Ranking por maturidade
- [x] Comparação entre estados
- [x] Índices customizáveis por objetivo
- [x] Perfis de usuário
- [x] Chatbot contextual com dados locais
- [x] Base híbrida local com ANEEL SIGA, IBGE e sinais curados temporários
- [x] Testes unitários e E2E
- [ ] Geometrias reais em GeoJSON
- [ ] Dados oficiais em tempo real em runtime
- [ ] Banco geoespacial
- [ ] Persistência backend de análises
- [ ] LLM conectada em produção

Funcionalidades atuais em mais detalhe:

- mapa com 27 UFs processadas a partir da malha oficial do IBGE;
- fluxo de pitch validado com `Bahia`, `Ceará`, `Espírito Santo`, `Minas Gerais`, `São Paulo`, `Pernambuco`, `Rio de Janeiro`, `Rio Grande do Sul`, `Pará` e `Goiás`;
- seleção de território por clique e destaque visual do estado ativo;
- camadas ligáveis/desligáveis para `solar`, `eólica`, `biomassa`, `portos`, `indústrias`, `hubs de descarbonização` e `IMTE`;
- painel territorial com nota IMTE, classificação, dimensões, forças, gargalos, recomendação e resumo `Por que este território agora`;
- ranking recalculado por objetivo e pesos ativos, com destaque de `Top 3`;
- comparação entre até 3 estados com diferenças em IMTE, forças e gargalos;
- objetivos de análise: `Hidrogênio verde`, `SAF`, `Biometano`, `Indústria de baixo carbono` e `Política pública`;
- perfis `Gestor público`, `Investidor`, `Engenheiro` e `Pesquisador`, alterando linguagem, insights e perguntas sugeridas;
- chatbot usando dados locais do MVP, estado selecionado, perfil, objetivo e ranking atual;
- persistência de estado da demonstração com `localStorage`.

## Fluxo de demonstração para pitch

1. Abra a aplicação.
2. Selecione o perfil `Investidor`.
3. Escolha o objetivo `Hidrogênio verde`.
4. Clique na `Bahia`.
5. Observe o IMTE, forças, gargalos e recomendação.
6. Compare `Bahia`, `Ceará` e `Espírito Santo`.
7. Ajuste os pesos do índice personalizado.
8. Veja o ranking recalculado.
9. Abra o chatbot.
10. Pergunte: `Qual estado é melhor para hidrogênio verde?`

Atalho disponível na UI:

- `Pitch rapido: Investidor + Hidrogenio verde + Bahia`

## Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `@google/genai`
- `Vitest`
- `Playwright`

## Como rodar

```bash
npm install
npm run build:data
npm run dev
```

Abra `http://localhost:3000`.

## Configuração do Gemini

O chat pode usar o Gemini no backend para gerar respostas reais, com fallback automático para a engine local quando a chave não estiver configurada ou a API falhar.

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash
```

O arquivo [.env.example](/home/gust/hacka/.env.example) mostra esse formato.

## Testes

Comandos atuais:

```bash
npm run build:data
npm run test:unit
npm run test:e2e
npm run build
```

Cobertura atual inclui:

- cálculo do IMTE;
- ranking e comparação;
- recálculo com pesos customizados;
- engine básica do chatbot;
- testes de persistência do estado da demo;
- teste E2E do fluxo principal de pitch.

## Estrutura do projeto

```txt
app/         UI e rotas internas /api
components/  blocos visuais da experiência
data/        objetivos, perfis, snapshots oficiais e dataset processado
lib/         cálculo IMTE, ranking, chatbot e estado da demo
scripts/     pipeline offline de ingestão ANEEL/IBGE
tests/       testes unitários, de contrato e E2E
docs/        documentação de apoio
```

Documentos úteis:

- `docs/funcionalidades-atuais.md`
- `docs/imte-metodologia-v2.md`

## Dados demonstrativos

Os dados deste MVP combinam snapshots oficiais e sinais curados temporários. Eles servem para validação de produto, storytelling e demonstração. Eles não devem ser usados para tomada de decisão real sem validação metodológica complementar.

Os dados estão organizados principalmente em:

```txt
data/raw/
data/processed/
siga-empreendimentos-geracao.json
```

Modelo atual de IMTE:

```txt
IMTE base
30% Energia limpa
25% Infraestrutura
20% Base industrial
15% Logística
10% Socioambiental
```

Observação:

- o MVP usa essa fórmula-base como default;
- objetivos específicos como `Hidrogênio verde`, `SAF` e `Biometano` aplicam pesos próprios para recalcular o ranking conforme o caso de uso;
- `energia limpa`, `indústria`, `mapa` e parte da leitura socioeconômica já usam base oficial;
- `logística` e parte de `infraestrutura` continuam em modo híbrido temporário.

Proveniência por dimensão no `IMTE híbrido v2.1`:

- `Energia limpa`: oficial, derivada de capacidade renovável e diversidade de fontes do `ANEEL SIGA`.
- `Infraestrutura`: híbrida, combinando sinais curados temporários com escala de capacidade instalada.
- `Base industrial`: híbrida, combinando `IBGE` com intensidade industrial complementar curada.
- `Logística`: curada temporariamente por `UF`.
- `Socioambiental`: derivada de proxies estaduais com `IBGE` + participação renovável.

## Limitações do MVP

- Não usa atualização automática em tempo real.
- Não possui banco geoespacial.
- Não possui autenticação.
- Não possui persistência de análises em backend.
- Não possui ingestão automática de APIs externas.
- O chatbot usa dados locais/híbridos e não substitui análise técnica.
- O mapa usa malha oficial simplificada por UF, sem drill-down municipal.
- Logística e parte da infraestrutura ainda dependem de sinais curados temporários.

## Próximos passos para produção

- Integrar dados oficiais do `IBGE`, `ANEEL` e bases ambientais.
- Evoluir para geometrias e camadas geoespaciais reais.
- Substituir sinais curados de logística/infraestrutura por fontes oficiais.
- Adicionar persistência.
- Conectar LLM real com retrieval controlado.
- Criar versionamento de metodologia IMTE.
- Adicionar exportação de relatórios.
- Preparar arquitetura de produção.
