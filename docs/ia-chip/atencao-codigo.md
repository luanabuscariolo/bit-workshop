---
id: atencao-codigo
title: "15. Atenção: o código"
sidebar_position: 15
---

### O código da atenção

```python
import torch
import torch.nn.functional as F

# Exemplo: 3 tokens, vetores de tamanho 2 (postos à mão para ver as contas)
Q = torch.tensor([[2.,0.], [0.,2.], [1.,1.]])
K = torch.tensor([[1.,0.], [0.,1.], [1.,1.]])
V = torch.tensor([[10.,0.], [0.,10.], [5.,5.]])
dk = Q.shape[1]

# 1. produto escalar + escala
notas = Q @ K.T / (dk ** 0.5)

# 2. máscara causal (futuro vira -infinito)
n = Q.shape[0]
triangulo = torch.tril(torch.ones(n, n))
notas = notas.masked_fill(triangulo == 0, float("-inf"))

# 3. softmax -> pesos
pesos = F.softmax(notas, dim=-1)

# 4. soma ponderada dos values
saida = pesos @ V
print(saida)
```

Repare que o código é **exatamente** as contas que você acabou de acompanhar, na mesma ordem: o passo 1 (produto escalar + escala) é a linha `notas = Q @ K.T / ...`; o passo 2 (máscara causal) são as linhas do `triangulo`/`masked_fill`; o passo 3 (softmax) é `pesos = F.softmax(...)`; e o passo 4 (soma ponderada) é `saida = pesos @ V`. O código não traz mágica nova — ele implementa a matemática.

**Traduzindo os símbolos estranhos:**

- `@` é multiplicação de matrizes — faz o produto escalar de todos com todos de uma
  vez.
- `.T` (transposta) "vira a matriz de lado" para o `@` alinhar as dimensões.
- `torch.tril` pega o triângulo inferior (o "mapa" do que é permitido).
- `masked_fill(..., -inf)` coloca `-∞` onde o mapa é 0 (o futuro).
- `dim=-1` no softmax aplica a operação **em cada linha separadamente** — por isso
  cada linha soma 1.

**A frase-resumo:**

> "A atenção calcula notas com o produto escalar entre Query e Keys, escala por
> `√dₖ`, aplica máscara causal para só olhar o passado, passa por softmax para
> virar pesos, e faz a soma ponderada dos Values."

---

> **Fim da Instalação 3.** Você atravessou o coração do transformer.
> Na próxima instalação: a **FFN** (onde cada token processa o que reuniu), as duas
> "pecinhas de cola" (**conexão residual** e **LayerNorm**), e a montagem do
> **modelo completo**.

---
