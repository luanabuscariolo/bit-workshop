---
id: codigo-completo
title: "6. O código: completo"
sidebar_position: 6
---

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
