---
title: "Parte 2 — O que é uma LLM"
sidebar_position: 2
---

# Parte 2 — A Grande Ideia: o que é uma LLM

> **Onde estamos na jornada.** Você já montou o corpo do robô (Parte 1). Antes de
> construir o cérebro dele (Parte 3), vamos entender — sem nenhum jargão — o que é uma
> "IA de linguagem", como ela funciona por dentro e por que uma versão minúscula dela
> pode morar num robozinho. **Nenhum código aqui: só ideias.** Esta é a ponte que liga
> o corpo que anda ao cérebro que fala.

"Inteligência Artificial" virou uma palavra assustadora. Parece coisa de gênio, de
ficção científica, de algo que ninguém comum entende. A boa notícia desta parte é que,
por baixo do capô, a ideia central é **simples e elegante** — e você vai entendê-la em
poucos minutos.

---

## 2.1 O que significa "LLM"

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
a **primeira peça** que você vai construir na Parte 3. Tudo o mais que a LLM faz acontece
no mundo dos números, no meio desse caminho.

---

## 2.2 A única coisa que uma LLM faz

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
> personalidade do robô. Você vai controlar isso na Parte 3 com dois ajustes chamados
> *temperatura* e *top-k*.

> **Uma comparação do dia a dia:** é como o **corretor do seu celular** sugerindo a
> próxima palavra enquanto você digita. A LLM é uma versão muito mais poderosa da mesma
> ideia — prever o que vem a seguir.

---

## 2.3 Como ela "aprende" isso?

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

> Você vai fazer **exatamente** esse ciclo na Parte 3: mostrar exemplos ao modelo, ver o
> número do erro (o loss) diminuir a cada passo, e no fim ter um modelo que prevê texto no
> estilo sarcástico do seu robô.

---

## 2.4 Por que uma LLM cabe num robô?

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

## 2.5 Como isso se conecta ao nosso robô

Agora juntamos as duas metades do projeto:

- O **corpo** (Parte 1) percebe o mundo: anda, detecta obstáculos, fica preso.
- O **cérebro** (a LLM, Parte 3) recebe a situação atual e **gera uma frase** com
  personalidade.

A ponte entre os dois são os **marcadores** — etiquetas curtas que resumem a situação:
`<obstacle>` (bateu em algo), `<stuck>` (ficou preso), `<clear>` (o caminho abriu). O corpo
manda o marcador; o cérebro completa com uma reclamação sarcástica.

![A ponte: situação → marcador → cérebro → frase](/img/parte-2_fig06_a_ponte_situacao_marcador_cerebro_frase.png)

```text
corpo:    "<obstacle>"
cérebro:  "<obstacle> Oh look, a wall. Groundbreaking. Turning."
```

Repare que isso é **exatamente** a previsão do próximo pedacinho que vimos na Seção 2.2 —
só que o "começo" é um marcador de situação, e a LLM completa com a frase, um caractere por
vez.

---

## 2.6 Alguns termos que você vai encontrar

Para você não se assustar com o vocabulário na Parte 3, aqui vão os principais, em
linguagem simples. **Não precisa decorar nada agora** — todos serão explicados a fundo, com
analogia, exemplo e diagrama, quando aparecerem.

| Termo | O que significa, em uma frase | Onde você já viu nesta parte |
|---|---|---|
| **Token** | Um pedacinho de texto. No nosso caso, um caractere. | o "pedacinho" da Seção 2.2 |
| **Vocabulário** | A lista de todos os pedacinhos que o modelo conhece. | — |
| **Tokenizer** | A tradução letra ↔ número. | a imagem da Seção 2.1 |
| **Parâmetros** | Os números ajustáveis que guardam o "conhecimento". | os "botõezinhos" da Seção 2.3 |
| **Treino** | O ciclo de ajustar os parâmetros mostrando exemplos. | a Seção 2.3 |
| **Loss (erro)** | O quanto o modelo errou numa previsão. | o passo 3 do ciclo de treino |
| **Embedding** | Transformar um pedacinho de texto num conjunto de números. | — |
| **Atenção** | O mecanismo que faz cada pedacinho "olhar" para os outros. | — |
| **Inferência** | Usar o modelo já treinado para gerar texto (o contrário de treinar). | — |

---

## Encerramento da Parte 2

Agora você entende a grande ideia por trás das IAs de linguagem:

- ✅ Uma **LLM** é um programa que aprendeu padrões de texto observando exemplos
- ✅ Por dentro, ela só trabalha com **números** — o tokenizer traduz nas duas pontas
- ✅ A única coisa que ela faz é **prever o próximo pedacinho** — repetido, vira frases
- ✅ Ela **aprende** por tentativa e erro, ajustando parâmetros e diminuindo o erro (loss)
- ✅ Modelos pequenos servem para tarefas pequenas — por isso cabem num robô
- ✅ No nosso projeto, o corpo manda o marcador da situação e o cérebro completa a frase

Você desmistificou a parte mais "assustadora" do projeto sem escrever uma linha de código.
Na **Parte 3**, vamos transformar cada uma dessas ideias em realidade — construindo, peça
por peça, o cérebro do robô, do tokenizer até a geração da frase.
