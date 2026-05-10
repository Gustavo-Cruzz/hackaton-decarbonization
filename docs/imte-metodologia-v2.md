# IMTE Híbrido v2.1

## Resumo

O `IMTE Híbrido v2.1` é a metodologia atual do PID MVP para comparar estados brasileiros em um contexto de transição energética e descarbonização industrial.

Ele combina dados oficiais, sinais derivados e uma camada curada temporária para dimensões ainda não cobertas por fontes públicas integradas no pipeline.

## Fórmula-base

```txt
IMTE =
30% Energia limpa
25% Infraestrutura
20% Base industrial
15% Logística
10% Socioambiental
```

Os objetivos do produto podem aplicar pesos próprios em cima dessas mesmas dimensões.

## Proveniência por dimensão

### Energia limpa

- `modo`: oficial
- `fontes`: `ANEEL SIGA`
- `sinais`: capacidade solar, eólica e biomassa em operação, participação renovável e diversidade de fontes

### Infraestrutura

- `modo`: híbrido
- `fontes`: `ANEEL SIGA` + curadoria interna
- `sinais`: capacidade total instalada, escala renovável estratégica e `infraestruturaBase` por `UF`

### Base industrial

- `modo`: híbrido
- `fontes`: `IBGE` + curadoria interna
- `sinais`: valor adicionado bruto da indústria, participação industrial e intensidade industrial complementar por `UF`

### Logística

- `modo`: curado
- `fontes`: curadoria interna do MVP
- `sinais`: `logisticaBase`, `portos` e `hubs`

### Socioambiental

- `modo`: derivado
- `fontes`: `IBGE` + `ANEEL SIGA`
- `sinais`: densidade populacional, escala populacional e participação renovável

## Fontes atuais

- `ANEEL SIGA`: snapshot local versionado do conjunto de empreendimentos de geração
- `IBGE Localidades`: estados e regiões
- `IBGE Malhas v3`: geometria oficial simplificada por `UF`
- `IBGE SIDRA`: população e indicadores econômicos estaduais
- `Curadoria interna`: sinais temporários de logística e parte da infraestrutura

## Limites metodológicos

- não é uma metodologia regulatória;
- não substitui due diligence técnica;
- ainda não usa séries temporais completas;
- ainda não cobre infraestrutura logística por fonte oficial estruturada;
- ainda não desce para município ou ativo georreferenciado.

## Artefatos relacionados

- `scripts/build-official-dataset.mjs`
- `data/curated/state-signals.json`
- `data/processed/territories-official.json`
