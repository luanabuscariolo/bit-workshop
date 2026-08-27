---
id: componentes
title: "2. Lista de componentes"
sidebar_position: 2
---

Aqui está tudo que você precisa para montar o robô. A coluna da direita não diz só o
nome da peça — diz **o que ela faz no comportamento** que você acabou de ver, para você
já ligar cada item ao seu papel.

| Qtd. | Componente | O que ele faz no robô |
|---|---|---|
| 1 | **ESP32-WROOM-32 DevKit** | O pequeno computador que decide tudo: lê o sensor e comanda os motores. É o cérebro do corpo. |
| 1 | **HC-SR04** | O sensor de distância. É ele que "enxerga" o obstáculo e dispara o desvio. |
| 1 | **SG90** | O servo motor. Gira o sensor para a esquerda e para a direita, para o robô olhar os lados. |
| 1 | **L298N** | A ponte H. Recebe as ordens fracas do ESP32 e entrega a corrente forte que os motores precisam. |
| 2 | **Motor DC TT com caixa de redução** | Giram as rodas. São os "músculos" que movem o robô. |
| 2 | Rodas compatíveis com motor TT | Onde os motores encostam no chão. |
| 1 | Roda boba (castor) | Terceiro ponto de apoio, atrás, para o robô não cair. |
| 1 | Chassi de acrílico 2WD | A estrutura onde tudo é parafusado. |
| 1 | Suporte para 4× pilhas AA | Segura as pilhas e leva a energia para o circuito. |
| 4 | Pilhas AA | A fonte de energia de tudo (~6 V com alcalinas). |
| 1 | Protoboard | Uma plaquinha de furos que distribui energia e terra sem solda. |
| — | Fios jumper Dupont (macho-macho, macho-fêmea) | Os fios que ligam uma peça na outra. |
| 1 | Chave liga/desliga (opcional) | Para ligar e desligar sem tirar as pilhas. |

![Os componentes do robô e o que cada um faz](/img/parte-1_fig02_os_componentes_do_robo_e_o_que_cada_um_faz.png)

> **Não compre tudo de uma vez.** Se quiser testar antes de investir, siga a a página da simulação no Wokwi
> (simulação no Wokwi): você roda o comportamento completo do robô no navegador, sem
> nenhuma peça física. Só depois de ver funcionando é que vale comprar os componentes.

---
