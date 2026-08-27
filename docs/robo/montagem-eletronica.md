---
id: montagem-eletronica
title: "9. Montagem: motores e energização"
sidebar_position: 9
---

### Passo 5 — L298N e motores

Aqui mora uma ideia que confunde muita gente no começo:

> **O ESP32 não move o motor diretamente.** O ESP32 é um cérebro de sinais fracos (3,3 V,
> pouquíssima corrente) — longe do necessário para girar um motor. Ele apenas **dá as
> ordens**; quem tem força para acionar os motores é o L298N, puxando energia direto das
> pilhas.

![O ESP32 comanda; o L298N faz força](/img/parte-1_fig07_o_esp32_comanda_o_l298n_faz_forca.png)

| Pino do L298N | Conectar em |
|---|---|
| IN1 | GPIO22 do ESP32 |
| IN2 | GPIO21 do ESP32 |
| ENA | GPIO23 do ESP32 |
| IN3 | GPIO19 do ESP32 |
| IN4 | GPIO18 do ESP32 |
| ENB | GPIO5 do ESP32 |
| GND | Trilho − **e** negativo das pilhas |
| 12V | Positivo das pilhas (~6 V) |
| 5V | VIN do ESP32 |
| OUT1/OUT2 | Fios do motor esquerdo |
| OUT3/OUT4 | Fios do motor direito |

> **Confirme:** o **jumper de 5V do L298N** está colocado? (o conectorzinho plástico perto
> da alimentação). Sem ele, o regulador interno não liga e o ESP32 não recebe energia das
> pilhas.

### Mapa de pinos completo (sua folha de consulta)

Sempre que ficar em dúvida sobre "onde vai este fio?", volte a esta figura. Ela é a
referência única de todas as ligações entre o ESP32 e as peças.

![Mapa de pinos definitivo](/img/parte-1_fig08_mapa_de_pinos_definitivo.png)

### Passo 6 — Checagem de segurança (antes de ligar)

Antes de conectar qualquer energia, confirme item por item:

- [ ] Fio **vermelho** das pilhas no pino **12V** do L298N?
- [ ] Fio **preto** das pilhas no **GND** do L298N?
- [ ] **GND do L298N** ligado ao trilho **−** da protoboard?
- [ ] Pino **5V do L298N** ligado ao **VIN** do ESP32?
- [ ] Jumper de 5V do L298N **colocado**?
- [ ] Os jumpers de **ENA e ENB removidos** (se existiam)?
- [ ] Todos os 6 fios de controle (IN1 a ENB) nos GPIOs certos?
- [ ] Positivo e negativo das pilhas **não** estão se tocando?

### Passo 7 — Ordem de energização

A ordem importa: energizar na sequência errada pode enviar tensão para onde não deve.

1. **Primeiro:** conecte o **USB** no ESP32 (para o computador gravar o código).
2. Grave o código com `#define MODO_SIMULACAO false`.
3. **Depois:** coloque as pilhas (ou ligue a chave do suporte).
4. Mantenha o robô com as **rodas no ar** no primeiro teste — assim, se algo estiver
   invertido, ele não sai correndo da mesa.

> **O que esperar nos primeiros segundos:** as rodas devem começar a girar para frente. Ao
> aproximar a mão do sensor, o robô deve parar e iniciar a sequência de desvio. Se algo
> diferente acontecer, desligue as pilhas e vá para o Passo 8.

### Passo 8 — Se algo não sair como esperado

Diagnostique por **sintoma**, sempre do mais simples (energia) para o mais complexo (código):

| Sintoma | Provável causa | O que conferir / fazer |
|---|---|---|
| Upload falha em "Connecting..." | ESP32 esperando modo de gravação | Segure o botão **BOOT** durante o "Connecting..." |
| Motores não giram | Jumper ENA/ENB ainda colocado | Remova os dois jumpers |
| ESP32 não liga com as pilhas | Jumper de 5V ausente | Confirme e coloque o jumper de 5V |
| Um motor gira ao contrário | Fios daquele motor invertidos | Troque os dois fios do motor nos bornes OUT |
| Sensor não lê distância | TRIG/ECHO trocados ou sem energia | Confira energia → GND → depois TRIG(32)/ECHO(33) |
| Robô escolhe o lado errado | Ângulos do servo invertidos | Troque `SERVO_ESQUERDA` e `SERVO_DIREITA` |

---
