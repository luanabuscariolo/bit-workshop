---
title: "Parte 1 — O Robô"
sidebar_position: 1
---

# Parte 1 — O Corpo: o robô autônomo

> **Onde estamos na jornada.** Esta é a primeira parte prática do projeto. Vamos
> montar um robô capaz de andar sozinho, enxergar obstáculos com um sensor de
> ultrassom e desviar deles — tudo comandado por um pequeno computador, o ESP32.
> Primeiro simulamos tudo no navegador (sem gastar um parafuso); depois montamos o
> robô físico, fio por fio, testando cada peça sozinha antes de ligar o conjunto.
>
> **O que você já precisa saber:** nada. Se você nunca ligou um LED nem escreveu uma
> linha de código, esta parte foi feita para você. Cada termo novo é explicado na
> hora em que aparece.

---

## 1.1 O que vamos construir

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

## 1.2 Lista de componentes

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

> **Não compre tudo de uma vez.** Se quiser testar antes de investir, siga a Seção 1.4
> (simulação no Wokwi): você roda o comportamento completo do robô no navegador, sem
> nenhuma peça física. Só depois de ver funcionando é que vale comprar os componentes.

---

## 1.3 Entendendo a alimentação antes de montar qualquer fio

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
   protoboard (veremos a protoboard na Seção 1.6).

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

## 1.4 Simulação no Wokwi (sem nenhuma peça)

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

## 1.5 O código do robô (um só, serve para Wokwi e para o robô físico)

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

### O código completo

