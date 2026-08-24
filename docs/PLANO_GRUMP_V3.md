# nano-grump v3 — Plano Completo

> Documento gerado em: 24/08/2026  
> Projeto: RoverMind / nano-grump  
> Repositório: `F:\GitHub\RoverMind-nanoGrump\`  
> GitHub: `luanabuscariolo`

---

## 1. Estado atual — grump v2

### Arquitetura de dois microcontroladores

| Microcontrolador | Função |
|---|---|
| ESP32-WROOM-32 (corpo) | Navegação autônoma, sensores, motores, envia marcadores via UART |
| ESP32-S3 N16R8 (cérebro) | Inferência do modelo nano-grump, display OLED, olhos expressivos |

### Mapa de pinos — corpo (WROOM-32)

| Componente | GPIO |
|---|---|
| HC-SR04 TRIG | 32 |
| HC-SR04 ECHO | 33 |
| Servo SG90 PWM | 13 |
| L298N ENA | 23 |
| L298N IN1 | 22 |
| L298N IN2 | 21 |
| L298N IN3 | 19 |
| L298N IN4 | 18 |
| L298N ENB | 5 |
| UART TX → cérebro | 17 |

### Mapa de pinos — cérebro (ESP32-S3)

| Componente | GPIO |
|---|---|
| OLED SH1106 CLK | 12 |
| OLED SH1106 MOSI | 11 |
| OLED SH1106 CS | 8 |
| OLED SH1106 DC | 9 |
| OLED SH1106 RES | 10 |
| UART RX ← corpo | 18 |

### Marcadores UART (8 situações)

`<start>` `<explore>` `<obstacle>` `<turn_left>` `<turn_right>` `<backup>` `<stuck>` `<clear>`

### Modelo nano-grump v2

| Parâmetro | Valor |
|---|---|
| Arquitetura | Character-level mini-GPT |
| Parâmetros | ~215K |
| Tamanho binário | ~840KB |
| n_embd | 64 |
| block_size | 128 |
| n_layer | 4 |
| n_heads | 4 |
| Melhor val loss | 1.3971 (step 7000) |
| top_k | 4 |
| temperatura | 0.75 |
| Offset flash | 0x110000 (partição `model`) |

### Alimentação v2 (substituída no v3)

- 4× pilhas AA (~6V) → L298N → 5V interno → ESP32 WROOM-32
- ESP32-S3 alimentado por USB separado

---

## 2. O que muda no v3

| Item | v2 | v3 |
|---|---|---|
| Fonte de energia | 4× pilhas AA + USB | 1× bateria 2S 14500 (7,4V / 500mAh) |
| Regulação motores | Regulador interno do L298N | XL6009 boost → ~9V → L298N |
| Regulação lógica | Saída 5V do L298N | LM2596 buck → 5V limpo |
| Estabilização | Nenhuma | Capacitor 1000µF 25V no trilho 5V |
| Proteção da bateria | N/A | BMS embutido na bateria + monitor por software |
| Jumper 5V do L298N | Colocado | **Removido** |
| Som | Nenhum | Buzzer passivo (WROOM-32) |
| Monitor de bateria | Nenhum | Divisor de tensão + GPIO analógico + código |
| Enfileiramento de falas | Presente (bug) | Corrigido com cooldown + preempção |
| Coerência fala/ação | Não garantida | Corpo age imediatamente, cérebro comenta depois |

---

## 3. Nova arquitetura de hardware

### Diagrama de energia

```
Bateria 2S 14500 (7,4V / 500mAh) — BMS embutido
        │
        ├─── XL6009 (boost ~9V) ──────────→ L298N pino 12V (motores)
        │                                    L298N sem jumper de 5V
        │
        ├─── LM2596 (buck 5V)  ──→ ═╦═ Capacitor 1000µF 25V
        │                            ├── ESP32-WROOM-32 (VIN)
        │                            ├── ESP32-S3 (VIN)
        │                            ├── HC-SR04
        │                            ├── Servo SG90
        │                            └── Buzzer passivo
        │
        └─── R1/R2 (divisor de tensão) ──→ GPIO analógico WROOM-32
```

> ⚠️ Todos os GNDs unidos em um ponto comum — regra de ouro mantida.

### Novos componentes adicionados no v3

| Componente | Especificação | Função |
|---|---|---|
| Bateria | 2S 14500 / 7,4V / 500mAh / BMS embutido | Fonte única para todo o robô |
| XL6009 | Módulo boost | Eleva 7,4V → ~9V para os motores |
| LM2596 | Módulo buck | Reduz 7,4V → 5V para a lógica |
| Capacitor | 1000µF 25V 105° eletrolítico | Estabiliza trilho 5V contra picos de corrente |
| Buzzer passivo | — | Som sincronizado com os marcadores |
| R1 | 100kΩ | Divisor de tensão para monitor de bateria |
| R2 | 47kΩ | Divisor de tensão para monitor de bateria |

> ⚠️ **R1 e R2 ainda precisam ser comprados.** Os resistores disponíveis (1kΩ, 10kΩ, 220Ω) não formam combinações adequadas para a faixa de leitura do ESP32.

### Divisor de tensão — monitor de bateria

```
Bateria (+) ──── R1 (100kΩ) ──┬──→ GPIO analógico WROOM-32
                               │
                              R2 (47kΩ)
                               │
                              GND
