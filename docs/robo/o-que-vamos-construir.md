---
id: o-que-vamos-construir
title: "1. O que vamos construir"
sidebar_position: 1
---

Um **robô de duas rodas em modo exploração**: ele anda pelo ambiente em direções que
mudam de tempos em tempos e, quando o sensor detecta um obstáculo à frente, ele para,
olha para os dois lados e escolhe o caminho mais livre — sozinho, sem ninguém no
controle remoto.

A melhor forma de entender o robô não é como uma lista de passos, e sim como um
**ciclo que se repete o tempo todo**: ele anda, mede a distância à frente, decide se
há obstáculo e age de acordo. Assim que termina, recomeça — várias vezes por segundo.
É esse loop girando muito rápido que dá a impressão de que o robô "pensa".

> **O que é um "loop"?** É uma sequência de passos que o programa repete sem parar,
> como um relógio que volta ao topo assim que completa a volta. Praticamente todo
> robô funciona assim: perceber → decidir → agir → repetir.

![O ciclo de decisão do robô](/img/parte-1_fig01_o_ciclo_de_decisao_do_robo.png)

> **O que você vai ver acontecer.** Assim que ligado, o robô sai andando. Ao aproximar
> a mão ou uma parede a menos de ~25 cm da frente dele, ele para, dá uma ré curtinha,
> gira o sensor para a esquerda e para a direita (você vê o servo mexendo) e então vira
> para o lado que estava mais livre. Se os dois lados estiverem bloqueados, ele resolve
> isso também — veremos como no código.

Cada parte desse comportamento é feita por uma peça específica. Guarde esta associação,
porque ela vai reaparecer o tempo todo:

- **andar e virar** → os motores, comandados pela ponte H (o L298N)
- **medir a distância** → o sensor de ultrassom (o HC-SR04)
- **olhar para os lados** → o servo (o SG90), que gira o sensor
- **decidir o que fazer** → o ESP32, rodando o nosso código

> **Resumo em uma frase.** O robô é um loop "andar → medir → decidir → desviar" onde
> cada peça tem um papel, e o ESP32 é quem toma as decisões.

---