```cpp
/*
=============================================================
 ROBÔ AUTÔNOMO - MODO EXPLORAÇÃO
 ESP32 + HC-SR04 + SG90 + L298N

 Para o Wokwi (simulação com LEDs):
   #define MODO_SIMULACAO true

 Para o robô físico (L298N + motores):
   #define MODO_SIMULACAO false
=============================================================
*/

#include <ESP32Servo.h>

// ============================================================
// MUDE APENAS ESTA LINHA PARA ALTERNAR ENTRE OS DOIS MODOS
// ============================================================
#define MODO_SIMULACAO true

// Pinos do sensor e do servo (iguais nos dois modos)
const int TRIG_PIN  = 32;
const int ECHO_PIN  = 33;
const int SERVO_PIN = 13;

// Pinos do L298N (usados só no robô físico)
#if !MODO_SIMULACAO
  const int ENA = 23, IN1 = 22, IN2 = 21;
  const int ENB = 5,  IN3 = 19, IN4 = 18;
#endif

// Pinos dos LEDs (usados só no Wokwi)
#if MODO_SIMULACAO
  const int LED_FRENTE   = 14;
  const int LED_TRAS     = 27;
  const int LED_ESQUERDA = 26;
  const int LED_DIREITA  = 25;
#endif

// Configurações gerais
const int DISTANCIA_OBSTACULO     = 25;
const int VELOCIDADE_MINIMA       = 140;
const int VELOCIDADE_MAXIMA       = 220;
const int VELOCIDADE_RE           = 160;
const int VELOCIDADE_CURVA        = 190;
const int TEMPO_RECUO             = 250;
const int TEMPO_CURVA_OBSTACULO   = 450;
const unsigned long DUR_MIN_MOV   = 2000;
const unsigned long DUR_MAX_MOV   = 6000;
const unsigned long DUR_MIN_CURVA = 300;
const unsigned long DUR_MAX_CURVA = 800;

const int SERVO_CENTRO   = 90;
const int SERVO_ESQUERDA = 30;
const int SERVO_DIREITA  = 150;

Servo sensorServo;

// Controle do modo exploração
unsigned long inicioMovimento = 0, duracaoMovimento = 0;
int velocidadeAtual = 0, movimentoAtual = 0, ultimaCurva = 0;

// ============================================================
// MEDIR DISTÂNCIA
// ============================================================
float medirDistancia() {
  digitalWrite(TRIG_PIN, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dur = pulseIn(ECHO_PIN, HIGH, 30000);
  if (dur == 0 || dur < 60) return 400;
  return dur * 0.0343 / 2.0;
}

// ============================================================
// CONTROLE DE MOVIMENTO
// ============================================================
void desligarLeds() {
  #if MODO_SIMULACAO
    digitalWrite(LED_FRENTE, LOW); digitalWrite(LED_TRAS, LOW);
    digitalWrite(LED_ESQUERDA, LOW); digitalWrite(LED_DIREITA, LOW);
  #endif
}

void andarFrente(int v) {
  #if MODO_SIMULACAO
    desligarLeds(); digitalWrite(LED_FRENTE, HIGH);
  #else
    digitalWrite(IN1,HIGH); digitalWrite(IN2,LOW);
    digitalWrite(IN3,HIGH); digitalWrite(IN4,LOW);
    analogWrite(ENA,v); analogWrite(ENB,v);
  #endif
}

void andarTras(int v) {
  #if MODO_SIMULACAO
    desligarLeds(); digitalWrite(LED_TRAS, HIGH);
  #else
    digitalWrite(IN1,LOW); digitalWrite(IN2,HIGH);
    digitalWrite(IN3,LOW); digitalWrite(IN4,HIGH);
    analogWrite(ENA,v); analogWrite(ENB,v);
  #endif
}

void virarEsquerda(int v) {
  #if MODO_SIMULACAO
    desligarLeds(); digitalWrite(LED_ESQUERDA, HIGH);
  #else
    digitalWrite(IN1,LOW); digitalWrite(IN2,HIGH);
    digitalWrite(IN3,HIGH); digitalWrite(IN4,LOW);
    analogWrite(ENA,v); analogWrite(ENB,v);
  #endif
}

void virarDireita(int v) {
  #if MODO_SIMULACAO
    desligarLeds(); digitalWrite(LED_DIREITA, HIGH);
  #else
    digitalWrite(IN1,HIGH); digitalWrite(IN2,LOW);
    digitalWrite(IN3,LOW); digitalWrite(IN4,HIGH);
    analogWrite(ENA,v); analogWrite(ENB,v);
  #endif
}

void parar() {
  #if MODO_SIMULACAO
    desligarLeds();
  #else
    analogWrite(ENA,0); analogWrite(ENB,0);
    digitalWrite(IN1,LOW); digitalWrite(IN2,LOW);
    digitalWrite(IN3,LOW); digitalWrite(IN4,LOW);
  #endif
}

// ============================================================
// VARREDURA COM SERVO
// ============================================================
float medirLado(int angulo) {
  sensorServo.write(angulo); delay(400);
  return medirDistancia();
}

// ============================================================
// DESVIO DE OBSTÁCULO
// ============================================================
void evitarObstaculo() {
  parar(); delay(200);
  andarTras(VELOCIDADE_RE); delay(TEMPO_RECUO);
  parar(); delay(200);
  float esq = medirLado(SERVO_ESQUERDA);
  float dir = medirLado(SERVO_DIREITA);
  sensorServo.write(SERVO_CENTRO); delay(300);
  if (esq > dir) { virarEsquerda(VELOCIDADE_CURVA); }
  else           { virarDireita(VELOCIDADE_CURVA);  }
  delay(TEMPO_CURVA_OBSTACULO);
  parar(); delay(100);
}

// ============================================================
// MODO EXPLORAÇÃO
// ============================================================
void iniciarNovoMovimento() {
  velocidadeAtual = random(VELOCIDADE_MINIMA, VELOCIDADE_MAXIMA + 1);
  int s = random(100);
  movimentoAtual = (s < 50) ? 0 : (s < 75) ? 1 : 2;
  if (movimentoAtual == 1 && ultimaCurva == 1) movimentoAtual = 2;
  if (movimentoAtual == 2 && ultimaCurva == 2) movimentoAtual = 1;
  if (movimentoAtual != 0) ultimaCurva = movimentoAtual;
  duracaoMovimento = (movimentoAtual == 0)
    ? random(DUR_MIN_MOV, DUR_MAX_MOV + 1)
    : random(DUR_MIN_CURVA, DUR_MAX_CURVA + 1);
  inicioMovimento = millis();
}

// ============================================================
// SETUP E LOOP
// ============================================================
void setup() {
  Serial.begin(115200);
  randomSeed(micros());
  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);
  #if !MODO_SIMULACAO
    pinMode(IN1,OUTPUT); pinMode(IN2,OUTPUT); pinMode(ENA,OUTPUT);
    pinMode(IN3,OUTPUT); pinMode(IN4,OUTPUT); pinMode(ENB,OUTPUT);
  #endif
  #if MODO_SIMULACAO
    pinMode(LED_FRENTE,OUTPUT); pinMode(LED_TRAS,OUTPUT);
    pinMode(LED_ESQUERDA,OUTPUT); pinMode(LED_DIREITA,OUTPUT);
  #endif
  sensorServo.setPeriodHertz(50);
  sensorServo.attach(SERVO_PIN, 500, 2400);
  parar(); sensorServo.write(SERVO_CENTRO); delay(1000);
  iniciarNovoMovimento();
}

void loop() {
  float dist = medirDistancia();
  if (dist <= DISTANCIA_OBSTACULO) {
    evitarObstaculo();
    iniciarNovoMovimento();
    return;
  }
  if      (movimentoAtual == 0) andarFrente(velocidadeAtual);
  else if (movimentoAtual == 1) virarEsquerda(velocidadeAtual);
  else                          virarDireita(velocidadeAtual);
  if (millis() - inicioMovimento >= duracaoMovimento)
    iniciarNovoMovimento();
  delay(50);
}
```

