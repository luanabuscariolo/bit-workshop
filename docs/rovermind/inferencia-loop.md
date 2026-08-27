---
id: inferencia-loop
title: "4. Inferência em C: a memória"
sidebar_position: 4
---

Aqui o modelo ganha vida no chip. A boa notícia: **a matemática é idêntica** à que
você aprendeu no Curso 2 — IA num Chip. O que muda é o idioma — em vez de o PyTorch cuidar de tudo,
você diz explicitamente onde cada número está na memória.

### Os três tipos de memória do ESP32-S3

Pense em três mesas de trabalho de tamanhos diferentes:

- **Flash** (16 MB) — mesa gigante, mas **só leitura**. Aqui ficam os pesos (~840 KB).
- **PSRAM** (8 MB) — mesa grande, leitura e escrita. Aqui fica o "cache" da sequência.
- **SRAM** (512 KB) — mesa pequena e rápida. Aqui ficam os vetores de cálculo.

Os pesos nunca mudam → ficam na flash (lidos direto, sem copiar). Os cálculos mudam a
cada caractere → ficam na SRAM/PSRAM.

### As funções matemáticas (as mesmas peças, em C)

Cada operação do Curso 2 — IA num Chip vira uma função em C:

```cpp
// matmul: multiplica matriz por vetor — é o que o Linear() do PyTorch faz
static void matmul(float *out, const float *x,
                   const float *A, int linhas, int colunas) {
  for (int i = 0; i < linhas; i++) {
    float acc = 0.0f;
    for (int j = 0; j < colunas; j++)
      acc += A[i * colunas + j] * x[j];
    out[i] = acc;
  }
}

// softmax: converte notas em probabilidades que somam 1 (demo da atenção)
static void softmax(float *x, int n) {
  float mx = x[0];
  for (int i = 1; i < n; i++) if (x[i] > mx) mx = x[i];
  float soma = 0.0f;
  for (int i = 0; i < n; i++) { x[i] = expf(x[i] - mx); soma += x[i]; }
  for (int i = 0; i < n; i++) x[i] /= soma;
}

// relu: zera os negativos (a ativação da FFN)
static void relu(float *x, int n) {
  for (int i = 0; i < n; i++) if (x[i] < 0.0f) x[i] = 0.0f;
}
```
