---
title: "Boas-vindas"
sidebar_position: 0
---

# Tutorial Completo — Robô Autônomo com Cérebro LLM (nano-grump)

> Material de estudos para iniciante total: construir, do zero, um robô autônomo com
> personalidade sarcástica, movido por um modelo de linguagem (LLM) que você mesmo cria,
> treina e embarca. Este arquivo único reúne as 6 partes e todas as figuras embutidas.

---

## Sumário

- **Parte 0** — Boas-vindas
- **Parte 1** — O Robô (o corpo)
- **Parte 2** — O que é uma LLM
- **Parte 3** — A LLM do zero (o cérebro)
- **Parte 4** — ESP32-S3 (a união)
- **Parte 5** — Apêndices

---

# Parte 0 — Boas-vindas

> Um robô que anda sozinho, desvia de obstáculos e **reclama com sarcasmo** de tudo
> que acontece com ele — usando um modelo de inteligência artificial que você mesmo
> vai construir, treinar e colocar para rodar dentro dele. Do zero. Entendendo cada
> peça.

Seja muito bem-vindo(a). Este é o guia completo de um projeto que une **eletrônica**,
**robótica** e **inteligência artificial** num só lugar — e foi escrito para que
qualquer pessoa curiosa consiga acompanhar, mesmo começando do absoluto zero.

---

## Para quem é este tutorial

Este material foi feito pensando em você, **iniciante total**. Você **não** precisa:

- Saber programar (vamos explicar cada trecho de código)
- Entender de eletrônica (começamos pela protoboard)
- Saber o que é inteligência artificial (a Parte 2 explica do zero)
- Ter feito faculdade de nada disso

Você **precisa** apenas de:

- Curiosidade e vontade de aprender fazendo
- Paciência para ir um passo de cada vez
- Um computador (Windows, mas o essencial serve para qualquer sistema)

Se você já tem experiência com Arduino, Python ou IA, ótimo — vai avançar mais rápido
e pode pular direto para as partes que interessam.

---

## O que você vai construir

O projeto tem **duas metades que conversam entre si**:

![Visão geral do projeto](/img/parte-0_fig01_visao_geral_do_projeto.png)

- **O corpo** (um ESP32) anda, enxerga com um sensor de distância e desvia sozinho.
- **O cérebro** (um segundo microcontrolador com uma IA minúscula) recebe cada situação
  do robô e gera uma frase curta, debochada, em inglês.

O resultado é um robozinho com **personalidade**: ele não só desvia de uma parede —
ele resmunga sobre a parede enquanto desvia.

---

## O que torna este projeto especial

Existe muito tutorial de robô por aí, e muito tutorial de IA. O diferencial deste é a
filosofia: **entender antes de integrar**. Em vez de baixar uma biblioteca de IA
pronta e só apertar "rodar", você vai ver cada número que entra e sai — como um
relojoeiro que monta o relógio peça por peça, não alguém que só troca a pilha. Aqui,
cada componente é construído e testado isoladamente, com explicação, antes de virar
parte do todo.

Ao final, você não vai só ter um robô funcionando — você vai **entender por que ele
funciona**, do sensor de ultrassom até o mecanismo de atenção do modelo de linguagem.
Isso é raro, e é o que transforma um seguidor de tutoriais num criador.

---

## Como este tutorial está organizado

O guia é dividido em partes. Cada uma se apoia na anterior, mas você pode navegar como
preferir:

![Mapa das partes do tutorial](/img/parte-0_fig02_mapa_das_partes_do_tutorial.png)

- **Parte 1 — O Robô:** monta o corpo, na simulação e no hardware real.
- **Parte 2 — O que é uma LLM:** explica a grande ideia da IA de linguagem, sem código.
- **Parte 3 — A LLM do zero:** constrói e treina o cérebro, peça por peça.
- **Parte 4 — ESP32-S3:** leva o cérebro para o robô e faz os dois conversarem.
- **Parte 5 — Apêndices:** glossário, solução de problemas e próximos passos.

Se seu interesse é só o robô, faça a Parte 1. Se é só a IA, vá para a 2 e a 3. Se quer
a experiência completa, siga em ordem.

---

## Como usar este material (o método)

Este tutorial segue um método testado, pensado para não sobrecarregar você:

1. **Um conceito de cada vez.** Cada ideia nova vem sozinha, com tempo para assentar.
2. **Sempre uma explicação antes do código.** Você nunca vai copiar algo sem saber o
   que faz. Nos conceitos de IA (a partir da Parte 3), cada ideia segue sempre o mesmo
   ritmo, que você vai reconhecer: ideia em uma frase → analogia do dia a dia → exemplo
   com números pequenos → diagrama → código comentado → uma frase-resumo para repetir a
   quem entende do assunto.
3. **Teste cada peça isoladamente (a "regra de ouro").** Nunca montamos tudo de uma
   vez. Montamos uma peça, testamos ela sozinha, confirmamos que funciona, e só então
   seguimos. Isso transforma a depuração de um pesadelo ("nada funciona!") em algo
   gerenciável ("só esta peça falhou").
4. **Segurança sempre.** Quando há energia envolvida, montamos com tudo desligado,
   conferimos item por item e só então ligamos.

Se em algum momento uma explicação parecer rápida demais ou cheia de termos, respire:
volte um passo, releia a analogia. O material foi feito para ser digerido devagar.

---

## O que você vai precisar

Uma visão geral (cada parte detalha o seu próprio material):

**Para o robô (Parte 1):**
- Uma placa ESP32-WROOM-32, sensor HC-SR04, servo SG90, ponte H L298N, 2 motores com
  rodas, chassi, pilhas e uma protoboard.
- Ou **nada disso** para começar: a Parte 1 mostra como simular tudo no computador,
  de graça, antes de comprar qualquer peça.

**Para a IA (Partes 3 e 4):**
- Um computador com Python. Uma placa de vídeo (GPU) ajuda no treino, mas não é
  obrigatória para um modelo pequeno como o nosso.
- Para embarcar: uma placa ESP32-S3 (com PSRAM) e um display OLED.

Não precisa ter tudo agora. Dá para percorrer boa parte do tutorial só lendo,
simulando e entendendo — e comprar os componentes quando decidir montar.

---

## Uma palavra antes de começar

Projetos assim são maratonas, não corridas de 100 metros. **Não há pressa nem prazo:**
tem gente que faz só a Parte 1 num fim de semana e para por ali, feliz com um robô que
anda — e está ótimo. Vai ter momento em que algo não funciona de primeira — e tudo bem,
faz parte. Cada peça que você testar e ver funcionando é uma pequena vitória. Comemore
essas vitórias.

No fim, você vai olhar para um robozinho debochado andando pela sala e pensar: *"eu
entendo tudo o que está acontecendo aí dentro"*. Esse é o objetivo.

Vamos começar. Siga para a **Parte 1** e vamos dar vida ao corpo do robô. 🤖


---
