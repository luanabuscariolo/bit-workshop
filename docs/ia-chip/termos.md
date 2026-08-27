---
id: termos
title: "6. Termos que você vai encontrar"
sidebar_position: 6
---

Para você não se assustar com o vocabulário neste curso, aqui vão os principais, em
linguagem simples. **Não precisa decorar nada agora** — todos serão explicados a fundo, com
analogia, exemplo e diagrama, quando aparecerem.

| Termo | O que significa, em uma frase | Onde você já viu nesta parte |
|---|---|---|
| **Token** | Um pedacinho de texto. No nosso caso, um caractere. | o "pedacinho" da a página sobre prever o próximo |
| **Vocabulário** | A lista de todos os pedacinhos que o modelo conhece. | — |
| **Tokenizer** | A tradução letra ↔ número. | a imagem da a página sobre o que é uma LLM |
| **Parâmetros** | Os números ajustáveis que guardam o "conhecimento". | os "botõezinhos" da a página sobre como ela aprende |
| **Treino** | O ciclo de ajustar os parâmetros mostrando exemplos. | a a página sobre como ela aprende |
| **Loss (erro)** | O quanto o modelo errou numa previsão. | o passo 3 do ciclo de treino |
| **Embedding** | Transformar um pedacinho de texto num conjunto de números. | — |
| **Atenção** | O mecanismo que faz cada pedacinho "olhar" para os outros. | — |
| **Inferência** | Usar o modelo já treinado para gerar texto (o contrário de treinar). | — |

---

## Encerramento deste curso

Agora você entende a grande ideia por trás das IAs de linguagem:

- ✅ Uma **LLM** é um programa que aprendeu padrões de texto observando exemplos
- ✅ Por dentro, ela só trabalha com **números** — o tokenizer traduz nas duas pontas
- ✅ A única coisa que ela faz é **prever o próximo pedacinho** — repetido, vira frases
- ✅ Ela **aprende** por tentativa e erro, ajustando parâmetros e diminuindo o erro (loss)
- ✅ Modelos pequenos servem para tarefas pequenas — por isso cabem num robô
- ✅ No nosso projeto, o corpo manda o marcador da situação e o cérebro completa a frase

Você desmistificou a parte mais "assustadora" do projeto sem escrever uma linha de código.
Na **este curso**, vamos transformar cada uma dessas ideias em realidade — construindo, peça
por peça, o cérebro do robô, do tokenizer até a geração da frase.
