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
    title: 'Construa um robô autônomo com ESP32',
    img: '/img/robo_autonomo_esp32.png',
    description: (
      <>
        Eletrônica, sensores, motores e programação para criar um rover que
        percebe obstáculos e navega sozinho.
      </>
    ),
    link: '/robo/parte-0-boas-vindas',
    disponivel: true,
  },
  {
    title: 'Rode uma IA num chip (ESP32-S3)',
    img: '/img/ia_chip.png',          // troque pela sua imagem (ou reuse a de cima por ora)
    description: (
      <>
        Construa um modelo de linguagem do zero e faça ele rodar embarcado
        num microcontrolador.
      </>
    ),
    link: '/ia-chip/parte-2-o-que-e-llm',
    disponivel: true,
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
    link: '/rovermind/parte-4-esp32-s3', // [ALTERADO] era '#'
    disponivel: true, // [ALTERADO] era false — Curso 3 agora tem conteúdo
  },
];

function CursoCard({title, img, description, link, disponivel}: Curso) {
  return (
    <div className={clsx('col col--4')}>
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
          <em>Em breve</em>
        )}
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {CURSOS.map((props, idx) => (
            <CursoCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}