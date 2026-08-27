---
id: ambiente
title: "8. Preparando o ambiente"
sidebar_position: 8
---

Para construir o cérebro, precisamos de três ferramentas no computador. Pense
nelas como a bancada e as ferramentas antes de começar uma marcenaria.

1. **Python** — a linguagem de programação em que vamos escrever. É uma das mais
   usadas em IA, justamente por ser legível e acessível.
2. **uv** — um "organizador de projeto". Ele cria um espaço isolado para o nosso
   projeto e instala as bibliotecas certas, sem bagunçar o resto do computador.
3. **PyTorch** — a biblioteca que faz as contas de IA. É ela que sabe usar a
   **placa de vídeo (GPU)** para treinar rápido.

> **O que é a GPU e por que ela importa?** A placa de vídeo tem milhares de
> "operários" que fazem contas de matemática ao mesmo tempo. Treinar um modelo é
> fazer *muitas* contas, então a GPU acelera tudo enormemente. Se você não tiver
> uma GPU, o projeto ainda funciona — só treina mais devagar, no processador comum.

### Os comandos

Depois de instalar o Python e o `uv` (os instaladores oficiais de cada um guiam o
processo no seu sistema), abra o **terminal** — a janelinha onde você digita
comandos — e crie o projeto:

```bash
# cria a pasta do projeto e entra nela
mkdir nano-grump
cd nano-grump

# inicia um projeto uv (cria o arquivo de configuração)
uv init --bare

# cria uma subpasta para os dados
mkdir data
```

Agora instale o PyTorch. Se você tem uma GPU NVIDIA, o `uv` consegue detectar e
baixar a versão certa:

```bash
uv add torch numpy
```

Para confirmar que está tudo certo, rode este teste rápido:

```bash
uv run python -c "import torch; print('GPU disponível?', torch.cuda.is_available())"
```

Se aparecer `GPU disponível? True`, o PyTorch enxergou sua placa. Se aparecer
`False`, sem problema — ele vai usar o processador comum (mais devagar, mas
funciona).

> **Dica de bolso:** o comando `uv run` roda o Python "de dentro" do projeto, onde
> as bibliotecas estão instaladas. Use sempre `uv run python ...` para executar os
> scripts deste tutorial.

---
