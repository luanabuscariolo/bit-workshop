---
id: inferencia-codigo
title: "5. Inferência em C: o código"
sidebar_position: 5
---

### O forward pass em C (a tradução direta do model.py)

O coração da inferência é o mesmo fluxo do Curso 2 — IA num Chip: embedding → blocos (atenção + FFN
com residual) → LayerNorm final → camada de saída. Cada token entra, e sai uma lista
de notas (logits) para os 59 caracteres.

```cpp
static void forward(int token, int pos) {
  // 1. EMBEDDING (caractere + posição) — Curso 2 — IA num Chip, seções 3.5–3.6
  const float *te = w.emb_token + token * N_EMBD;
  const float *pe = w.emb_pos   + pos   * N_EMBD;
  for (int i = 0; i < N_EMBD; i++) x[i] = te[i] + pe[i];

  // 2. BLOCOS (atenção multi-cabeça + FFN, com residual) — Curso 2 — IA num Chip, 3.7–3.11
  for (int l = 0; l < N_LAYER; l++) {
    // ... LayerNorm -> Q,K,V -> atenção por cabeça -> soma ponderada
    // ... + residual -> LayerNorm -> FFN (expandir, ReLU, contrair) -> residual
    // (a mesma sequência do bloco que você montou no Curso 2 — IA num Chip
  }

  // 3. LAYERNORM FINAL + CAMADA DE SAÍDA -> logits (59 notas)
  layernorm(xb, x, w.ln_final_w, w.ln_final_b, N_EMBD);
  matmul(logits, xb, w.saida_w, VOCAB_SIZE, N_EMBD);
}
```

> **Cuidado com o LayerNorm (lição aprendida na prática).** É tentador simplificar o
> LayerNorm por um primo mais simples chamado RMSNorm no firmware — mas o modelo foi
> **treinado com LayerNorm completo** (com média e bias). Usar RMSNorm no chip faz as
> contas divergirem do treino e o robô gera "palavras tortas". Use o mesmo LayerNorm
> dos dois lados: subtrai a média, divide pelo desvio, aplica peso e bias.
>
> O firmware completo (com a atenção multi-cabeça detalhada, o cache KV que guarda as
> keys e values das posições anteriores, e o mapeamento dos ponteiros para a flash)
> é longo. O ponto para você levar: **cada função é uma peça que você já entende da
> Curso 2 — IA num Chip, reescrita em C**. A atenção usa `matmul` + `softmax`, a FFN usa `matmul` +
> `relu`, e o cache KV é a forma prática de implementar a máscara causal (cada token
> só olha as posições já calculadas).

### A geração (top-k + temperatura, como no generate.py)

O loop de geração é o mesmo ciclo autorregressivo do Curso 2 — IA num Chip: prevê → sorteia →
anexa → repete. No chip, aplicamos temperatura e top-k antes do sorteio:

```cpp
// Aplicar temperatura, manter só os TOP_K maiores logits, softmax, sortear
for (int v = 0; v < VOCAB_SIZE; v++) logits[v] /= TEMPERATURA;
// ... (zera todos menos os K maiores) ...
softmax(logits, VOCAB_SIZE);
int next_token = amostrar(logits, VOCAB_SIZE);   // sorteio ponderado
if (next_token == TOKEN_NEWLINE) break;          // fim da frase
```

Os parâmetros ficam no topo do firmware, fáceis de ajustar:
`TEMPERATURA = 0.75`, `TOP_K = 4` (os mesmos valores escolhidos no PC).

### O vocabulário no firmware

O firmware precisa de uma cópia do vocabulário (os 59 caracteres) na mesma ordem do
`vocab.json`, para traduzir números de volta em letras:

```cpp
const char VOCAB[59] = {
  '\n',' ','\'',',','-','.',':','<','>','?',
  'A','B','C','D','E','F','G','H','I','J',
  'L','M','N','O','P','R','S','T','U','V',
  'W','Y','_','a','b','c','d','e','f','g',
  'h','i','j','k','l','m','n','o','p','q',
  'r','s','t','u','v','w','x','y','z'
};
```

---
