---
id: prever-proximo
title: "2. A única coisa que uma LLM faz"
sidebar_position: 2
---

Aqui está o segredo que desmistifica tudo. Uma LLM, por mais impressionante que pareça,
faz **uma única coisa**:

> **Ela prevê o próximo pedacinho de texto.**

Você dá um começo, e ela adivinha o que vem a seguir:

![Prever o próximo pedacinho](/img/parte-2_fig02_prever_o_proximo_pedacinho.png)

Como ela faz isso? Para cada próximo pedacinho possível, o modelo dá uma **nota** — quão
provável é que aquele venha agora. Veja com uma frase do mundo do nosso robô:

![O que vem a seguir? O modelo dá uma nota a cada candidato](/img/parte-2_fig03_o_que_vem_a_seguir_o_modelo_da_uma_nota_a_cad.png)

Depois de "The wall is", o modelo acha um espaço em branco muito provável, um ponto final
possível, e a letra "z" quase impossível. Ele então **sorteia entre os mais prováveis**,
junta o escolhido ao texto, e recomeça a pergunta — agora com um caractere a mais. Um
pedacinho de cada vez, é assim que frases inteiras nascem.

> **Por que "sortear" e não pegar sempre o mais provável?** Se pegasse sempre o campeão,
> o robô diria exatamente a mesma frase toda vez. O sorteio dá **variedade** — a
> personalidade do robô. Você vai controlar isso neste curso com dois ajustes chamados
> *temperatura* e *top-k*.

> **Uma comparação do dia a dia:** é como o **corretor do seu celular** sugerindo a
> próxima palavra enquanto você digita. A LLM é uma versão muito mais poderosa da mesma
> ideia — prever o que vem a seguir.

---
