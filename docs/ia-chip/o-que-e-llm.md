---
id: o-que-e-llm
title: "1. O que significa LLM"
sidebar_position: 1
---

**LLM** vem do inglês *Large Language Model* — em português, "Grande Modelo de
Linguagem". Em vez de decorar a sigla, vamos entender cada palavra pelo que ela faz:

- **Modelo** — um programa que **aprende padrões a partir de exemplos**, em vez de
  seguir regras que alguém escreveu à mão. Pense num aprendiz de cozinha que prova
  centenas de pratos e vai pegando o jeito, em vez de decorar um livro de receitas. Ele
  não sabe explicar a regra; ele **sente** o padrão.
- **Linguagem** — o que esse aprendiz observa é **texto**: como as letras e as palavras
  se seguem umas às outras. Depois de ver muito texto, ele percebe que depois de "bom
  dia" costuma vir uma vírgula, que "chuva" e "guarda-chuva" andam juntas, e assim por
  diante.
- **Grande (Large)** — normalmente esses modelos são enormes, com bilhões de padrões
  guardados. O nosso vai ser **pequeno de propósito**, para caber num robô. A ideia é
  idêntica; muda só o tamanho.

Juntando: uma LLM é **um programa que aprendeu padrões de texto observando muitos
exemplos**. O ChatGPT é uma LLM gigante. O cérebro do nosso robô será uma LLM minúscula.
Mesma família, tamanhos diferentes.

### Uma coisa importante antes de seguir: o modelo só entende números

Computadores não manipulam letras — manipulam números. Então, para uma LLM trabalhar
com texto, acontece uma tradução nas duas pontas: o texto vira números na entrada, e os
números viram texto de volta na saída.

![Do texto aos números e de volta ao texto](/img/parte-2_fig01_do_texto_aos_numeros_e_de_volta_ao_texto.png)

Guarde esta imagem: essa tradução "letra ↔ número" tem um nome — **tokenizer** — e será
a **primeira peça** que você vai construir neste curso. Tudo o mais que a LLM faz acontece
no mundo dos números, no meio desse caminho.

---
