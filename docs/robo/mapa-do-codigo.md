---
id: mapa-do-codigo
title: "5. O código: o mapa"
sidebar_position: 5
---

Aqui está o programa completo. Ele parece grande, mas é organizado em **blocos com
responsabilidades separadas** — e você não precisa entender cada linha para rodá-lo.
Vamos primeiro ver o mapa do código; depois o código inteiro; depois um passeio por
cada bloco.

### O mapa do código (o que cada parte faz)

Antes de ler o código de cima a baixo, veja como ele se divide. Cada bloco cuida de uma
coisa só:

| Bloco no código | O que ele faz | Qual peça ele controla |
|---|---|---|
| Configuração dos pinos | Diz em qual pino cada peça está ligada | — |
| `medirDistancia()` | Dispara o ultrassom e calcula a distância em cm | HC-SR04 |
| `andarFrente()`, `andarTras()`, `virar...()`, `parar()` | Ligam os motores (ou os LEDs) na direção certa | L298N → motores |
| `olharLado()` / uso do servo | Gira o sensor para medir os lados | SG90 |
| `evitarObstaculo()` | A sequência de desvio: para, recua, olha, escolhe, vira | várias |
| `iniciarNovoMovimento()` | Sorteia uma nova direção (o "modo exploração") | motores |
| `loop()` | O ciclo principal: mede, decide, age, repete | todas |

> **A linha mais importante do arquivo** é esta:
> ```cpp
> #define MODO_SIMULACAO true
> ```
> Ela funciona como uma **chave de dois estados**. Em `true`, o código acende LEDs (modo
> Wokwi). Em `false`, o mesmo código comanda os motores de verdade (modo físico). Trocar
> essa única linha é tudo o que separa a simulação do robô real. Isso existe graças aos
> trechos `#if MODO_SIMULACAO ... #else ... #endif`, que ligam ou desligam pedaços do
> código conforme a chave.
