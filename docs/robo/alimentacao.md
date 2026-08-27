---
id: alimentacao
title: "3. Entendendo a alimentação"
sidebar_position: 3
---

Antes de encostar em um fio sequer, precisamos entender como a energia percorre o robô.
**Errar a alimentação é a causa número um de peças queimadas** — e é também o erro mais
fácil de evitar quando você entende o caminho da energia.

### A regra de ouro da eletrônica: o GND comum

Todos os componentes do robô precisam compartilhar o mesmo **GND** — o "terra", o
negativo do circuito. Pense no GND como o **nível do chão** de um prédio: todo mundo
mede a altura a partir do mesmo chão. Se cada peça tivesse um "chão" diferente, elas não
teriam como concordar sobre o que é "0 volt", e os sinais elétricos viram bagunça.

> **Na prática:** o GND das pilhas, o GND do L298N, o GND do ESP32 e o GND dos sensores
> têm que estar **todos ligados entre si**. Sem isso, o circuito simplesmente não
> funciona — mesmo com tudo o mais certo.

### Por onde a energia caminha

![Esquema de alimentação](/img/parte-1_fig03_esquema_de_alimentacao.png)

Siga o caminho da energia, passo a passo:

1. As **4 pilhas AA** (~6 V) ligam no pino **12V do L298N**. Apesar do nome "12V", esse
   pino aceita uma faixa de tensão; 6 V funcionam bem.
2. O **L298N tem um regulador interno de 5V**. Um jumper pequeno (aquele conectorzinho
   plástico que vem de fábrica) precisa estar colocado para esse regulador ligar. Ele
   pega os ~6 V das pilhas e produz **5 V estáveis**.
3. Esses **5 V saem pelo pino "5V" do L298N** e entram no **pino VIN do ESP32**. É assim
   que as mesmas pilhas alimentam também o cérebro do robô.
4. O **ESP32** distribui energia para o **HC-SR04** e o **SG90**, através do trilho da
   protoboard (veremos a protoboard na a página sobre a protoboard).

> **Antes de ligar — confira sempre:**
> - [ ] Os fios de GND de **todas** as peças estão unidos?
> - [ ] O positivo e o negativo das pilhas **não** estão se tocando?
> - [ ] O jumper de 5V do L298N está **colocado**?
>
> Essas três conferências evitam a maioria dos acidentes. Faça-as com a energia
> **desligada**.

> **Curiosidade útil.** O L298N tem dois outros jumpers, chamados **ENA** e **ENB**. Se
> você removê-los, passa a poder controlar a *velocidade* dos motores pelo ESP32. Se eles
> ficarem colocados, os motores só andam na velocidade máxima. No nosso robô, vamos
> controlar a velocidade — então esses dois jumpers saem.

---
