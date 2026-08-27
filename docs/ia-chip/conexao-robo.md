---
id: conexao-robo
title: "5. Como se conecta ao robô"
sidebar_position: 5
---

Agora juntamos as duas metades do projeto:

- O **corpo** (Curso 1 — Robô Autônomo) percebe o mundo: anda, detecta obstáculos, fica preso.
- O **cérebro** (a LLM, este curso) recebe a situação atual e **gera uma frase** com
  personalidade.

A ponte entre os dois são os **marcadores** — etiquetas curtas que resumem a situação:
`<obstacle>` (bateu em algo), `<stuck>` (ficou preso), `<clear>` (o caminho abriu). O corpo
manda o marcador; o cérebro completa com uma reclamação sarcástica.

![A ponte: situação → marcador → cérebro → frase](/img/parte-2_fig06_a_ponte_situacao_marcador_cerebro_frase.png)

```text
corpo:    "<obstacle>"
cérebro:  "<obstacle> Oh look, a wall. Groundbreaking. Turning."
```

Repare que isso é **exatamente** a previsão do próximo pedacinho que vimos na a página sobre prever o próximo —
só que o "começo" é um marcador de situação, e a LLM completa com a frase, um caractere por
vez.

---
