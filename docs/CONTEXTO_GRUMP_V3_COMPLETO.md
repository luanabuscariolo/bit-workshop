# nano-grump v3 — Contexto Completo

> **Documento de transferência de contexto.**  
> Consolida todo o planeamento do grump v3 numa única referência.  
> Projeto: RoverMind / nano-grump — site AxonLabs (Docusaurus)  
> Repositório: `F:\GitHub\RoverMind-nanoGrump\` · GitHub: `luanabuscariolo`  
> Data: 25/08/2026 · Idioma do projeto: português (Brasil)

---

# PARTE A — Onde o projeto estava (v2)

## A.1 Arquitetura v2 — dois microcontroladores

| Microcontrolador | Papel |
|---|---|
| ESP32-WROOM-32 | **Corpo** — navegação, sensores, motores; envia marcadores por UART |
| ESP32-S3 N16R8 | **Cérebro** — inferência do nano-grump, display OLED, olhos expressivos |

Comunicação: corpo transmite em GPIO17 → cérebro recebe em GPIO18, a 9600 baud.

## A.2 Mapa de pinos v2

**Corpo (WROOM-32):** HC-SR04 TRIG=32, ECHO=33 · Servo=13 · L298N ENA=23, IN1=22, IN2=21, IN3=19, IN4=18, ENB=5 · UART TX=17

**Cérebro (ESP32-S3):** OLED CLK=12, MOSI=11, CS=8, DC=9, RES=10 · UART RX=18

## A.3 Modelo nano-grump v2 (inalterado no v3)

| Parâmetro | Valor |
|---|---|
| Arquitetura | mini-GPT character-level |
| Parâmetros | ~215K |
| Binário | ~840 KB |
| n_embd / block_size | 64 / 128 |
| n_layer / n_heads | 4 / 4 |
| Melhor val loss | 1.3971 (step 7000) |
| top_k / temperatura | 4 / 0.75 |
| Offset em flash | 0x110000 (partição `model`) |
| Dataset | 2.491 frases, 8 marcadores |

**Marcadores:** `<start>` `<explore>` `<obstacle>` `<turn_left>` `<turn_right>` `<backup>` `<stuck>` `<clear>`

## A.4 Alimentação v2 (descontinuada)

4× pilhas AA (~6 V) → L298N → 5 V interno → WROOM-32. ESP32-S3 alimentado por USB à parte.

---

# PARTE B — Decisões tomadas para o v3

Esta secção regista **o que mudou e por quê**. É a parte mais importante para retomar o contexto.

## B.1 ⭐ Decisão maior: um único ESP32-S3

**O que mudou:** o ESP32-WROOM-32 sai do projeto. O ESP32-S3 passa a fazer navegação *e* inferência.

**Motivo:** Lu_Vi já dominou a arquitetura de dois chips (objetivo de aprendizagem cumprido) e quer simplificar o hardware.

**O trade-off que foi discutido e aceite:** simplifica o *hardware*, mas complica o *software*. Não é uma simplificação líquida — é um aprendizado novo (FreeRTOS multi-core).

**Como se resolve:** dividir o trabalho entre os dois núcleos do S3.

```
┌─────────────────── ESP32-S3 ───────────────────┐
│                                                  │
│   CORE 0 — "corpo"          CORE 1 — "cérebro"  │
│   ─────────────────         ──────────────────  │
│   lê HC-SR04                inferência do modelo │
│   move servo                escreve no OLED       │
│   controla L298N            toca o buzzer         │
│   monitora bateria          desenha os olhos      │
│   (loop rápido, ~50 ms)     (loop lento, 2–5 s)  │
│           │                          ▲           │
│           └──── fila (queue) ────────┘           │
│         "aconteceu <obstacle>"                   │
└──────────────────────────────────────────────────┘
```

O Core 0 nunca bloqueia. Quando a situação muda, deposita um marcador na fila e continua navegando. O Core 1 retira quando estiver livre.

**Conceitos novos a aprender:** `xTaskCreatePinnedToCore`, `xQueueSend` / `xQueueReceive`.

**Risco a vigiar:** a inferência não pode alocar toda a PSRAM e travar o Core 0.

## B.2 ⭐ Regra de ouro do comportamento

> **O corpo nunca espera o cérebro. O cérebro comenta o que o corpo já fez.**

**Problema no v2:** o corpo decidia a cada ~50 ms; o cérebro levava 2–5 s por frase. Marcadores acumulavam em fila e o grump falava sobre situações já passadas.

**Foi discutido** se o robô deveria esperar a fala terminar antes de agir. **Rejeitado por segurança** — esperar 3–4 s para desviar significa bater na parede.

**Solução em três partes:**

| Mecanismo | Onde | O que faz |
|---|---|---|
| **Cooldown** | Core 0 | Só envia marcador se a situação mudou **e** passaram ~3 s |
| **Preempção** | Core 1 | Se chega marcador novo durante a geração, cancela e recomeça |
| **Sem fila acumulada** | ambos | Só o estado atual importa |

**Prioridade de ação:**

| Ação | Aguarda a fala? |
|---|---|
| Desvio de obstáculo | ❌ Nunca |
| Recuo após obstáculo | ❌ Nunca |
| Escolha de direção de exploração | ✅ Pode |
| Comentário de situação nova | ✅ Pode |

**Cooldown inicial:** 3 s (calibrar nos testes).

## B.3 Alimentação por bateria única

**Componentes que Lu_Vi já tem:**

| Item | Especificação |
|---|---|
| Bateria | 2S 14500, 7,4 V nominal, 500 mAh / 3,7 Wh |
| XL6009 | Módulo boost — **ajustado para ~9 V** ✅ |
| LM2596 | Módulo buck — **ajustado para 5,0 V** ✅ |
| Capacitor | 1000 µF 25 V 105 °C eletrolítico |
| Carregador 2S | Já possui, com controlo de carga (LED indicador) |

**Proteções:** o carregador impede sobrecarga. A bateria provavelmente **não tem BMS** contra descarga profunda — daí o monitor por software (B.4).

**Diagrama de energia:**

```
Bateria 2S 14500 (7,4 V)
     │
     ├── XL6009 (~9 V) ──────→ L298N [12V] ──→ Motores DC (2×)
     │                          (jumper de 5 V REMOVIDO)
     │
     ├── LM2596 (5,0 V) ──┬── Capacitor 1000 µF 25 V
     │                     ├── ESP32-S3 [5V]
     │                     ├── HC-SR04 [VCC]
     │                     ├── Servo SG90 [vermelho]
     │                     └── Buzzer passivo [+]
     │
     └── R1 100k / R2 47k ────→ ESP32-S3 GPIO1 (monitor)
