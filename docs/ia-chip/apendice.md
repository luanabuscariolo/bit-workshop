---
id: apendice
title: "Apêndice"
sidebar_position: 21
---

Material de consulta rápida deste curso.

## A. Glossário

**Atenção (self-attention)** — O mecanismo do modelo que faz cada pedacinho de texto
"olhar" para os outros e decidir em quais prestar atenção. É o coração do transformer.

**AdamW (otimizador)** — O "treinador" que decide o tamanho e a direção de cada
ajuste nos parâmetros a cada passo do treino, a partir dos gradientes.

**Autorregressivo** — A forma como o modelo gera texto: prevê um pedacinho, anexa ao
que já tem, e usa o resultado para prever o próximo. Um caractere puxa o seguinte.

**Backpropagation** — O cálculo automático de como cada parâmetro deve mudar para
diminuir o erro durante o treino. No PyTorch, é a linha `loss.backward()`.

**Bias** — Um número extra somado numa camada, que dá mais flexibilidade ao ajuste.

**block_size** — O tamanho da "janela de contexto": quantos pedacinhos de texto o
modelo consegue olhar de uma vez.

**Cache KV** — Uma memória que guarda as *keys* e *values* das posições já
processadas, para o modelo não recalcular tudo a cada novo caractere.

**Checkpoint** — Salvar o modelo no melhor momento do treino (quando o erro de
validação está mais baixo), não apenas no final. Protege contra o overfitting.

**Caractere (character)** — No nosso projeto, o "pedacinho" de texto que o modelo
processa. Trabalhamos com um modelo de nível de caractere (uma letra por vez).

**Cross-entropy** — A fórmula que mede o "erro" do modelo: o quanto ele se surpreendeu
com a resposta certa. Erro alto = surpresa grande.

**CUDA** — A tecnologia que permite usar a placa de vídeo (GPU) para acelerar o treino.

**Embedding** — A transformação de um pedacinho de texto (um número) num conjunto de
números (um vetor) que captura características dele.

**FFN (rede feed-forward)** — A parte do bloco onde cada pedacinho de texto é
processado sozinho, depois de reunir contexto na atenção.

**float32** — Um formato de número com 32 bits (4 bytes). O formato "universal" em que
exportamos os pesos.

**Forward pass** — A passagem dos dados pelo modelo, da entrada até a saída (os
logits). É o "pensar" do modelo.

**Gradiente** — A indicação, para cada parâmetro, de qual direção diminui o erro.
O treino "desce a ladeira" seguindo o gradiente ao contrário.

**Hiperparâmetros** — As escolhas de configuração do modelo (n_embd, n_layer, etc.),
definidas por você, não aprendidas no treino.

**Inferência** — Usar o modelo já treinado para gerar texto. O contrário de treinar.

**LayerNorm** — Uma operação que reequilibra os números do vetor para uma escala
padrão, estabilizando o treino.

**Logits** — As "notas cruas" que o modelo dá para cada caractere possível, antes de
virarem probabilidades.

**LLM (Large Language Model)** — Um modelo que aprendeu padrões de texto observando
exemplos. O nosso é uma versão minúscula.

**Marcador** — Uma etiqueta curta de situação (`<obstacle>`, `<stuck>`, etc.) que o
corpo envia ao cérebro.

**Máscara causal** — A regra que impede cada pedacinho de "ver o futuro": ele só olha
para o que veio antes.

**Matmul (multiplicação de matrizes)** — A operação matemática central das camadas
lineares.

**Modelo** — O programa que aprende padrões a partir de exemplos.

**n_embd** — O tamanho do vetor de cada pedacinho de texto (a dimensão do embedding).

**n_head** — O número de "cabeças" de atenção que olham o texto em paralelo.

**n_layer** — O número de blocos empilhados no modelo (sua profundidade).

**Overfitting (sobreajuste)** — Quando o modelo decora os exemplos de treino em vez
de aprender o padrão geral, e passa a ir mal em texto novo. Detecta-se separando uma
parte dos dados para validação.

