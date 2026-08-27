---
id: residual-layernorm
title: "17. Residual e LayerNorm"
sidebar_position: 17
---

Para um modelo de vários blocos treinar bem, precisamos de duas peças de apoio.

**Conexão residual.** Em vez de o bloco *substituir* o vetor do token, ele *soma* o
que aprendeu ao vetor original: `saída = x + f(x)`. Isso cria um atalho que preserva
a informação ao longo dos blocos e ajuda o treino. O bloco aprende só o "ajuste".

![Conexão residual](/img/parte-3_fig12_conexao_residual.png)

**LayerNorm.** Ajeita os números de cada vetor para uma escala padrão (subtrai a
média, divide pelo desvio padrão). Assim os valores não explodem nem somem ao passar
pela rede — o treino fica estável.

![LayerNorm](/img/parte-3_fig13_layernorm.png)
