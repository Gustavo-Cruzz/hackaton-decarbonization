# IMTE Híbrido v2.1

## Resumo

O `IMTE Híbrido v2.1` é a metodologia atual do `PID MVP` para comparar territórios brasileiros em um contexto de transição energética e descarbonização industrial.

Ele combina:

- dados oficiais;
- sinais derivados;
- uma camada curada temporária;
- proxies demonstrativos no nível municipal.

O foco principal desta metodologia continua sendo o recorte estadual. O recorte municipal atual é exploratório e não oficial.

## Fórmula-base

```txt
IMTE =
30% Energia limpa
25% Infraestrutura
20% Base industrial
15% Logística
10% Socioambiental
```

Os objetivos do produto podem aplicar pesos próprios sobre essas mesmas dimensões para recalcular ranking e leitura territorial.

## Proveniência por dimensão

### Energia limpa

- `modo`: oficial
- `fontes`: `ANEEL SIGA`
- `sinais`: capacidade solar, eólica e biomassa em operação, participação renovável e diversidade de fontes

### Infraestrutura

- `modo`: híbrido
- `fontes`: `ANEEL SIGA` + curadoria interna do MVP
- `sinais`: capacidade total instalada, escala renovável estratégica e complemento curado de infraestrutura por `UF`

### Base industrial

- `modo`: híbrido
- `fontes`: `IBGE` + curadoria interna do MVP
- `sinais`: valor adicionado bruto da indústria, participação industrial e intensidade industrial complementar por `UF`

### Logística

- `modo`: curado
- `fontes`: curadoria interna do MVP
- `sinais`: `logisticaBase`, `portos` e `hubs`

### Socioambiental

- `modo`: derivado
- `fontes`: `IBGE` + `ANEEL SIGA`
- `sinais`: densidade populacional, escala populacional e participação renovável

## Leitura municipal

O recorte municipal atual não é um `IMTE municipal oficial`.

Estado atual:

- usa `scoresProxy` e `IMTE proxy`;
- herda o contexto estrutural do estado;
- aplica ajustes simples por população, densidade e escala econômica;
- serve para navegação geoespacial, storytelling e contexto do chatbot;
- não deve ser tratado como score regulatório ou benchmark municipal oficial.

## Fontes e artefatos relacionados

Fontes e inventário detalhado:

- [bases-de-dados.md](bases-de-dados.md)

Artefatos metodológicos e operacionais centrais:

- `scripts/build-official-dataset.mjs`
- `data/curated/state-signals.json`
- `data/processed/territories-official.json`
- `data/processed/municipalities/BA.json`
- `lib/municipalities.ts`

## Limites metodológicos

- não é uma metodologia regulatória;
- não substitui due diligence técnica;
- ainda não usa cobertura oficial estruturada para toda a camada logística;
- ainda depende de sinais curados em parte da infraestrutura;
- a camada municipal atual é demonstrativa e restrita ao chunk local disponível;
- o produto continua orientado a exploração comparativa e pitch, não a decisão final sem validação complementar.