```

**Capacitor — polaridade obrigatória:** perna **longa** = positivo (5 V); perna **curta**, com faixa clara no corpo = negativo (GND). Invertido pode estufar ou estourar.

## B.4 Monitor de bateria por software

**Ideia da própria Lu_Vi** — ler a tensão num pino analógico e parar os motores quando estiver fraca.

**Onde ligar — decisão tomada:** **antes do LM2596, direto na bateria.** Motivo: o regulador mantém 5 V fixos até falhar de repente; medir depois dele não dá aviso prévio.

```
Bateria (+) ──── R1 (100 kΩ) ──┬──→ GPIO 1 do S3 (ADC1)
                                │
                               R2 (47 kΩ)
                                │
                          Nó GND lógica
```

| Bateria | Tensão no GPIO 1 |
|---|---|
| 8,4 V (cheia) | 2,68 V |
| 7,4 V (nominal) | 2,37 V |
| 6,2 V (limite) | 1,98 V |
| 6,0 V (crítico) | 1,92 V |

**Ao detectar < 6,2 V:** motores param · buzzer emite bips lentos e graves · display mostra mensagem do grump.

> ⚠️ Usar pinos do **ADC1** (GPIO 1–10). O ADC2 conflita com o rádio/WiFi.

## B.5 Buzzer passivo (nova feature)

**Decisão:** passivo, não ativo. Lu_Vi tem os dois.

**Motivo:** o passivo recebe PWM e a frequência define a nota — permite sons com personalidade e é mais didático (ensina `tone()`/PWM). O ativo só faz um bip fixo.

**Sons planejados:**

| Marcador | Som |
|---|---|
| `<start>` | Melodia curta ascendente (boot) |
| `<obstacle>` | Tom grave descendente |
| `<stuck>` | Bips rápidos e irritados |
| `<clear>` | Tom suave ascendente |
| Bateria fraca | Bips lentos e graves |

## B.5b LEDs de estado (nova feature)

**Decisão:** 6 LEDs indicando o estado do robô — 2 verdes, 2 vermelhos, 2 amarelos.

**Motivo:** resgata a lógica da simulação Wokwi do v2 (onde LEDs representavam os motores), tornando o comportamento legível de fora e rendendo boas fotos para o tutorial.

**Layout — montar como um veículo:**

```
        FRENTE
    🟢         🟢     ← verdes (esquerdo / direito)
    ┌───────────┐
    │  🟡 OLED 🟡 │   ← amarelos ladeando o display
    └───────────┘
    🔴         🔴     ← vermelhos (esquerdo / direito)
        TRÁS
