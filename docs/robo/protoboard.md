---
id: protoboard
title: "7. Como entender a protoboard"
sidebar_position: 7
---

Se você nunca usou uma protoboard, ela parece um tabuleiro de furos sem sentido. Mas por
baixo ela tem uma lógica simples de conexões — e entender essa lógica **antes** de montar
evita quase todos os erros de ligação.

![Como a protoboard funciona](/img/parte-1_fig05_como_a_protoboard_funciona.png)

**Três regras que explicam tudo:**

1. Os **trilhos** de cima e de baixo (as linhas marcadas `+` e `−`) são ligados na
   **horizontal**: a linha inteira é um único ponto elétrico. É aqui que colocamos a
   energia (VCC) e o terra (GND) para distribuir a todos os componentes.
2. As **colunas** do meio são ligadas na **vertical**, em grupos de 5 furos. Cada
   coluninha de 5 furos é um "nó" — tudo que você espeta ali fica conectado entre si.
3. O **sulco central** (o corte no meio) separa a metade de cima da de baixo. Um furo de
   cima **não** se conecta ao de baixo, mesmo alinhados.

> **Teste seu entendimento.** Se você espeta dois fios na **mesma coluna de 5 furos**,
> eles estão conectados? **Sim.** E se você espeta um fio no trilho `+` de cima e outro no
> trilho `+` de baixo, sem nenhum fio ligando os dois? **Não** — os dois trilhos de cima e
> de baixo são independentes até você uni-los com um fio.

**Na prática:** ligamos um fio do `5V`/`3V3` do ESP32 no trilho `+` e um fio do `GND` no
trilho `−`. A partir daí, cada componente pega energia e terra do trilho mais próximo, sem
precisar amontoar vários fios num único pino do ESP32.

---
