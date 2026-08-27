---
id: como-aprende
title: "3. Como ela aprende"
sidebar_position: 3
---

A LLM não nasce sabendo prever. Ela **aprende** num processo chamado **treino**, que
funciona por tentativa e erro — parecido com um humano treinando um esporte. O treino tem
sempre as mesmas quatro etapas, girando em círculo:

![O ciclo de treino: prever, comparar, ajustar, repetir](/img/parte-2_fig04_o_ciclo_de_treino_prever_comparar_ajustar_rep.png)

1. **Vê um exemplo** de texto real (com a resposta certa escondida).
2. **Tenta prever** o pedacinho que falta — no começo, chuta quase aleatoriamente.
3. **Compara** o chute com a resposta certa e mede o quanto errou. Esse "tamanho do erro"
   tem um nome: **loss**.
4. **Ajusta** seus botões internos (os **parâmetros**) um tiquinho, na direção que
   diminui o erro. E volta ao passo 1.

No começo ela erra quase tudo. Cada volta deixa os chutes um pouco melhores. Repetindo
isso **milhões de vezes** com muitos textos, os chutes vão ficando tão bons que ela prevê
com naturalidade.

No fim do treino, o "conhecimento" da LLM fica guardado nesses **parâmetros** ajustados.
Cada parâmetro é como um botãozinho que o treino girou até a posição certa. Quanto mais
botões, mais capaz (e mais pesado) o modelo.

> Você vai fazer **exatamente** esse ciclo neste curso: mostrar exemplos ao modelo, ver o
> número do erro (o loss) diminuir a cada passo, e no fim ter um modelo que prevê texto no
> estilo sarcástico do seu robô.

---