```

Aproveitar o par esquerda/direita dá **pisca-pisca de graça**, sem LEDs adicionais.

**Comportamento:**

| Ação | Verdes | Vermelhos |
|---|---|---|
| Seguir em frente | ambos acesos | — |
| Virar à esquerda | esquerdo pisca | — |
| Virar à direita | direito pisca | — |
| Parar | — | ambos acesos |
| Ré | — | ambos piscam |

**Os amarelos — indicador de "cérebro pensando":**

Pulsam (PWM, efeito de respiração) enquanto o **Core 1** está gerando a frase; apagam quando termina.

**Por que isto importa:** torna **visível a arquitetura dual-core**, que é o conceito mais abstrato do projeto. Vê-se o robô desviando de um obstáculo *com os amarelos acesos* — os dois núcleos trabalhando em simultâneo. Difícil de explicar em texto, óbvio numa foto.

> ⚠️ O amarelo é **independente dos marcadores** — reflete o estado do Core 1, não a situação de navegação.

**Truque de economia de pinos:** os dois amarelos ligam ao **mesmo GPIO**, em paralelo, cada um com o seu próprio resistor de 220 Ω. Consumo total ~12 mA (limite do pino: 40 mA). Resultado: 6 LEDs em apenas 5 pinos.

**Tabela de estados completa:**

| Marcador | Verdes | Vermelhos | Amarelos |
|---|---|---|---|
| `<start>` | — | — | pulsa* |
| `<explore>` | acesos | — | pulsa* |
| `<obstacle>` | — | acesos | pulsa* |
| `<turn_left>` | esq. pisca | — | pulsa* |
| `<turn_right>` | dir. pisca | — | pulsa* |
| `<backup>` | — | piscam | pulsa* |
| `<stuck>` | — | piscam | pulsa* |
| `<clear>` | acesos | — | pulsa* |

\* Independente do marcador — segue o estado do Core 1.

**Impacto no circuito:** baixo. 5 sinais novos + 6 resistores de 220 Ω (já disponíveis) + cátodos no nó GND lógica. Corrente total ~30 mA, desprezível.

## B.6 Divisor de proteção do ECHO (correção de bug do v2)

O HC-SR04 emite 5 V no pino ECHO; o GPIO do S3 tolera 3,3 V. **No v2 isto não existia** — funcionava porque o WROOM-32 é mais tolerante, mas era risco.

```
ECHO do sensor ──── R3 (1 kΩ) ──┬──→ GPIO 5 do S3
                                 │
                                R4 (2 kΩ)
                                 │
                            Nó GND lógica
