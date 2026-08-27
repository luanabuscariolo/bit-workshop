---
id: display-oled
title: "6. O display OLED"
sidebar_position: 6
---

O robô usa um display OLED **SH1106 128×64** (SPI) para mostrar as frases. A biblioteca
é a **U8g2**. Pinos confirmados no hardware: CLK=12, MOSI=11, CS=8, DC=9, RES=10.

```cpp
#include <U8g2lib.h>
U8G2_SH1106_128X64_NONAME_F_4W_HW_SPI display(U8G2_R0, /*cs=*/8, /*dc=*/9, /*reset=*/10);

void setup() {
  display.begin();
  display.clearBuffer();
  display.setFont(u8g2_font_6x10_tf);
  display.drawStr(0, 12, "nano-grump v2");
  display.sendBuffer();
}
```

Conforme o modelo gera cada caractere, o firmware acumula a frase e a envia ao display,
quebrando em linhas. Assim a reclamação sarcástica aparece na telinha do robô.

---
