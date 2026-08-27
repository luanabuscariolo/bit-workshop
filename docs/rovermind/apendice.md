---
id: apendice
title: "Apêndice"
sidebar_position: 8
---

Material de consulta rápida deste curso.

## A. Glossário do embarque

**Cabeçalho (header)** — A "etiqueta" no começo do arquivo `.bin`, com as dimensões do
modelo, que o firmware lê antes dos pesos.

**Firmware** — O programa em C que roda dentro do microcontrolador.

**mmap** — Mapear um arquivo (ou partição) na memória, para lê-lo como se fosse um
array, sem copiar.

**Partição** — Uma região da flash com um propósito específico (firmware, dados, etc.),
definida no `partitions.csv`.

**UART / Serial** — A forma de comunicação por dois fios (TX e RX) entre placas, ou
entre placa e computador.

### Termos de IA que reaparecem no firmware

**block_size** — O tamanho da "janela de contexto": quantos pedacinhos de texto o
modelo consegue olhar de uma vez.

**Cache KV** — Uma memória que guarda as *keys* e *values* das posições já
processadas, para o modelo não recalcular tudo a cada novo caractere.

**float32** — Um formato de número com 32 bits (4 bytes). O formato "universal" em que
exportamos os pesos.

**Forward pass** — A passagem dos dados pelo modelo, da entrada até a saída (os
logits). É o "pensar" do modelo.

**Inferência** — Usar o modelo já treinado para gerar texto. O contrário de treinar.

**LayerNorm** — Uma operação que reequilibra os números do vetor para uma escala
padrão, estabilizando o treino.

**Logits** — As "notas cruas" que o modelo dá para cada caractere possível, antes de
virarem probabilidades.

**Marcador** — Uma etiqueta curta de situação (`<obstacle>`, `<stuck>`, etc.) que o
corpo envia ao cérebro.

**Máscara causal** — A regra que impede cada pedacinho de "ver o futuro": ele só olha
para o que veio antes.

**Matmul (multiplicação de matrizes)** — A operação matemática central das camadas
lineares.

**n_embd** — O tamanho do vetor de cada pedacinho de texto (a dimensão do embedding).

**Softmax** — A operação que transforma notas em probabilidades que somam 100%.

**Temperatura** — Um ajuste na geração: baixa = respostas mais "seguras"; alta = mais
ousadas e variadas.

**Token** — Um pedacinho de texto. No nosso caso, um caractere.

**Tokenizer** — O tradutor entre texto e números (e vice-versa).

**Top-k** — Uma regra de geração que só considera os `k` caracteres mais prováveis no
sorteio.

**Vocabulário** — A lista de todos os pedacinhos (caracteres) que o modelo conhece.

## B. Solução de problemas


| Sintoma | Provável causa | Solução |
|---|---|---|
| Partição "model" não encontrada | Partition Scheme não é Custom | `Ferramentas → Partition Scheme → Custom` |
| Opção "Custom" não aparece | `partitions.csv` fora da pasta do sketch | Coloque-o na mesma pasta do `.ino`, de mesmo nome |
| Firmware grava em 0x10000, não 0x110000 | Isso é normal | Firmware vai sempre em 0x10000; os pesos em 0x110000 |
| Cabeçalho lê valores errados | Ordem dos pesos divergente | Confirme a mesma ordem no `export.py` e no firmware |
| PSRAM não detectada | PSRAM não configurada | `Ferramentas → PSRAM → OPI PSRAM` |
| Display não acende | Pinos SPI errados | Confira CLK=12, MOSI=11, CS=8, DC=9, RES=10 |
| Interferência ao gravar firmware | Fio de UART conectado | Desconecte o fio de dados UART antes de gravar |

---

## C. Ficha técnica do modelo embarcado


O modelo "nano-grump" na versão embarcada (este curso):

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

> **Duas versões, mesma arquitetura.** A Curso 2 — IA num Chip usa uma versão *didática* ainda
> menor (~42 mil parâmetros: `n_embd=32`, `block_size=32`, `n_layer=3`, 1 cabeça),
> pensada para você acompanhar cada conta à mão. A versão *embarcada* acima é um
> pouco maior para falar melhor rodando sozinha no chip. O passo a passo é idêntico;
> só mudam os números da configuração.

---

## D. Mapa de pinos


**Robô (ESP32-WROOM-32):**

| Componente | Pino |
|---|---|
| HC-SR04 TRIG | GPIO32 |
| HC-SR04 ECHO | GPIO33 |
| Servo SG90 | GPIO13 |
| L298N ENA / IN1 / IN2 | GPIO23 / 22 / 21 |
| L298N IN3 / IN4 / ENB | GPIO19 / 18 / 5 |

**Display OLED (ESP32-S3, SH1106 SPI):**

| Sinal | Pino |
|---|---|
| CLK | GPIO12 |
| MOSI | GPIO11 |
| CS | GPIO8 |
| DC | GPIO9 |
| RES | GPIO10 |

**Comunicação entre as placas:** TX do WROOM-32 → RX do S3, com os GNDs unidos.

---

## E. Para onde ir depois


O robô está pronto — e agora? Alguns caminhos para continuar aprendendo e evoluindo o
projeto:

**Melhorar o cérebro:**
- Ampliar o dataset com mais frases e mais variadas (a maior alavanca de qualidade).
- Refinar os marcadores mais fracos, dando mais exemplos de qualidade a eles.
- Treinar por mais passos e comparar as perdas (loss) de treino e validação.

**Melhorar o corpo:**
- Adicionar mais sensores (por exemplo, sensores laterais para não raspar em paredes).
- Melhorar a lógica de exploração e o desvio de obstáculos.
- Ajustar o "debounce" dos marcadores, para o cérebro não ser inundado de situações.

**Aprofundar o conhecimento:**
- Estudar o `llama2.c` do Andrej Karpathy — a referência enxuta de inferência em C.
- Ler sobre quantização (reduzir a precisão dos pesos para caber e acelerar).
- Explorar modelos de nível de palavra ou de sub-palavra (BPE), além do de caractere.

**Compartilhar:**
- Publique seu projeto (código e este tutorial) num repositório público.
- Documente suas próprias descobertas e adaptações — ensinar é a melhor forma de
  consolidar o que se aprendeu.

---