```

**Cálculo:** 5 V × 2/(1+2) = **3,33 V** ✅

> 💡 Lu_Vi já tem resistências de 1 kΩ — usar **duas em série** no lugar da de 2 kΩ. Não precisa comprar.

## B.7 Montagem sem protoboard no robô

**Decisão:** ligações diretas e nós de junção soldados. Sem protoboard completa no chassi.

**Sub-decisão sobre os barramentos:** Lu_Vi propôs usar apenas a faixa de alimentação de uma protoboard recortada como barramento. **Aceite parcialmente:**

| Nó | Método | Motivo |
|---|---|---|
| GND lógica | Barramento de protoboard ✅ | Corrente baixa, fácil de refazer |
| 5 V lógica | Barramento de protoboard ✅ | Corrente baixa, fácil de refazer |
| GND potência | Solda ou borne parafusado | Corrente alta + vibração |
| Bateria + | Solda ou borne parafusado | Corrente alta + vibração |

**Limitações da protoboard no lado de potência:** contactos de mola suportam ~1 A (motores no arranque excedem) e afrouxam com a vibração do robô em movimento.

> ⚠️ Muitas protoboards têm as faixas de alimentação **interrompidas ao meio** — verificar a quebra na linha impressa e fazer ponte se necessário.

## B.8 Placa adaptadora para o ESP32-S3

**Decisão:** Lu_Vi vai fabricar a própria placa adaptadora em vez de comprar. Já tem a placa perfurada.

**Objetivo:** soquetar o S3 (não soldar) com réguas de pinos fêmea, e usar blocos de terminais de parafuso para as ligações laterais.

> ⚠️ **Passo obrigatório antes de soldar:** medir a distância entre as duas fileiras de pinos do S3 encaixando as réguas sem soldar e apoiando sobre a placa perfurada. Placas S3 variam entre fabricantes; dessoldar 42 pinos é trabalho ingrato.

## B.9 Desmontagem total e remontagem fotografada

**Decisão de processo:** Lu_Vi vai desmontar o robô por completo e remontar passo a passo, fotografando cada etapa, para produzir material didático próprio para o site AxonLabs.

**Implicação:** cada etapa da montagem precisa de instruções detalhadas de conexão + sugestões de foto.

---

# PARTE C — Hardware do v3

## C.1 Placa confirmada por foto

**ESP32-S3-DevKitC-1 (clone) com módulo ESP32-S3-WROOM-1 N16R8** — 16 MB flash, 8 MB PSRAM octal, dual-core, 2× USB-C.

**Pinos expostos:**
- Lado esquerdo: `3V3` `3V3` `RST` `4` `5` `6` `7` `15` `16` `17` `18` `8` `3` `46` `9` `10` `11` `12` `13` `5V` `GND`
- Lado direito: `GND` `TX` `RX` `1` `2` `42` `41` `40` `39` `38` `37` `36` `35` `0` `45` `48` `47` `21` `20` `GND` `GND`

> ⚠️ **O GPIO14 não existe nesta placa.** Uma sugestão inicial de usá-lo para o buzzer foi corrigida para GPIO 7.

## C.2 Mapa de pinos definitivo — ESP32-S3

| GPIO | Componente | Tipo |
|---|---|---|
| 1 | Monitor de bateria | ADC1 (entrada analógica) |
| 4 | HC-SR04 TRIG | saída digital |
| 5 | HC-SR04 ECHO | entrada (via divisor) |
| 6 | Servo SG90 | PWM |
| 7 | Buzzer passivo | PWM |
| 8 | OLED CS | SPI |
| 9 | OLED DC | SPI |
| 10 | OLED RES | SPI |
| 11 | OLED MOSI | SPI |
| 12 | OLED CLK | SPI |
| 13 | L298N ENB | PWM |
| 15 | L298N ENA | PWM |
| 16 | L298N IN1 | saída digital |
| 17 | L298N IN2 | saída digital |
| 18 | L298N IN3 | saída digital |
| 21 | L298N IN4 | saída digital |
| 2 | LED vermelho direito | saída digital |
| 39 | LEDs amarelos (2× paralelo) | PWM |
| 40 | LED verde esquerdo | saída digital |
| 41 | LED verde direito | saída digital |
| 42 | LED vermelho esquerdo | saída digital |

**Pinos proibidos:**

| GPIO | Motivo |
|---|---|
| 35, 36, 37 | PSRAM octal (usada pelo modelo) |
| 43, 44 | Serial USB de debug |
| 0 | Botão BOOT (strapping) |
| 45, 46 | Strapping — instáveis no boot |
| 38, 48 | LED RGB embutido |
| 19, 20 | USB nativo |

**Livres para expansões:** 3, 47

> 💡 Os pinos do OLED (8–12) foram **mantidos idênticos ao v2** — o firmware do display não precisa mudar.

## C.3 Lista de componentes

### Microcontrolador
**ESP32-S3-DevKitC-1 N16R8** — único chip do robô. Alimentado pelo pino 5V.

### Sensores
**HC-SR04** — sensor ultrassónico, 2–400 cm, 5 V. É o "olho" do grump. ECHO precisa de divisor.

### Atuadores
- **2× motores DC TT** com caixa de redução (~1:48, 3–9 V) — tração das rodas
- **Servo SG90** — 0–180°, 4,8–6 V, marrom=GND / vermelho=VCC / laranja=sinal. Gira o sensor para varrer
- **Buzzer passivo** — voz sonora do grump, controlado por PWM

### Driver
**L298N** — ponte H, 2 canais, até 2 A/canal.
> ⚠️ Remover jumper de 5 V **e** jumpers de ENA/ENB. O terminal 5V não recebe nada.

### Indicadores luminosos
**6 LEDs + 6 resistores de 220 Ω** — 2 verdes (frente/curvas), 2 vermelhos (parar/ré), 2 amarelos (cérebro pensando). Cátodo (perna curta) no nó GND lógica. Os amarelos partilham o mesmo GPIO em paralelo, cada um com o seu resistor.

### Display
**OLED SH1106 1,3" SPI** — 128×64, 3,3–5 V. Rosto do grump: 9 estados de olhos + frases palavra a palavra. VCC no 3V3 do S3.

### Alimentação
Bateria 2S 14500 · XL6009 (~9 V) · LM2596 (5 V) · capacitor 1000 µF 25 V · resistências dos divisores.

### Estrutura
Chassi 2WD · 2 rodas · roda boba · fios · parafusos e espaçadores · carregador 2S.

### Ferramentas
Multímetro · chave de fenda pequena (trimpots) · ferro de solda + estanho · alicate de corte · termorretrátil · computador com Arduino IDE.

---

# PARTE D — Fiação

## D.1 Os quatro nós

| Nó | Tensão | Reúne |
|---|---|---|
| Bateria + | 7,4 V | Entradas dos reguladores e do monitor |
| 5 V lógica | 5 V | S3, sensor, servo, buzzer, capacitor |
| GND potência | 0 V | Bateria, reguladores, L298N, capacitor |
| GND lógica | 0 V | S3, display, sensor, servo, buzzer, divisores |

> ⚠️ O **3,3 V não é nó** — só o OLED consome. É fio direto do pino 3V3 até ele.

## D.2 Aterramento em estrela

Juntar 14 fios de GND num ponto só faria a corrente ruidosa dos motores atravessar o caminho da lógica (leituras erradas, reinicializações). Solução: dois sub-nós unidos por **um único fio grosso e curto**.

```
   NÓ GND POTÊNCIA (7)              NÓ GND LÓGICA (8)
   ────────────────────             ─────────────────
   Bateria −                        ESP32-S3 GND
   XL6009 IN−                       OLED GND
   XL6009 OUT−                      HC-SR04 GND
   LM2596 IN−                       Servo (fio marrom)
   LM2596 OUT−                      Buzzer −
   L298N GND                        Divisor da bateria (R2)
   Capacitor − (perna curta)        Divisor do ECHO (R4)
                                    Cátodos dos 6 LEDs
            │                                │
            └────── fio grosso ──────────────┘
