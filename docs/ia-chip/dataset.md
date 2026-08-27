---
id: dataset
title: "9. O dataset: personalidade"
sidebar_position: 9
---

Um modelo aprende a partir de **exemplos**. O conjunto de exemplos chama-se
**dataset** (base de dados). Se você mostrar a ele milhares de receitas, ele
aprende a escrever receitas. Se mostrar frases sarcásticas de robô, ele aprende
a ser um robô sarcástico.

Então o dataset é onde **a personalidade nasce**. Vamos dar ao nosso robô um
humor sarcástico, preguiçoso e engraçado — e ele vai "falar" em inglês (uma
escolha técnica: em inglês as palavras se quebram em menos pedaços, o que facilita
para um modelo minúsculo).

### As situações do robô (os marcadores)

O robô percebe um punhado de situações com seus sensores. Para cada uma, damos um
**marcador** — uma etiqueta entre `< >`:

| Marcador | Situação |
|---|---|
| `<start>` | acabou de ligar |
| `<explore>` | andando livre, sem obstáculo |
| `<obstacle>` | detectou algo à frente |
| `<turn_left>` | virou à esquerda |
| `<turn_right>` | virou à direita |
| `<backup>` | recuando |
| `<stuck>` | preso, bateu no mesmo canto |
| `<clear>` | o caminho abriu de novo |

### O formato do dataset

Cada linha do dataset é um par **marcador + frase**, assim:

```text
<obstacle> Oh look, a wall. Groundbreaking discovery. Turning.
<obstacle> Great. Something to avoid. As if I wanted to move anyway.
<explore> Rolling along. Look at me, doing the bare minimum.
<stuck> Oh wonderful, I'm stuck. This is fine. Everything's fine.
```

Damos **muitas frases diferentes para o mesmo marcador** (umas 11 a 12 de cada).
Por quê? Para o robô não virar um papagaio que repete sempre a mesma coisa. Com
variedade, cada situação pode gerar uma reclamação diferente — e aí ele parece
vivo.

> **Faça você mesmo.** Crie um arquivo de texto chamado `robot_voice.txt` dentro
> da pasta `data`, e escreva suas frases, uma por linha, no formato acima. Capriche
> no sarcasmo! Quanto mais frases (e mais variadas), melhor o robô vai falar. Um
> bom ponto de partida são ~90 frases; mais para a frente veremos como expandir.

---
