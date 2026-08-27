---
id: testando-por-partes
title: "10. Testando por partes"
sidebar_position: 10
---

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

## Encerramento deste curso

Recapitulando o que você construiu — e, mais importante, **entendeu**:

- ✅ Um robô que **roda no simulador Wokwi** (LEDs indicando a direção da decisão)
- ✅ O **mesmo código** rodando no hardware real (motores + sensor + servo)
- ✅ O robô **explora** o ambiente com movimento que varia sozinho
- ✅ Ele **detecta e desvia** de obstáculos de forma autônoma
- ✅ Você testou **cada peça isoladamente** antes de integrar — a regra de ouro
- ✅ Você entende **por que** cada peça existe e o que ela faz no ciclo

Você não montou um robô seguindo uma receita: você entendeu o **loop perceber → decidir →
agir** que está por trás de praticamente toda a robótica.

No **Curso 2 — IA num Chip**, damos um passo atrás para entender uma ideia nova: o que é uma LLM (um
modelo de linguagem) e por que um "cérebro" desses pode caber dentro de um microcontrolador.
No **Curso 2 — IA num Chip**, construímos esse cérebro do zero.