```

## D.3 Ligações por nó

**Nó bateria + (4 pontos):** bateria positivo (entra) · XL6009 IN+ · LM2596 IN+ · divisor R1 (100 kΩ)

**Nó 5 V lógica (5 pontos):** LM2596 OUT+ (entra) · S3 pino 5V · HC-SR04 VCC · servo vermelho · capacitor perna longa

**Potência dos motores:** XL6009 OUT+ → L298N [12V] · L298N OUT1/OUT2 → motor esquerdo · OUT3/OUT4 → motor direito

## D.4 Contagem de fios

| Trecho | Fios |
|---|---|
| S3 → componentes (GPIO) | 21 |
| S3 → alimentação (5V, 3V3, GND) | 3–4 |
| Nó bateria + | 3 saídas |
| Nó 5 V | 4 saídas |
| Nó GND potência | 7 |
| Nó GND lógica | 7 |
| Ponte entre nós de GND | 1 |
| XL6009 → L298N | 1 |
| L298N → motores | 4 |
| Divisores (internos) | 4 |
| LEDs → nó GND lógica | 6 |
| **TOTAL** | **~62 fios** |

> 💡 Comprar 60–70 jumpers para cobrir erros e refazimentos.

## D.5 Boas práticas

- Separar fisicamente fios de potência dos de sinal
- Fios curtos nas ligações de potência
- Soldar e isolar com termorretrátil
- Código de cores: vermelho = positivo, preto = GND, outras = sinal
- Deixar o S3 acessível para o cabo USB de gravação

---

# PARTE E — Roteiro de montagem

## Regra de ouro

> **Monte uma peça. Teste essa peça sozinha. Só então passe para a próxima.**

## Segurança permanente

- ⚡ Montar sempre com a bateria desconectada
- 🔌 Conferir polaridade antes de energizar
- 🛞 Rodas no ar em todo teste com motores
- 👃 Desligar ao primeiro sinal de cheiro, estalo ou aquecimento
- 🔋 Nunca ligar a bateria direto em nenhum ESP32 ou sensor

## Etapas

| # | Etapa | Valida | Status |
|---|---|---|---|
| 0 | Documentação inicial — fotos de todos os componentes | — | ⬜ |
| 1 | Calibrar XL6009 (~9 V) e LM2596 (5 V) | Reguladores | ✅ **FEITO** |
| 2 | Alimentar o S3 pela bateria, sem USB | Boot | ⬜ ← **próxima** |
| 3 | Display OLED (pinos 8–12) | Saída visual | ⬜ |
| 4 | HC-SR04 + divisor do ECHO | Sensor | ⬜ |
| 5 | Servo SG90 (GPIO 6) | Varredura | ⬜ |
| 6 | Buzzer passivo (GPIO 7) | Notas distintas | ⬜ |
| 6b | LEDs de estado (GPIO 2, 39, 40, 41, 42) | Acendimento | ⬜ |
| 7 | Motores + L298N (jumpers removidos) | Movimento | ⬜ |
| 8 | Capacitor 1000 µF no trilho 5 V | Estabilidade | ⬜ |
| 9 | Monitor de bateria (bloqueado: faltam resistências) | Leitura ADC | ⬜ |
| 10 | Montagem no chassi | Estrutura | ⬜ |
| 11 | Firmware integrado (dual-core) | Sistema | ⬜ |
| 12 | Ajuste fino | Calibração | ⬜ |
| 13 | Atualizar tutorial Docusaurus | Site | ⬜ |

## Notas por etapa

**Etapa 1 (concluída):** trimpot no sentido horário diminui a tensão. Medições reais: bateria 7,8 V · XL6009 vinha de fábrica em 25,2 V · LM2596 vinha em 7,3 V. Ambos ajustados e trimpots marcados.

**Etapa 3:** se a tela ficar em branco ou com chuvisco, conferir primeiro RES, depois CS.

**Etapa 5:** se o servo tremer ou o S3 reiniciar, é queda de tensão — o capacitor da Etapa 8 resolve. Anotar e prosseguir (rende boa explicação didática no tutorial).

**Etapa 6:** se sair sempre o mesmo som independente da frequência, o buzzer é ativo — trocar pelo passivo.

**Etapa 6b:** testar cada LED isoladamente antes de ligar à lógica de navegação. Conferir a polaridade — perna longa (ânodo) para o resistor/GPIO, perna curta (cátodo) para o GND. Sem resistor o LED queima.

**Etapa 7:** se uma roda gira ao contrário, inverter os dois fios daquele motor.

**Etapa 9:** o ADC do ESP32 não é perfeitamente linear. Comparar com o multímetro e aplicar fator de calibração se houver desvio constante.

**Etapa 10 — ordem de fixação:** motores → rodas → roda boba → L298N (perto dos motores) → bateria (peso central e baixo) → XL6009 e LM2596 → S3 (acessível para USB) → servo + HC-SR04 na frente → OLED visível → LEDs (verdes à frente, vermelhos atrás, amarelos ladeando o OLED) → buzzer sem abafamento.

**Etapa 11 — teste:** sempre com rodas no ar primeiro. Aproximar a mão do sensor, confirmar que a frase corresponde à situação atual e que os sons batem com os marcadores.

**Etapa 12 — o que calibrar:** cooldown (começar em 3 s) · distância de detecção (~20 cm) · velocidade dos motores · limiar de bateria fraca (6,2 V).

**Etapa 13 — o que atualizar no site:**
- Parte 1 — novo esquema de alimentação + buzzer + LEDs de estado
- Parte 4 — arquitetura dual-core, cooldown e preempção
- Parte 5 — mapa de pinos e ficha técnica de energia
- Todas — remoção das referências ao ESP32-WROOM-32

## Checklist antes de energizar

- [ ] XL6009 medido em ~9 V
- [ ] LM2596 medido em ~5 V
- [ ] Jumper de 5 V do L298N removido
- [ ] Jumpers de ENA/ENB removidos
- [ ] Terminal 5V do L298N sem nada
- [ ] Capacitor com polaridade correta
- [ ] Divisor do ECHO instalado antes do GPIO 5
- [ ] Divisor da bateria instalado antes do GPIO 1
- [ ] Todos os 6 LEDs com resistor de 220 Ω em série
- [ ] Polaridade dos LEDs conferida (perna longa = ânodo)
- [ ] Todos os GND interligados (teste de continuidade)
- [ ] Sem curto entre 5 V e GND (teste de continuidade)
- [ ] Bateria carregada
- [ ] Rodas no ar

---

# PARTE F — Compras

## F.1 O que falta comprar

| Item | Referência | Qtd | Onde |
|---|---|---|---|
| Resistência 100 kΩ | **R1/4W100K** | 10 | Radipeças (0,07€) |
| Resistência 47 kΩ | **R1/4W47K** | 10 | Radipeças (0,07€) |
| Régua pinos fêmea 1x40 2,54 mm | **RIM40D** | 2 | Servelec |
| Régua pinos macho 1x40 2,54 mm | Male Header 2.54mm | 3 | Servelec / Mixtronica |
| Bloco terminais 2 vias 5 mm | **KF301-2P** / **LP2C50AZ** | 6 | TecnoMartins |
| Bloco terminais 3 vias 5 mm | **KF301-3P** | 2 | — |
| Bloco terminais 2,54 mm | **KF128-2P** | 4 | — |
| Jumpers Dupont (kit F-F, M-F, M-M) | — | 1 kit | — |
| Placa perfurada 7×9 cm ou maior | Perfboard / Universal PCB | 1 | (já tem) |

> 💡 **Resistências de 220 Ω para os LEDs:** 6 unidades — Lu_Vi já tem.

> 💡 **Resistência de 2 kΩ não é necessária** — usar duas de 1 kΩ em série (Lu_Vi já tem).

## F.2 Notas sobre fornecedores

- **Radipeças** (Almada, PT) — tem as resistências. Catálogo focado em reparação de eletrodomésticos, áudio/vídeo e informática; **não tem** réguas de pinos nem blocos de terminais para PCB.
- **Servelec** — RIM40D: régua 40 pinos fêmea, passo 2,54 mm, THT, corrente máxima 3 A, altura 8,5 mm.
- **TecnoMartins** — LP2C50AZ: bloco 2 terminais com parafuso 1,5 mm², passo 5,0 mm para PCB.
- Outras opções PT: Mixtronica, Aquário Electrónica (Porto/Braga), Electrónica Embajadores (ref. CTO1HR40).

> ⚠️ **Cuidado com nomenclatura:** referências que começam por `RF` na Radipeças são **resistências fusíveis** (componente de proteção), não servem para divisores. As de carvão começam por `R1/4W`.

> ⚠️ A RIM40D suporta 3 A — suficiente para sinais, mas **não** passar alimentação de motores por régua de pinos. Usar blocos de parafuso.

---

# PARTE G — Backlog

## Resolvido no v3

| Item | Como |
|---|---|
| Enfileiramento de marcadores | Cooldown + preempção (B.2) |
| Autonomia de energia | Bateria única + reguladores (B.3) |
| ECHO sem proteção de tensão | Divisor 1k/2k (B.6) |

## Pendente (pós-v3)

- Refinar dataset — respostas fracas para `<clear>` e `<stuck>`
- Animações de transição entre estados de olhos
- Versão inglesa do tutorial (adiada explicitamente)
- Backlog do site Docusaurus: personalização da navbar, limpeza do footer, decisão sobre o blog ("Diário de bordo"), nomenclatura da plataforma, paleta de cores (teal `#0F6E56`, roxo `#534AB…`), revisão de conteúdo para iniciantes absolutos

