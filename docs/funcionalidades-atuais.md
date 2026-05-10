# Funcionalidades Atuais do PID MVP

## 1. Visão geral

O `PID MVP` é uma aplicação de pitch para demonstrar uma experiência de decisão territorial para transição energética e descarbonização industrial no Brasil.

Na interface atual, o produto combina:

- onboarding inteligente por perfil;
- modo principal `Mapa interativo com bot`;
- experiência alternativa `Projetos ANP e ANEEL` via `Power BI`;
- `IMTE` híbrido estadual;
- drill-down municipal demonstrativo;
- chatbot flutuante com histórico simples da conversa.

O produto trabalha com dados locais processados e não depende de ingestão em runtime para funcionar.

## 2. Experiência principal

### 2.1. Onboarding

Antes de entrar na aplicação principal, o usuário passa por um onboarding multi-etapas com:

- identificação básica;
- classificação como pessoa física ou jurídica;
- escolha de perfil principal:
  - `Empresarial`
  - `Governamental`
  - `Pesquisador / Acadêmico`
- perguntas condicionais por perfil;
- personalização final por temas e nível de conhecimento.

O onboarding define o contexto inicial do app e também alimenta o contexto enviado ao chatbot.

### 2.2. Header e modos de experiência

Após o onboarding, o topo da aplicação mostra duas experiências:

- `Mapa interativo com bot`
- `Projetos ANP e ANEEL`

O header atual também mantém:

- objetivo analítico ativo;
- CTA de pitch rápido;
- indicação do perfil ativo.

O seletor de perfil não fica mais no header. O perfil vem do onboarding.

### 2.3. Mapa principal

O modo `Mapa interativo com bot` usa `react-leaflet` e hoje oferece:

- visão nacional;
- foco por `UF`;
- drill-down municipal quando houver chunk local disponível;
- basemap online por padrão;
- fallback local quando o basemap falha;
- tema ativo, layers ligáveis/desligáveis, legenda dinâmica e opacidade;
- reset de visão, compartilhamento por URL e download JSON do território.

O mapa sincroniza a seleção com:

- painel territorial;
- ranking;
- comparação;
- chatbot.

### 2.4. Drill-down municipal

O drill-down atual é `demonstrativo`.

Estado atual:

- existe suporte de produto e de UI para `Brasil -> UF -> município`;
- a aplicação faz carga sob demanda via `/api/territories/[uf]?level=municipal`;
- hoje há chunk local versionado para `BA`;
- a leitura municipal usa `IMTE proxy`, não score oficial;
- o app volta ao nível estadual quando o chunk municipal não está disponível.

### 2.5. Painel territorial

O painel lateral mostra, conforme o recorte ativo:

- nome do território;
- tipo territorial;
- `IMTE` ou `IMTE proxy`;
- classificação;
- melhor sinal e principal restrição;
- explicação do recorte;
- dimensão dominante;
- posição no ranking;
- barras por dimensão;
- recomendação principal;
- detalhamento recolhível de ativos, forças e gargalos;
- bloco metodológico quando o território é estadual.

### 2.6. Editor de IMTE

O `Indice personalizavel` hoje fica próximo do mapa e permite:

- ler o objetivo ativo;
- ver dimensão dominante e segundo peso;
- ajustar pesos por slider;
- restaurar pesos padrão do objetivo;
- recalcular ranking e leitura territorial em tempo real.

### 2.7. Ranking e comparação

O produto permite:

- ranking estadual por `IMTE`;
- destaque de `Top 3`;
- clique no ranking para focar o território no mapa;
- comparação entre até `3` estados;
- leitura lado a lado de `IMTE`, forças e gargalos.

Esses blocos ficam em painéis secundários recolhíveis abaixo da área principal.

### 2.8. Chatbot flutuante

O chatbot atual:

- abre por botão flutuante;
- aparece em um drawer sobreposto à interface;
- mantém histórico simples da sessão;
- recebe contexto de:
  - território em foco,
  - nível territorial,
  - objetivo,
  - perfil,
  - layers ativas,
  - onboarding.

O backend tenta `Gemini` primeiro e cai para a engine local quando a API falha ou não está configurada.

### 2.9. Power BI embutido

O modo `Projetos ANP e ANEEL` renderiza um `iframe` com `Power BI` dentro da mesma aplicação.

Esse painel:

- é uma segunda experiência da mesma página;
- não substitui o dataset local processado do mapa;
- serve como exploração complementar de projetos.

## 3. Persistência e contratos do app

O estado principal da demo é salvo em `localStorage`.

Hoje ele inclui, entre outros:

- perfil interno compatível com o motor atual;
- rótulo do perfil ativo;
- objetivo;
- pesos;
- experiência selecionada (`map` ou `powerbi`);
- `UF` selecionada;
- nível territorial;
- município selecionado, quando houver;
- layers ativas;
- opacidade;
- abertura do chat;
- última pergunta;
- respostas do onboarding.

Rotas internas relevantes:

- `GET /api/territories/[uf]`
- `GET /api/territories/[uf]?level=municipal`
- `POST /api/ranking`
- `POST /api/compare`
- `POST /api/chat`

## 4. Dados usados na experiência

O produto usa uma base híbrida local:

- `ANEEL SIGA`
- `IBGE`
- sinais curados temporários
- proxy municipal demonstrativo

Resumo funcional por camada:

- `Energia limpa`: oficial/derivada a partir de `ANEEL SIGA`;
- `Infraestrutura`: híbrida;
- `Base industrial`: híbrida;
- `Logística`: curada temporariamente;
- `Socioambiental`: derivada.

Detalhamento completo das bases:

- [bases-de-dados.md](bases-de-dados.md)

Metodologia do IMTE:

- [imte-metodologia-v2.md](imte-metodologia-v2.md)

## 5. Limitações atuais

Ainda não existe:

- cobertura municipal nacional gerada pelo pipeline;
- atualização automática de fontes em runtime;
- banco geoespacial;
- autenticação;
- persistência backend de análises ou conversas;
- metodologia oficial de `IMTE` municipal.

Limitações metodológicas ativas:

- `logística` ainda depende de score curado por `UF`;
- parte de `infraestrutura` ainda depende de sinais curados;
- a leitura socioambiental usa proxies simplificados;
- a camada municipal atual é demonstrativa e limitada ao chunk local disponível.
