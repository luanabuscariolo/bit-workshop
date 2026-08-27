---
id: simulacao-wokwi
title: "4. Simulação no Wokwi"
sidebar_position: 4
---

Antes de comprar ou montar qualquer coisa, dá para rodar o robô inteiro no computador.
Isso serve a um propósito muito claro:

> **O objetivo desta etapa não é construir o robô definitivo. É provar que a lógica do
> programa funciona** — que o robô "decide" certo — antes de gastar um centavo em peças.

O **Wokwi** (wokwi.com) é um simulador gratuito e online para ESP32 e Arduino. Você
escreve o código, monta o circuito arrastando peças no navegador e roda tudo ali mesmo,
sem hardware.

**Um detalhe sobre motores:** o Wokwi não tem um motor DC que se comporte igual ao do
robô real. A solução é elegante e didática: trocamos cada motor por um **LED colorido**.
Cada LED aceso significa uma direção de movimento. Assim você *vê* a decisão do robô
acender na tela.

![LEDs no lugar dos motores no Wokwi](/img/parte-1_fig04_leds_no_lugar_dos_motores_no_wokwi.png)

| LED | Cor | GPIO | O que significa quando acende |
|---|---|---|---|
| Frente | 🟢 Verde | 14 | Os motores girariam para frente |
| Ré | 🔴 Vermelho | 27 | Os motores girariam para trás |
| Esquerda | 🟡 Amarelo | 26 | O robô está virando à esquerda |
| Direita | 🔵 Azul | 25 | O robô está virando à direita |

O ponto importante: o código é **exatamente o mesmo** do robô real. Só a última etapa —
a saída — muda (acender um LED em vez de girar um motor). Uma única linha decide qual
versão roda: `#define MODO_SIMULACAO`. Você vai entender essa linha na próxima seção.

### Montando o Wokwi, passo a passo

1. Acesse **wokwi.com**, clique em **New Project** e escolha **ESP32**.
2. Abra a aba **`diagram.json`** e substitua todo o conteúdo por este (ele descreve o
   circuito: o ESP32, o sensor, o servo e os 4 LEDs com seus resistores):

```json
{
  "version": 1,
  "author": "Robô Autônomo ESP32",
  "editor": "wokwi",
  "parts": [
    { "type": "board-esp32-devkit-v1", "id": "esp", "top": 100, "left": 200, "attrs": {} },
    { "type": "wokwi-breadboard-half", "id": "bb", "top": 400, "left": 0, "attrs": {} },
    { "type": "wokwi-hc-sr04", "id": "ultra", "top": -60, "left": 80, "attrs": {} },
    { "type": "wokwi-servo", "id": "servo", "top": -60, "left": 350, "attrs": {} },
    { "type": "wokwi-led", "id": "ledF", "top": 420, "left": 100, "attrs": { "color": "green" } },
    { "type": "wokwi-led", "id": "ledT", "top": 420, "left": 180, "attrs": { "color": "red" } },
    { "type": "wokwi-led", "id": "ledE", "top": 420, "left": 260, "attrs": { "color": "yellow" } },
    { "type": "wokwi-led", "id": "ledD", "top": 420, "left": 340, "attrs": { "color": "blue" } },
    { "type": "wokwi-resistor", "id": "r1", "top": 460, "left": 100, "attrs": { "value": "220" } },
    { "type": "wokwi-resistor", "id": "r2", "top": 460, "left": 180, "attrs": { "value": "220" } },
    { "type": "wokwi-resistor", "id": "r3", "top": 460, "left": 260, "attrs": { "value": "220" } },
    { "type": "wokwi-resistor", "id": "r4", "top": 460, "left": 340, "attrs": { "value": "220" } }
  ],
  "connections": [
    ["esp:3V3",   "bb:tp.1",  "red",    []],
    ["esp:GND.1", "bb:tn.1",  "black",  []],
    ["bb:tp.2",   "ultra:VCC","red",    []],
    ["bb:tn.2",   "ultra:GND","black",  []],
    ["esp:D32",   "ultra:TRIG","blue",  []],
    ["esp:D33",   "ultra:ECHO","green", []],
    ["bb:tp.3",   "servo:V+", "red",    []],
    ["bb:tn.3",   "servo:GND","black",  []],
    ["esp:D13",   "servo:PWM","orange", []],
    ["esp:D14",   "r1:1",     "green",  []],
    ["r1:2",      "ledF:A",   "green",  []],
    ["ledF:C",    "bb:tn.4",  "black",  []],
    ["esp:D27",   "r2:1",     "red",    []],
    ["r2:2",      "ledT:A",   "red",    []],
    ["ledT:C",    "bb:tn.5",  "black",  []],
    ["esp:D26",   "r3:1",     "yellow", []],
    ["r3:2",      "ledE:A",   "yellow", []],
    ["ledE:C",    "bb:tn.6",  "black",  []],
    ["esp:D25",   "r4:1",     "blue",   []],
    ["r4:2",      "ledD:A",   "blue",   []],
    ["ledD:C",    "bb:tn.7",  "black",  []]
  ]
}
```

3. Abra a aba **`sketch.ino`** e cole o código da próxima seção, deixando a linha
   `#define MODO_SIMULACAO true`.
4. Clique no ícone de **livro** (Library Manager) e instale a biblioteca **ESP32Servo**.
5. Clique em **▶ Play**.

> **Como saber que funcionou.** Depois do Play, você deve ver o **LED verde acender**
> (robô andando para frente). Passe o mouse sobre o sensor HC-SR04 no desenho e ajuste a
> distância para um valor pequeno: o robô deve **parar, acender o LED vermelho** (ré) e
> depois um dos LEDs de curva. Se isso acontece, a lógica está correta — antes mesmo de
> existir um robô de verdade. 🎉

---
