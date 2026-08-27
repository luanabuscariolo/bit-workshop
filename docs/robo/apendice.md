---
id: apendice
title: "Apêndice"
sidebar_position: 11
---

Material de consulta rápida deste curso.

## A. Glossário

**ESP32-WROOM-32** — O microcontrolador do corpo do robô (navegação e sensores).

**ESP32-S3** — O microcontrolador do cérebro (roda a LLM). Tem PSRAM e mais recursos.

**Flash** — A memória permanente do microcontrolador, onde ficam o firmware e os pesos.

**GND (terra)** — O polo negativo do circuito. Regra de ouro: todos os GNDs unidos.

**GPIO** — Os pinos programáveis do ESP32 (General Purpose Input/Output).

**HC-SR04** — O sensor ultrassônico que mede distância (o "olho" do robô).

**L298N** — A ponte H que controla os motores a partir dos sinais do ESP32.

**Ponte H** — Um circuito que controla o sentido de giro de um motor. É o que o L298N é.

**Protoboard** — A placa de furos para montar circuitos sem solda, distribuindo VCC e
GND.

**PSRAM** — Uma memória extra e maior do ESP32-S3, onde ficam os buffers de cálculo.

**PWM** — Um sinal que liga e desliga rápido para controlar velocidade (motores) ou
ângulo (servo).

**Servo (SG90)** — O pequeno motor que gira o sensor para varrer os lados.

**SRAM** — A memória rápida e pequena do microcontrolador, para os cálculos imediatos.

**Wokwi** — O simulador online gratuito de ESP32/Arduino.

---

## B. Solução de problemas


| Sintoma | Provável causa | Solução |
|---|---|---|
| Upload falha em "Connecting..." | ESP32 não entrou em modo de gravação | Segure o botão **BOOT** durante o "Connecting..." |
| ESP32 não liga com as pilhas | Jumper de 5V do L298N ausente | Coloque o jumper de 5V do L298N |
| Motores não giram | Jumpers ENA/ENB presentes | Remova os dois jumpers de ENA e ENB |
| Um motor gira ao contrário | Fios do motor invertidos | Troque os dois fios daquele motor nos bornes OUT |
| Sensor sempre lê o mesmo valor | TRIG/ECHO trocados ou mal ligados | Confira TRIG=GPIO32 e ECHO=GPIO33 |
| Servo treme sem parar | Alimentação fraca | Garanta 5V estáveis e todos os GNDs unidos |
| Nada funciona / comportamento errático | GNDs não unidos | Una TODOS os GNDs (pilhas, L298N, ESP32, sensores) |
| `LED_BUILTIN` não compila | Não existe no ESP32 | Use o GPIO2 diretamente |

## C. Mapa de pinos


**Robô (ESP32-WROOM-32):**

| Componente | Pino |
|---|---|
| HC-SR04 TRIG | GPIO32 |
| HC-SR04 ECHO | GPIO33 |
| Servo SG90 | GPIO13 |
| L298N ENA / IN1 / IN2 | GPIO23 / 22 / 21 |
| L298N IN3 / IN4 / ENB | GPIO19 / 18 / 5 |

**Display OLED (ESP32-S3, SH1106 SPI):**

| Sinal | Pino |
|---|---|
| CLK | GPIO12 |
| MOSI | GPIO11 |
| CS | GPIO8 |
| DC | GPIO9 |
| RES | GPIO10 |

**Comunicação entre as placas:** TX do WROOM-32 → RX do S3, com os GNDs unidos.

---

## D. Para onde ir depois

- **Curso 2 — IA num Chip:** construa o cérebro que vai dar voz a este robô.
- **Melhore o corpo:** adicione sensores (linha, luz), troque o chassi, experimente outros
  padrões de exploração no código.
- **Documente:** fotografe cada etapa da montagem. Vira portfólio.
