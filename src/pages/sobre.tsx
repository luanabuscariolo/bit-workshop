// [ADICIONADO] Página de portfólio/sobre a autora
import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import styles from './sobre.module.css';

// ── Dados ── edite aqui para manter a página atualizada ──────────────────────

const HABILIDADES = {
  'Ensino & Educação': [
    'Robótica para jovens',
    'IA aplicada ao ensino',
    'Criação de cursos didáticos',
    'Pensamento computacional',
  ],
  'IA & Dados': [
    'Python', 'SQL / PostgreSQL', 'LLMs (API Anthropic)',
    'RAG & Embeddings', 'AI Agents', 'MCP', 'Power BI', 'Azure Databricks',
  ],
  'Desenvolvimento': [
    'JavaScript', 'C#', 'HTML & CSS', 'FastAPI', 'Docker', 'nginx',
  ],
  'Cloud & Infra': [
    'Microsoft Azure', 'Azure Databricks', 'Databricks',
  ],
};

const EXPERIENCIA = [
  {
    empresa: 'Happy Code Portugal',
    cargo: 'Professora',
    periodo: 'Mar 2025 – Presente',
    local: 'Portugal',
    descricao:
      'Ensino de programação e tecnologia para crianças e jovens.',
  },
  {
    empresa: 'Flying Bot Tecnologia da Informação',
    cargo: 'Estagiária em Desenvolvimento de Software',
    periodo: 'Abr 2021 – Set 2021',
    local: 'Atibaia, SP, Brasil',
    descricao:
      'Desenvolvimento front-end com JavaScript, C# e HTML/CSS; criação de banco de dados.',
  },
];

const FORMACAO = [
  { instituicao: 'Univesp',       curso: 'Bacharelado em Engenharia de Computação', periodo: '2017 – 2023' },
  { instituicao: 'Code for All_', curso: 'Bootcamp de Desenvolvimento',              periodo: 'Set – Dez 2025' },
  { instituicao: 'Udemy',         curso: 'C# Intermediate',                          periodo: '2025' },
  { instituicao: 'Udemy',         curso: 'Testes Automáticos (.NET 9 / xUnit)',       periodo: '2025' },
  { instituicao: 'Udemy',         curso: 'Teste de Software',                         periodo: '2025' },
];

const CERTIFICACOES = [
  'Arquitetura de Dados para Engenharia e Ciência de Dados',
  'Databricks Developer — Spark, SQL, Python for Data Analysis',
  'SQL for Data Analysis: Advanced SQL Querying Techniques',
];

// ── Componentes internos ──────────────────────────────────────────────────────

function GrupoHabilidades({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div>
      <Heading as="h3" className={styles.subTitulo}>{titulo}</Heading>
      <div className={styles.tags}>
        {itens.map((item, i) => <span key={i} className={styles.tag}>{item}</span>)}
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function Sobre(): ReactNode {
  return (
    <Layout
      title="Sobre mim"
      description="Portfólio de Luana Buscariolo — Engenheira de Computação e Professora de Robótica e IA">

      {/* HERO */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <img
            src={useBaseUrl('/img/luana.jpg')}
            alt="Foto de Luana Buscariolo"
            className={styles.foto}
          />
          <div>
            <Heading as="h1" className={styles.heroNome}>Luana Buscariolo</Heading>
            <p className={styles.heroTitulo}>
              Engenheira de Computação · Professora · Criadora de cursos sobre Robótica e IA
            </p>
            <p className={styles.heroLocal}>📍 Lisboa, Portugal</p>
            <div className={styles.contatos}>
              <Link
                className="button button--secondary"
                href="https://www.linkedin.com/in/luana-buscariolo">
                LinkedIn
              </Link>
              <Link
                className="button button--secondary"
                href="https://github.com/luanabuscariolo">
                GitHub
              </Link>
              <Link
                className="button button--secondary"
                href="mailto:luanabuscariolo@gmail.com">
                E-mail
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>

        {/* SOBRE MIM */}
        <section className={styles.secao}>
          <Heading as="h2">Sobre mim</Heading>
          <p>
            Sou apaixonada por <strong>ensinar e criar</strong>. Minha trajetória combina uma
            formação sólida em Engenharia de Computação com um caminho de aprendizado
            intensivo e autodirigido em Inteligência Artificial, dados e robótica embarcada.
          </p>
          <p>
            Nos últimos anos construí projetos end-to-end: modelagem relacional em PostgreSQL,
            pipelines em Python, backend com FastAPI, dashboards em Power BI e uma camada de
            IA generativa com integração de LLMs via API (Anthropic), pipelines RAG com
            embeddings e busca vetorial, e experiência prática com MCP e agentes de IA.
          </p>
          {/*
          <p>
            Hoje atuo como <strong>professora na Happy Code Portugal</strong> e canalizo esse
            conhecimento para criar material didático acessível — como os cursos desta
            plataforma, que ensinam robótica e IA embarcada do zero.
          </p>
           */}
        </section>

        {/* PROJETO DESTAQUE */}
        <section className={styles.secao}>
          <Heading as="h2">O que estou construindo</Heading>
          <div className={styles.projetoCard}>
            <Heading as="h3" className={styles.subTitulo}>🤖 Plataforma RoverMind</Heading>
            <p>
              Uma plataforma de cursos que transforma meu estudo em conteúdo acessível para
              iniciantes — desde a montagem de um robô autônomo com ESP32 até a criação e
              execução de um modelo de linguagem embarcado num microcontrolador.
            </p>
            <Link className="button button--primary" to="/">Ver os cursos →</Link>
          </div>
        </section>

        {/* EXPERIÊNCIA */}
        <section className={styles.secao}>
          <Heading as="h2">Experiência</Heading>
          {EXPERIENCIA.map((exp, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>{exp.empresa}</strong>
                <span className={styles.periodo}>{exp.periodo}</span>
              </div>
              <p className={styles.cargo}>{exp.cargo} · {exp.local}</p>
              <p>{exp.descricao}</p>
            </div>
          ))}
        </section>

        {/* FORMAÇÃO */}
        <section className={styles.secao}>
          <Heading as="h2">Formação</Heading>
          {FORMACAO.map((f, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>{f.instituicao}</strong>
                <span className={styles.periodo}>{f.periodo}</span>
              </div>
              <p className={styles.cargo}>{f.curso}</p>
            </div>
          ))}
        </section>

        {/* CERTIFICAÇÕES */}
        <section className={styles.secao}>
          <Heading as="h2">Certificações</Heading>
          <ul>
            {CERTIFICACOES.map((cert, i) => <li key={i}>{cert}</li>)}
          </ul>
        </section>

        {/* HABILIDADES */}
        <section className={styles.secao}>
          <Heading as="h2">Habilidades</Heading>
          <div className={styles.habilidades}>
            {Object.entries(HABILIDADES).map(([titulo, itens]) => (
              <GrupoHabilidades key={titulo} titulo={titulo} itens={itens} />
            ))}
          </div>
        </section>

      </main>
    </Layout>
  );
}