---
id: montagem-mecanica
title: "8. Montagem: mecânica e sensores"
sidebar_position: 8
---

> **Regra de segurança (leia antes de tudo).** Monte sempre **sem energia**: cabo USB
> desconectado e pilhas fora do suporte. Só energize na hora de testar, seguindo a ordem
> de energização do Passo 7. Eletrônica não perdoa pressa.

Vamos montar na ordem que reduz risco: primeiro a mecânica, depois a energia, depois cada
sensor, e o L298N por último. Cada passo tem um pequeno teste ou conferência.

### Passo 1 — Montagem mecânica

1. Monte os **motores TT** no chassi (parafuse ou encaixe conforme o kit).
2. Encaixe as **rodas** nos eixos dos motores.
3. Fixe a **roda boba** na parte de trás — ela é o terceiro apoio.
4. Posicione o **suporte de pilhas** no chassi.
5. Monte o **SG90 (servo)** na frente, no suporte do sensor.
6. Encaixe o **HC-SR04** no braço do servo, virado **para a frente** do robô.

> **Confira antes de seguir:** as duas rodas giram livremente com a mão? A frente do robô
> (onde está o sensor) está claramente definida? O sensor aponta para frente, não para o
> chão nem para o teto?

### Passo 2 — Trilhos de energia na protoboard

1. Fio **vermelho**: pino de energia do ESP32 → trilho `+` da protoboard.
2. Fio **preto**: pino `GND` do ESP32 → trilho `−` da protoboard.

> **Teste simples:** antes de ligar qualquer sensor, confirme só a distribuição. Um trilho
> `+` e um trilho `−` prontos, sem nada mais ligado ainda. É a fundação do circuito.

### Passo 3 — HC-SR04 (o sensor de distância)

O sensor funciona como um morcego: **manda um som que você não escuta e cronometra o eco**.
O ESP32 dispara o pulso pelo pino TRIG; o eco volta pelo pino ECHO; o código transforma o
tempo do eco em distância.

| Pino do sensor | Conectar em |
|---|---|
| VCC | Trilho + (vermelho) |
| GND | Trilho − (preto) |
| TRIG | GPIO32 do ESP32 |
| ECHO | GPIO33 do ESP32 |

> **Atenção — boa prática de segurança elétrica.** O pino ECHO do HC-SR04 devolve um sinal
> de 5 V, mas os pinos do ESP32 são feitos para 3,3 V. No protótipo alimentado por USB o
> risco é pequeno, mas no robô definitivo o ideal é usar um **divisor de tensão** (dois
> resistores) no ECHO para baixar de 5 V para ~3,3 V.

### Passo 4 — SG90 (o servo que gira o sensor)

O servo é o "pescoço" do robô: ele gira o sensor para o robô olhar à esquerda, ao centro e
à direita, medindo a distância em cada ângulo. Sem ele, o robô só enxergaria em frente.

![O servo em três posições, girando o sensor](/img/parte-1_fig06_o_servo_em_tres_posicoes_girando_o_sensor.png)

| Fio do servo | Conectar em |
|---|---|
| Marrom (GND) | Trilho − |
| Vermelho (V+) | Trilho + |
| Laranja (sinal) | GPIO13 do ESP32 |

> **Se o robô olhar para o lado errado** (escolher a direção contrária à mais livre), os
> ângulos de esquerda e direita do servo podem estar invertidos para o seu encaixe
> mecânico. Basta trocar os valores `SERVO_ESQUERDA` e `SERVO_DIREITA` no código.
