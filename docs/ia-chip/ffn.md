---
id: ffn
title: "16. A FFN"
sidebar_position: 16
---

A atenção mistura informação **entre** os tokens (cada um olhou os vizinhos e reuniu contexto). Falta agora um lugar onde cada token **processe, sozinho**, aquilo que reuniu. Essa é a **FFN** (rede feed-forward):

> *A atenção reúne o contexto; a FFN transforma a representação de cada posição, uma por uma.*

**A ideia em uma frase:** a FFN "abre" o vetor de cada token num espaço maior,
aplica um filtro que corta os negativos, e "fecha" de volta ao tamanho original.

**A analogia:** a atenção é *conversar com os vizinhos e coletar informação*; a FFN
é *ir para casa e processar aquilo sozinho*.

A FFN tem 3 etapas. Com um vetor de tamanho 2, `[1, -2]`:

1. **Expandir** (uma camada linear leva de 2 para 4 números): `[1, -2, -1, 3]`
2. **ReLU** (mantém positivos, zera negativos): `[1, 0, 0, 3]`
3. **Contrair** (de 4 de volta para 2): `[4, 0]`

![A camada FFN](/img/parte-3_fig11_a_camada_ffn.png)

**O que é uma "camada linear"?** É uma tabela de pesos: cada número de saída é uma
combinação dos números de entrada, multiplicados por pesos. A ReLU (*Rectified
Linear Unit*) é uma **função de ativação**: a não-linearidade que dá ao modelo poder
de aprender padrões complexos. Sem ela, empilhar camadas não adiantaria (viraria
tudo uma conta só).
