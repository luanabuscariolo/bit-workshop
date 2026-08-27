---
id: boas-vindas
title: "Boas-vindas"
sidebar_position: 0
---

> Neste curso você vai pegar o modelo de linguagem treinado no computador e fazê-lo rodar
> **dentro de um microcontrolador**, dando voz ao robô.

## Para quem é este curso

Este é o curso mais avançado da trilha. Ele assume que você já:

- Tem um **robô funcionando** (Curso 1) — ou pelo menos entende como ele funciona
- Tem um **modelo treinado** (Curso 2) — o arquivo `.pt` com os pesos

Se você pulou algum dos dois, recomendo voltar: aqui a gente une as duas metades, e é
difícil unir o que ainda não existe.

## O que você vai construir

A ponte entre os dois mundos. O modelo que você treinou em Python, no computador, vai
passar a rodar em **C, dentro do chip**, sem internet e sem servidor — gerando frases
sarcásticas em tempo real conforme o robô se move.

Ao longo do curso você vai:

- Entender por que Python e o microcontrolador "falam idiomas diferentes"
- **Exportar os pesos** do modelo para um formato que o chip entende
- **Gravar** o modelo na memória flash do ESP32-S3
- Reescrever a **inferência em C**, do zero
- Mostrar a personalidade num **display OLED**
- Fazer os dois cérebros **conversarem** entre si

## O que torna este curso especial

Este é o momento em que o projeto deixa de ser dois experimentos separados e vira **uma
coisa só**. É também onde aparecem os problemas mais interessantes de engenharia: memória
limitada, precisão numérica, e a regra de ouro que guia todo o design —

> **O corpo nunca espera pelo cérebro.** O cérebro comenta o que o corpo já fez.

## Como usar este material (o método)

Este curso segue algumas regras que valem para todas as páginas:

1. **Vá na ordem.** Cada página assume o que veio antes. O menu à esquerda mostra
   exatamente onde você está e o que vem depois.
2. **Sempre uma explicação antes do código.** Você nunca vai copiar algo sem saber o
   que faz.
3. **Teste cada peça isoladamente antes de integrar.** Esta é a regra de ouro do
   projeto. Monta uma peça → testa ela sozinha → confirma que funciona → só então parte
   para a próxima. Isso transforma a depuração de um pesadelo ("nada funciona, por quê?")
   em algo gerenciável ("só esta peça falhou").
4. **Não tem pressa.** Se travar em algo, releia a página anterior. O material foi feito
   para ser consultado, não decorado.

## Uma palavra antes de começar

Projetos assim são maratonas, não corridas de 100 metros. Vai ter momento em que algo não
funciona de primeira — e tudo bem, faz parte. Cada peça que você testar e ver funcionando
é uma pequena vitória. Comemore essas vitórias.

E lembre: no fim, você não terá seguido uma receita. Você terá **aprendido a cozinhar**.

## Onde este curso se encaixa

Este é o **Curso 3**, o último da trilha RoverMind. Ele une o corpo (Curso 1) e o cérebro
(Curso 2) num robô completo, autônomo e falante.