### Passeio pelos blocos (o que observar em cada um)

Você não precisa decorar nada disto — é um mapa para quando quiser mexer no código:

- **`medirDistancia()`** manda um pulso pelo pino TRIG, ouve o eco voltar no pino ECHO e
  transforma o *tempo* do eco em *centímetros*. É a "visão" do robô. Repare no filtro
  `if (dur == 0 || dur < 60) return 400;` — ele descarta leituras impossíveis (ruído),
  devolvendo "400 cm" (ou seja, "caminho livre").
- **As funções de movimento** (`andarFrente`, `virarEsquerda`, etc.) são a "musculatura".
  Cada uma tem duas versões dentro dela: uma acende LEDs (simulação), a outra aciona os
  pinos do L298N (físico). A chave `MODO_SIMULACAO` escolhe qual vale.
- **`evitarObstaculo()`** é a sequência de desvio inteira: parar, recuar, girar o servo
  para olhar os dois lados, comparar as distâncias e virar para o lado mais livre.
- **`iniciarNovoMovimento()`** é o que dá a "personalidade exploradora": de tempos em
  tempos, sorteia uma nova direção e duração, evitando repetir sempre a mesma curva.
- **`loop()`** amarra tudo: mede a distância, e se houver obstáculo perto chama
  `evitarObstaculo()`; senão, continua o movimento atual. E recomeça.

> **Para passar do Wokwi para o robô físico:** troque `#define MODO_SIMULACAO true` por
> `#define MODO_SIMULACAO false`. Só isso. Todo o resto do código permanece idêntico.

---

## 1.6 Como entender a protoboard

Se você nunca usou uma protoboard, ela parece um tabuleiro de furos sem sentido. Mas por
baixo ela tem uma lógica simples de conexões — e entender essa lógica **antes** de montar
evita quase todos os erros de ligação.

![Como a protoboard funciona](/img/parte-1_fig05_como_a_protoboard_funciona.png)

**Três regras que explicam tudo:**

1. Os **trilhos** de cima e de baixo (as linhas marcadas `+` e `−`) são ligados na
   **horizontal**: a linha inteira é um único ponto elétrico. É aqui que colocamos a
   energia (VCC) e o terra (GND) para distribuir a todos os componentes.
2. As **colunas** do meio são ligadas na **vertical**, em grupos de 5 furos. Cada
   coluninha de 5 furos é um "nó" — tudo que você espeta ali fica conectado entre si.
3. O **sulco central** (o corte no meio) separa a metade de cima da de baixo. Um furo de
   cima **não** se conecta ao de baixo, mesmo alinhados.

> **Teste seu entendimento.** Se você espeta dois fios na **mesma coluna de 5 furos**,
> eles estão conectados? **Sim.** E se você espeta um fio no trilho `+` de cima e outro no
> trilho `+` de baixo, sem nenhum fio ligando os dois? **Não** — os dois trilhos de cima e
> de baixo são independentes até você uni-los com um fio.

**Na prática:** ligamos um fio do `5V`/`3V3` do ESP32 no trilho `+` e um fio do `GND` no
trilho `−`. A partir daí, cada componente pega energia e terra do trilho mais próximo, sem
precisar amontoar vários fios num único pino do ESP32.

