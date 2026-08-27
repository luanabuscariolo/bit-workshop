---
id: o-problema
title: "1. O problema: dois idiomas"
sidebar_position: 1
---

Seu modelo foi treinado em **PyTorch**, que é Python — um ambiente pesado, impossível
de rodar num microcontrolador. O ESP32-S3 roda **C puro**, lendo os dados direto da
memória flash.

**A analogia:** o `modelo_treinado.pt` é uma receita escrita em português; o ESP32-S3
só lê receitas em japonês. Precisamos **traduzir a receita** — sem mudar nenhum
ingrediente nem passo, só reescrever no idioma que o chip entende.

O caminho completo, do PC ao chip:

![Pipeline de embarque](/img/parte-4_fig01_pipeline_de_embarque.png)

Repare num ponto fundamental: **o treino acontece no PC**. O chip só roda a
**inferência** (a geração de texto). O modelo não "aprende" no robô — ele já vem
treinado, e no chip apenas lê os pesos e gera frases.

Vamos dividir o embarque em três etapas:

1. **Exportar** — um script Python que traduz o `.pt` num arquivo `.bin`
2. **Gravar e ler** — colocar o `.bin` na flash e o firmware C lê os pesos
3. **Comunicar** — os dois ESP32 conversam (corpo → cérebro → frase)

---
