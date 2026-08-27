---
id: geracao
title: "20. Geração: ouvir o robô falar"
sidebar_position: 20
---

O modelo gera texto de forma **autorregressiva**: prevê o próximo caractere, anexa ao
contexto, e repete. Cada caractere gerado realimenta a entrada.

![Ciclo de geração](/img/parte-3_fig18_ciclo_de_geracao.png)

Em cada passo, o modelo dá probabilidades e a gente **sorteia** um caractere (como um
dado viciado). Sortear, em vez de sempre pegar o mais provável, dá **variedade** — por
isso o robô diz frases diferentes a cada vez.

### O código de geração

```python
import json
from pathlib import Path
import torch
import torch.nn.functional as F
from model import MiniGPT, block_size

device = "cuda" if torch.cuda.is_available() else "cpu"
pasta = Path(__file__).parent
caracteres = json.loads((pasta / "vocab.json").read_text(encoding="utf-8"))
stoi = {c: i for i, c in enumerate(caracteres)}
itos = {i: c for i, c in enumerate(caracteres)}
def encode(s): return [stoi[c] for c in s]
def decode(n): return "".join(itos[i] for i in n)

modelo = MiniGPT().to(device)
modelo.load_state_dict(torch.load(pasta / "modelo_treinado.pt", map_location=device))
modelo.eval()

def gerar(prompt, max_novos=120, temperatura=0.8):
    idx = torch.tensor([encode(prompt)], dtype=torch.long, device=device)
    for _ in range(max_novos):
        cond = idx[:, -block_size:]
        with torch.no_grad():
            logits = modelo(cond)[:, -1, :] / temperatura
        probs = F.softmax(logits, dim=-1)
        prox = torch.multinomial(probs, num_samples=1)
        idx = torch.cat([idx, prox], dim=1)
        if prox.item() == stoi["\n"]:
            break
    return decode(idx[0].tolist())

for m in ["<start>", "<explore>", "<obstacle>", "<stuck>"]:
    print(gerar(m + " ").strip())
```

**O que você deve ver:** o robô gerando uma frase para cada marcador — diferentes a
cada execução, por causa do sorteio. Num modelo minúsculo com pouco treino, algumas
palavras saem "tortas"; isso melhora com mais dados e mais treino, mas o **tom
sarcástico** já aparece.

**A frase-resumo:**

> "A geração é autorregressiva: o modelo prevê a distribuição do próximo token,
> amostramos um token, anexamos ao contexto e repetimos. A temperatura controla o
> quão ousado é o sorteio."

---

## Encerramento deste curso

Você construiu, do zero e entendendo cada peça, um **modelo de linguagem completo**:

- ✅ Tokenizer (texto ↔ números)
- ✅ Embeddings (caractere + posição)
- ✅ Atenção (Query/Key/Value, softmax, máscara causal)
- ✅ FFN, conexão residual e LayerNorm
- ✅ O modelo mini-GPT montado
- ✅ Treino (erro + gradiente) e geração de texto

Isso é algo que muita gente que *usa* IA nunca fez: você entende o que acontece por
dentro. No **Curso 3 — RoverMind**, vamos levar esse cérebro para o microcontrolador ESP32-S3 e
uni-lo ao corpo do robô.