---

## 1.7 Montagem física: passo a passo

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

## 1.8 Testando por partes (a regra de ouro do projeto)

Esta é a filosofia central de todo o tutorial, então vale repetir: **nunca teste tudo de
uma vez.** Aprove cada peça sozinha; só depois junte. Quando o conjunto falhar, você já vai
saber que o problema está na *ligação* entre peças, não nas peças — porque cada uma já foi
aprovada.

![Construindo por blocos: cada peça aprovada antes de juntar](/img/parte-1_fig09_construindo_por_blocos_cada_peca_aprovada_ant.png)

A ordem dos testes segue a mesma da montagem:

**1. Teste do HC-SR04** (só USB, sem pilhas). Prova que o sensor mede distância.

```cpp
const int TRIG = 32, ECHO = 33;
void setup() { Serial.begin(115200); pinMode(TRIG,OUTPUT); pinMode(ECHO,INPUT); }
void loop() {
  digitalWrite(TRIG,LOW); delayMicroseconds(2);
  digitalWrite(TRIG,HIGH); delayMicroseconds(10); digitalWrite(TRIG,LOW);
  long d = pulseIn(ECHO,HIGH,30000);
  Serial.println(d ? String(d*0.0343/2.0) + " cm" : "sem eco");
  delay(300);
}
```

> **Resultado esperado:** abra o Monitor Serial (115200 baud). Ao aproximar e afastar a mão
> do sensor, os números em cm devem mudar de acordo. ✅  **Se não mudar:** confira VCC, GND
> e se TRIG/ECHO estão nos pinos 32/33.

**2. Teste do servo** (só USB). Prova que o servo gira nas três posições.

```cpp
#include <ESP32Servo.h>
Servo s;
void setup() { s.setPeriodHertz(50); s.attach(13, 500, 2400); }
void loop() { s.write(30); delay(1500); s.write(90); delay(1500); s.write(150); delay(1500); }
```

> **Resultado esperado:** o braço do servo deve parar em três ângulos, um após o outro
> (esquerda, centro, direita). ✅  **Se ele tremer ou não completar o giro:** o servo pode
> precisar de mais corrente do que o USB fornece — teste com as pilhas ligadas.

**3. Teste dos motores** (USB + pilhas, **rodas no ar**). Prova que os motores giram no
sentido certo.

```cpp
void setup() {
  int pinos[] = {22,21,23,19,18,5};
  for (int p : pinos) pinMode(p, OUTPUT);
}
void loop() {
  Serial.println("frente");
  digitalWrite(22,HIGH); digitalWrite(21,LOW);
  digitalWrite(19,HIGH); digitalWrite(18,LOW);
  analogWrite(23,200); analogWrite(5,200);
  delay(2000);
  analogWrite(23,0); analogWrite(5,0); delay(500);
}
```

> **Resultado esperado:** os dois motores giram para frente e param, em ciclo. Confirme que
> o motor do lado esquerdo é mesmo o esquerdo. ✅  **Se um girar ao contrário:** troque os
> dois fios daquele motor nos bornes OUT.

Só depois que os **três testes passarem** é que vale gravar o código completo de exploração
e ver o robô inteiro funcionando.

---

## Encerramento da Parte 1

Recapitulando o que você construiu — e, mais importante, **entendeu**:

- ✅ Um robô que **roda no simulador Wokwi** (LEDs indicando a direção da decisão)
- ✅ O **mesmo código** rodando no hardware real (motores + sensor + servo)
- ✅ O robô **explora** o ambiente com movimento que varia sozinho
- ✅ Ele **detecta e desvia** de obstáculos de forma autônoma
- ✅ Você testou **cada peça isoladamente** antes de integrar — a regra de ouro
- ✅ Você entende **por que** cada peça existe e o que ela faz no ciclo

Você não montou um robô seguindo uma receita: você entendeu o **loop perceber → decidir →
agir** que está por trás de praticamente toda a robótica.

Na **Parte 2**, damos um passo atrás para entender uma ideia nova: o que é uma LLM (um
modelo de linguagem) e por que um "cérebro" desses pode caber dentro de um microcontrolador.
Na **Parte 3**, construímos esse cérebro do zero.
