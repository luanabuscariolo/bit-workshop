---
id: gravar-flash
title: "3. Gravar na flash"
sidebar_position: 3
---

### As partições da flash

A flash do ESP32-S3 (16 MB) é dividida em **regiões** (partições), como um HD. Um
arquivo `partitions.csv` define essas regiões. A que nos interessa é a `model`, no
endereço `0x110000`, com 14,9 MB — onde o `nano-grump.bin` (~840 KB) cabe folgado.

![Partições da flash e comunicação](/img/parte-4_fig03_particoes_da_flash_e_comunicacao.png)

**Conteúdo do `partitions.csv`:**

```csv
# Name,   Type, SubType, Offset,   Size
nvs,      data, nvs,     0x9000,   0x5000
factory,  app,  factory, 0x10000,  0x100000
model,    data, 0x40,    0x110000, 0xEF0000
coredump, data, coredump,0xFF0000, 0x10000
```

### Gravando o .bin com esptool

Conecte o ESP32-S3, segure o botão **BOOT**, e rode (troque `COM12` pela sua porta):

```bash
python -m esptool --chip esp32s3 --port COM12 write-flash 0x110000 nano-grump.bin
```

Você deve ver ao final: **`Hash of data verified`** — os bytes chegaram íntegros no
endereço `0x110000`. Fazemos isso **antes** de qualquer firmware: se algo der errado,
sabemos que foi na gravação dos dados, não no código.

### Configurando o Arduino IDE

Para o firmware enxergar a partição `model`, o Arduino IDE precisa usar o
`partitions.csv` customizado:

1. Coloque o `firmware.ino` e o `partitions.csv` **na mesma pasta**, e essa pasta
   deve ter o **mesmo nome do `.ino`** (ex: `firmware/firmware.ino`).
2. Em `Ferramentas → Partition Scheme`, selecione **Custom** (essa opção só aparece
   quando há um `partitions.csv` na pasta do sketch).
3. Confirme também: Placa = **ESP32S3 Dev Module**, PSRAM = **OPI PSRAM**,
   Flash Size = **16MB**.

> **Pegadinha comum:** o `.ino` precisa estar direto na pasta de mesmo nome
> (`firmware/firmware.ino`), não numa subpasta aninhada. Se o upload continuar indo
> para `0x10000` com esquema padrão, é sinal de que o Arduino IDE não achou o
> `partitions.csv`. E note: o **firmware** sempre vai para `0x10000` (partição
> `factory`); os **pesos** ficam em `0x110000` (partição `model`). Os dois coexistem.

### Firmware mínimo: ler o cabeçalho (teste da peça isolada)

Antes da inferência, um firmware que só lê o cabeçalho e imprime os 6 números —
para confirmar que a base está certa (a regra de ouro: testar uma peça de cada vez).

```cpp
#include "esp_partition.h"

struct __attribute__((packed)) Cabecalho {
  int vocab_size, n_embd, block_size, n_layer, n_heads, reservado;
};

void setup() {
  Serial.begin(115200); delay(1500);

  // Encontrar a partição "model"
  const esp_partition_t *part = esp_partition_find_first(
    ESP_PARTITION_TYPE_DATA, (esp_partition_subtype_t)0x40, "model");
  if (!part) { Serial.println("ERRO: particao 'model' nao encontrada."); return; }
  Serial.printf("Particao: %.1f MB @ 0x%x\n", part->size/1048576.0, part->address);

  // Mapear na memória e ler os primeiros 24 bytes como Cabecalho
  const void *base; esp_partition_mmap_handle_t h;
  esp_partition_mmap(part, 0, part->size, ESP_PARTITION_MMAP_DATA, &base, &h);
  const Cabecalho *cab = (const Cabecalho *)base;

  Serial.printf("vocab_size=%d n_embd=%d block_size=%d n_layer=%d n_heads=%d\n",
    cab->vocab_size, cab->n_embd, cab->block_size, cab->n_layer, cab->n_heads);
}
void loop() {}
```

Grave e abra o Monitor Serial (115200 baud). Você deve ver
`vocab_size=59 n_embd=64 block_size=128 n_layer=4 n_heads=4`. Se bater, a ponte
Python → C está funcionando.

---