**Parâmetros** — Os números ajustáveis que guardam o "conhecimento" do modelo.

**PyTorch** — A biblioteca Python usada para construir e treinar o modelo.

**ReLU** — A "função de ativação" da FFN: mantém os positivos e zera os negativos.

**Residual (conexão residual)** — O "atalho" que soma a entrada de volta à saída de
cada sub-camada, ajudando o treino.

**Softmax** — A operação que transforma notas em probabilidades que somam 100%.

**Temperatura** — Um ajuste na geração: baixa = respostas mais "seguras"; alta = mais
ousadas e variadas.

**Token** — Um pedacinho de texto. No nosso caso, um caractere.

**Tokenizer** — O tradutor entre texto e números (e vice-versa).

**Top-k** — Uma regra de geração que só considera os `k` caracteres mais prováveis no
sorteio.

**Treino** — O processo de ajustar os parâmetros do modelo mostrando exemplos.

**uv** — O gerenciador de pacotes Python usado no projeto.

**Validação (split treino/validação)** — Separar uma fração dos dados para medir se
o modelo generaliza, em vez de só decorar. Se o erro de treino cai mas o de validação
não, é sinal de overfitting.

**Vetor** — Uma lista de números. Um embedding é um vetor.

**Vocabulário** — A lista de todos os pedacinhos (caracteres) que o modelo conhece.

## B. Solução de problemas


| Sintoma | Provável causa | Solução |
|---|---|---|
| `torch.cuda.is_available()` dá False | Torch instalado sem CUDA | Configure o índice CUDA no `pyproject.toml` e rode `uv sync` |
| Mudanças com `uv pip install` somem | `uv run` re-sincroniza pelo lockfile | Declare tudo no `pyproject.toml`, não instale "por fora" |
| Erro cai muito devagar | Taxa de aprendizado baixa, ou modelo pequeno | Confirme lr=1e-3; para qualidade, aumente o dataset |
| Frases geradas muito repetitivas | Top-k baixo ou temperatura baixa | Aumente levemente (ex.: top_k=4, temperatura=0.75) |
| Palavras "tortas" na geração | Modelo pequeno / dataset pequeno | Normal; melhora com mais dados e mais treino |
| Falta de espaço em disco no `.venv` | Cache do PyTorch é grande | Apague `.venv`; o `uv sync` reinstala do cache |

## C. Ficha técnica do modelo


O modelo "nano-grump" na versão embarcada (Curso 3 — RoverMind):

| Item | Valor |
|---|---|
| Tipo | Transformer decoder-only, nível de caractere |
| Vocabulário | 59 caracteres |
| Dimensão do embedding (n_embd) | 64 |
| Janela de contexto (block_size) | 128 |
| Número de blocos (n_layer) | 4 |
| Cabeças de atenção (n_head) | 4 |
| Parâmetros | ~215 mil |
| Tamanho exportado (.bin) | ~840 KB (float32) |
| Geração | top-k = 4, temperatura = 0.75 |
| Marcadores | `<start>`, `<explore>`, `<obstacle>`, `<turn_left>`, `<turn_right>`, `<backup>`, `<stuck>`, `<clear>` |

> **Duas versões, mesma arquitetura.** Este curso usa uma versão *didática* ainda
> menor (~42 mil parâmetros: `n_embd=32`, `block_size=32`, `n_layer=3`, 1 cabeça),
> pensada para você acompanhar cada conta à mão. A versão *embarcada* acima é um
> pouco maior para falar melhor rodando sozinha no chip. O passo a passo é idêntico;
> só mudam os números da configuração.

---

## D. Para onde ir depois

- **Curso 3 — RoverMind:** coloque este modelo para rodar dentro do chip.
- **Experimente o dataset:** troque as frases, mude a personalidade, veja o efeito.
- **Mexa nos hiperparâmetros:** aumente `n_embd`, `n_layer` ou `block_size` e observe o
  efeito no tamanho do modelo e na qualidade do texto.
