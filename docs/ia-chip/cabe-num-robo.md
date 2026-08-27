---
id: cabe-num-robo
title: "4. Por que cabe num robô"
sidebar_position: 4
---

Aqui vem a pergunta natural: se o ChatGPT precisa de computadores gigantes, como um modelo
desses cabe num chip de poucos dólares?

A resposta está no **tamanho**. Os modelos variam enormemente na quantidade de parâmetros
(aqueles "botõezinhos"):

![Comparação de tamanho entre modelos](/img/parte-2_fig05_comparacao_de_tamanho_entre_modelos.png)

Uma LLM de nuvem tem **centenas de bilhões** de parâmetros — por isso precisa de data
centers. O cérebro do nosso robô vai ter só **~215 mil**. É milhões de vezes menor.

E menos parâmetros tem uma consequência direta e prática, que é justamente o que permite o
embarque:

> **menos parâmetros → menos números para guardar → arquivo pequeno → cabe na memória do
> chip.** O modelo do robô ocupa menos de 1 MB. Um modelo de nuvem ocupa centenas de
> gigabytes.

**O truque** é entender que um modelo pequeno não sabe conversar sobre qualquer assunto —
mas ele **não precisa**. O nosso robô só precisa saber uma coisa: gerar frases sarcásticas
curtas para umas poucas situações. Para essa tarefa limitada, um modelo minúsculo basta.

> **A lição de engenharia:** você não precisa de um modelo gigante para um problema
> pequeno. Escolher o tamanho certo para a tarefa é uma decisão inteligente, não uma
> limitação. Um caminhão não é "melhor" que uma bicicleta para ir à padaria da esquina.

---
