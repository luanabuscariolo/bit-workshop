---
id: comunicacao
title: "7. A comunicação entre os cérebros"
sidebar_position: 7
---

O sistema final tem **dois microcontroladores** com papéis distintos:

- **ESP32-WROOM-32 (o corpo)** — cuida dos sensores e da navegação (o mesmo do Curso 1 — Robô Autônomo). Ele
  sabe quando bateu num obstáculo, quando ficou preso, etc.
- **ESP32-S3 (o cérebro)** — roda a LLM e o display. Ele sabe gerar as frases.

O corpo não precisa saber gerar frases; ele só manda a **etiqueta da situação** (o
marcador) para o cérebro. O cérebro recebe, gera a frase e mostra no display:

```
corpo detecta obstáculo
      │
      │  envia "<obstacle>" pela Serial/UART
      ▼
cérebro recebe o marcador
      │
      │  roda a inferência (gera caractere por caractere)
      ▼
"A wall. Again. Wow." aparece no display
```

No firmware do cérebro, o `loop()` fica escutando a Serial. Quando chega um marcador
(começando com `<`), ele dispara a geração:

```cpp
void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      if (input_len > 0) {
        input_buf[input_len] = '\0';
        if (input_buf[0] == '<') {           // é um marcador?
          char prompt[34];
          snprintf(prompt, sizeof(prompt), "%s ", input_buf);
          gerar(prompt);                     // gera e exibe a frase
        }
        input_len = 0;
      }
    } else if (input_len < 31) {
      input_buf[input_len++] = c;
    }
  }
}
```

Para testar sem o robô inteiro montado, basta abrir o Monitor Serial do ESP32-S3 e
digitar um marcador (`<obstacle>`, `<stuck>`, etc.). A frase aparece na Serial e no
display — exatamente como apareceria vinda do corpo.

> **A ligação física entre os dois:** conecta-se o pino TX do WROOM-32 ao RX do S3 (e
> os GNDs unidos). O corpo envia o texto do marcador; o cérebro escuta. É a mesma
> comunicação Serial que você usa entre o PC e a placa, só que entre duas placas.

---

## Encerramento deste curso

Você levou o cérebro do PC para o hardware:

- ✅ Exportou os pesos do PyTorch para um `.bin` legível pelo C
- ✅ Gravou o `.bin` na flash do ESP32-S3 (partição `model`, `0x110000`)
- ✅ Leu o cabeçalho no firmware (a ponte Python → C confirmada)
- ✅ Entendeu a inferência em C (as mesmas peças do Curso 2 — IA num Chip, traduzidas)
- ✅ Integrou o display OLED
- ✅ Montou a comunicação entre corpo (WROOM-32) e cérebro (ESP32-S3)

O resultado é um robô autônomo com personalidade: ele explora, detecta obstáculos,
e **reclama sarcasticamente** na telinha — com um modelo de linguagem que você
construiu, treinou e embarcou, entendendo cada peça do caminho. 🎉

> **Nota de honestidade técnica.** O firmware de inferência é a parte mais avançada e
> costuma exigir ajustes finos (alinhamento exato dos pesos, detalhes do LayerNorm,
> desempenho). Se algo não gerar texto coerente de primeira, é normal — depura-se uma
> peça de cada vez, começando pelo cabeçalho (que já validamos) e seguindo função por
> função. A jornada de entender cada etapa é o que torna esse ajuste possível.


---
