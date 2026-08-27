import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';                        // [ADICIONADO]
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// [ALTERADO] O card agora guarda a imagem por URL (img) e o link do curso,
// em vez de um SVG-componente. Assim aceita PNG/JPG e vira a vitrine de cursos.
type Curso = {
  title: string;
  img: string;              // caminho em static/, ex: '/img/robo.png'
  description: ReactNode;
  link: string;             // endereço do curso, ex: '/robo/parte-0-boas-vindas'
  disponivel: boolean;
};

const CURSOS: Curso[] = [
  {
    title: 'NanoGrump 3.0 — Versão Definitiva',
    img: '/img/nanogrump_v3.png',
    description: (
      <>
        Uma versão completa e definitiva do NanoGrump: buzzer para falar, LEDs
        para sinalizar e um único ESP32-S3 para tudo. Mais módulos, mais
        personalidade.
      </>
    ),
    link: '#',
    disponivel: false,
  },
  {
    title: 'Blocos Físicos: resolva um labirinto',
    img: '/img/blocos_labirinto.png',
    description: (
      <>
        Blocos físicos com componentes integrados que se comunicam entre si, com
        um ESP32 e com o computador — para programar e resolver labirintos de
        verdade.
      </>
    ),
    link: '#',
    disponivel: false,
  },
  {
    title: 'RoverMind completo: robô + cérebro',
    img: '/img/rovermind_completo.png',
    description: (
      <>
        Junte o corpo e o cérebro: o robô que anda, pensa e comenta cada
        situação com personalidade.
      </>
    ),
    link: '/rovermind/boas-vindas',
    disponivel: true,
  },
  {
    title: 'Rode uma IA num chip (ESP32-S3)',
    img: '/img/ia_chip.png',
    description: (
      <>
        Construa um modelo de linguagem do zero e faça ele rodar embarcado
        num microcontrolador.
      </>
    ),
    link: '/ia-chip/o-que-e-llm',
    disponivel: true,
  },
  {
    title: 'Construa um robô autônomo com ESP32',
    img: '/img/robo_autonomo_esp32.png',
    description: (
      <>
        Eletrônica, sensores, motores e programação para criar um rover que
        percebe obstáculos e navega sozinho.
      </>
    ),
    link: '/robo/boas-vindas',
    disponivel: true,
  },
  {
    title: 'Crie um jogo de plataforma 2D na Godot',
    img: '/img/godot_capa_nova.png',
    description: (
      <>
        Desenvolvimento de jogos 2D na Godot 4.2 com GDScript: personagem,
        plataformas, coletáveis e um inimigo com máquina de estados.
      </>
    ),
    link: '/godot/parte-0-boas-vindas',
    disponivel: true,
  },
];

function CursoCard({title, img, description, link, disponivel}: Curso) {
  return (
    <div className={clsx('col col--4', styles.cursoCard)}>
      <div className="text--center">
        <img
          src={useBaseUrl(img)}
          className={styles.featureSvg}
          role="img"
          alt={title}
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        {disponivel ? (
          <Link className="button button--primary" to={link}>
            Acessar curso →
          </Link>
        ) : (
          <button className="button button--secondary" disabled>
            Em breve
          </button>
        )}
      </div>
    </div>
  );
}

const PASSOS = [
  { n: '1', titulo: 'Escolha um projeto', texto: 'Encontre algo que você gostaria de construir.' },
  { n: '2', titulo: 'Aprenda o necessário', texto: 'Os conceitos são apresentados de forma progressiva e prática.' },
  { n: '3', titulo: 'Construa passo a passo', texto: 'Cada etapa transforma o que você aprendeu em algo concreto.' },
  { n: '4', titulo: 'Experimente', texto: 'Modifique o projeto, teste novas ideias e crie sua própria versão.' },
];

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">

        <div className={styles.comoFunciona}>
          <h2>Aprenda fazendo</h2>
          <div className={clsx('row', styles.passos)}>
            {PASSOS.map(({ n, titulo, texto }) => (
              <div key={n} className={clsx('col col--3', styles.passo)}>
                <span className={styles.passoNumero}>{n}</span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="row">
          {CURSOS.map((props, idx) => (
            <CursoCard key={idx} {...props} />
          ))}
        </div>

      </div>
    </section>
  );
}