```

**Cálculo:**
- Bateria cheia (8,4V) → leitura: **2,68V** ✅
- Bateria fraca (6,0V) → leitura: **1,92V** ✅
- Faixa segura para o ESP32 (máx 3,3V): ✅

**Comportamento ao detectar bateria fraca (<6,2V):**
1. Motores param
2. LED de aviso acende
3. Grump exibe mensagem no display ("...acabou a energia. claro.")

### Capacitor eletrolítico — atenção na polaridade

- Perna **longa** = positivo → conectar no trilho **5V**
- Perna **curta** (faixa branca no corpo) = negativo → conectar no **GND**
- Invertido: risco de dano ou explosão 🚨

---

## 4. Nova feature — Buzzer passivo

### Por que passivo e não ativo?

| Tipo | Comportamento | Uso no grump |
|---|---|---|
| Ativo | Emite só um bip fixo | Limitado — só avisa |
| **Passivo** ✅ | PWM controla a frequência → toca notas | Sons de personalidade, melodias curtas |

### Exemplos de sons por marcador

| Marcador | Som sugerido |
|---|---|
| `<obstacle>` | Tom grave descendente |
| `<stuck>` | Sequência irritada rápida |
| `<clear>` | Tom suave ascendente |
| `<start>` | Melodia curta de boot |
| Bateria fraca | Bips lentos e graves |

### Pino do buzzer

A definir na Fase 4 — escolher GPIO livre no WROOM-32.

---

## 5. Correção de comportamento — fala vs. ação

### Regra de ouro do grump v3

> **O corpo nunca espera o cérebro. O cérebro comenta o que o corpo já fez.**

### Problema do v2

O corpo tomava decisões a cada ~50ms e enviava marcadores continuamente. O cérebro levava 2–5 segundos para gerar cada frase. Resultado: fila de marcadores acumulada → grump falava sobre situações que já haviam passado.

### Solução — duas mudanças coordenadas

**No corpo (WROOM-32):**

```cpp
// Só envia marcador se a situação mudou E o cooldown passou
if (situacaoAtual != situacaoAnterior &&
    millis() - ultimoEnvio > COOLDOWN_MS) {  // COOLDOWN_MS = 3000
    enviarMarcador(situacaoAtual);
    ultimoEnvio = millis();
    situacaoAnterior = situacaoAtual;
}
```

**No cérebro (ESP32-S3):**

```
Se chega marcador novo enquanto gera frase
→ CANCELA a geração atual
→ Começa nova geração com o marcador recebido
```

Sem fila — apenas o estado atual importa (preempção).

### Prioridade de ação

| Tipo de ação | Aguarda a fala terminar? |
|---|---|
| Desvio de obstáculo | ❌ Nunca — age imediatamente |
| Recuo após obstáculo | ❌ Nunca — age imediatamente |
| Escolha de direção de exploração | ✅ Pode aguardar |
| Comentário de situação nova | ✅ Pode aguardar |

### Valor inicial de cooldown

**3 segundos** — ajustar nos testes de integração conforme o tempo real de geração.

---

## 6. Plano de execução — fases

| Fase | O que fazer | Onde | Depende de |
|---|---|---|---|
| **1** | Ajustar XL6009 (~9V) e LM2596 (5V) com multímetro | Hardware | Multímetro |
| **2** | Validar boot dos dois ESP32 alimentados pela bateria, sem USB | Hardware | Fase 1 |
| **3** | Validar motores com nova tensão do XL6009 | Hardware | Fase 2 |
| **4** | Buzzer — sketch de diagnóstico isolado + integração com marcadores | WROOM-32 | Fase 2 |
| **5** | Monitor de bateria — montar divisor de tensão + código de aviso | WROOM-32 | R1/R2 comprados |
| **6** | Correção de comportamento — cooldown no corpo + preempção no cérebro | Ambos | Fase 4 |
| **7** | Integração completa + testes com rodas no ar | Hardware | Fases 1–6 |
| **8** | Atualizar tutorial Docusaurus | Site | Fase 7 |

### O que atualizar no Docusaurus (Fase 8)

- **Parte 1** — novo esquema de alimentação (bateria 2S, XL6009, LM2596, capacitor)
- **Parte 1** — adição do buzzer passivo (pino, código, sons por marcador)
- **Parte 5 (apêndices)** — mapa de pinos atualizado
- **Parte 5 (apêndices)** — ficha técnica de energia atualizada
- **Parte 4** — correção de comportamento fala/ação (cooldown + preempção)

---

## 7. Checklist de segurança — antes de energizar

- [ ] XL6009 ajustado e medido: ~9V na saída
- [ ] LM2596 ajustado e medido: 5V na saída
- [ ] Jumper de 5V do L298N **removido**
- [ ] Capacitor 1000µF com polaridade correta (+ no 5V, − no GND)
- [ ] Todos os GNDs unidos em ponto comum
- [ ] Divisor de tensão montado antes de conectar ao GPIO
- [ ] Primeiro teste sempre com **rodas no ar**

---

## 8. Backlog herdado do v2 (resolvido no v3)

| Item | Status |
|---|---|
| Debounce / enfileiramento de marcadores | ✅ Resolvido na Fase 6 |
| `<clear>` e `<stuck>` com respostas fracas | 🔲 Pendente — melhoria de dataset (pós v3) |
| Animações entre estados de olhos | 🔲 Pendente (pós v3) |
| Autonomia de energia | ✅ Resolvido no v3 |

---

*Documento gerado a partir do planejamento conjunto — conversa de 24/08/2026.*
