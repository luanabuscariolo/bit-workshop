import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// [ADICIONADO] fundo animado de "placa de circuito" atrás do hero — decorativo,
// não interativo (pointer-events desligado), e ignorado por leitores de tela.
function CircuitBackground() {
  return (
    <svg
      className={styles.circuitBg}
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true">
      <g className={styles.circuitTraces} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M0 80 H220 V180 H460 V60 H700 V220 H1000 V100 H1200" />
        <path d="M0 320 H160 V420 H380 V300 H620 V440 H860 V260 H1200" />
        <path d="M120 0 V140 H340 V320" />
        <path d="M900 0 V160 H700" />
        <path d="M1080 500 V360 H880 V480" />
        <path d="M40 500 V440 H260 V500" />
      </g>
      <g className={styles.circuitNodes} fill="currentColor">
        <circle cx="220" cy="80" r="5" />
        <circle cx="460" cy="180" r="5" />
        <circle cx="700" cy="60" r="5" />
        <circle cx="1000" cy="220" r="5" />
        <circle cx="160" cy="320" r="5" />
        <circle cx="380" cy="420" r="5" />
        <circle cx="620" cy="300" r="5" />
        <circle cx="860" cy="440" r="5" />
        <circle cx="340" cy="140" r="5" />
        <circle cx="880" cy="360" r="5" />
      </g>
    </svg>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <CircuitBackground />
      <div className={clsx('container', styles.heroContent)}>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <a
            className="button button--secondary button--lg"
            href="#cursos">
            Explorar cursos
          </a>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Oficina Bit"
      description="Projetos práticos de tecnologia e criação digital. Aprenda criando coisas de verdade, passo a passo.">
      <HomepageHeader />
      <main id="cursos">
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