---

# PARTE H — Convenções do projeto

- **Idioma:** sempre português (Brasil)
- **Marcação de alterações no código:** `# [ADICIONADO]`, `# [ALTERADO]`, `# [REMOVIDO]` (ou `//` em C/TS)
- **Correções pequenas:** dizer exatamente o que mudar, em vez de regenerar ficheiros inteiros
- **Não gerar** ficheiros de dados (vocab.json, .pt, .bin) — apenas código-fonte
- **Não reutilizar** código de outros repositórios — construir do zero pelo valor pedagógico
- **Formato didático:** (1) ideia numa frase → (2) analogia do dia a dia → (3) exemplo concreto com números pequenos → (4) diagrama → (5) código comentado → (6) frase-resumo
- **Separação de escopo:** engenharia e produção de tutorial em conversas separadas
- **Ambiente:** Windows · Python com `uv` · repos em `F:\GitHub\` · RTX 4050 (CUDA) · PyTorch 2.13.0+cu130 · Arduino IDE + `arduino-cli` · esptool 5.3.1 · FQBN `esp32:esp32:esp32s3` · U8g2 para o display · Wokwi para simulação
- **Site:** Docusaurus 3.x (TypeScript), pasta local `rovermind-course`, repo `rovermind-nanogrump-course`, publicado em `https://luanabuscariolo.github.io/rovermind-nanogrump-course/`

---

# PARTE I — Estado atual e próximo passo

**Concluído:** Etapa 1 — XL6009 e LM2596 calibrados e trimpots marcados.

**Próximo passo imediato:** Etapa 2 — ligar o LM2596 ao pino 5V do S3 e confirmar que a placa arranca sem cabo USB.

**Em paralelo:** Etapa 0 — sessão de fotos de todos os componentes para o material do AxonLabs.

**Bloqueado:** Etapa 9 (monitor de bateria) até chegarem as resistências de 100 kΩ e 47 kΩ.

**Pendente de decisão:** layout da placa adaptadora — onde posicionar o soquete do S3, os blocos de terminais e os barramentos.

---

*Documento de contexto consolidado — projeto RoverMind / nano-grump, AxonLabs.*
