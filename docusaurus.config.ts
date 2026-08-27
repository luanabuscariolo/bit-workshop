import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Oficina Bit',
  tagline: 'Projetos práticos de tecnologia e criação digital, para quem quer aprender desde os primeiros passos e transformar ideias em coisas que funcionam.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://luanabuscariolo.github.io',
  baseUrl: '/rovermind-nanogrump-course/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'luanabuscariolo',
  projectName: 'rovermind-nanogrump-course',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  // [ADICIONADO] carrega a fonte Orbitron (Google Fonts) para os títulos
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap',
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ia-chip',                       // identificador único desta instância
        path: 'docs/ia-chip',                // onde moram os arquivos do Curso 2
        routeBasePath: 'ia-chip',            // endereço: /ia-chip/...
        sidebarPath: './sidebars-ia-chip.ts', // barra lateral própria (criada no passo 2)
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'rovermind',                        // [ADICIONADO] Curso 3 — RoverMind Completo
        path: 'docs/rovermind',                 // onde mora o material do Curso 3
        routeBasePath: 'rovermind',             // endereço: /rovermind/...
        sidebarPath: './sidebars-rovermind.ts', 
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'godot',                            // [ADICIONADO] Curso 4 — Godot
        path: 'docs/godot',                     // onde mora o material do Curso 4
        routeBasePath: 'godot',                 // endereço: /godot/...
        sidebarPath: './sidebars-godot.ts',    
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
            routeBasePath: 'robo',    // [ALTERADO] era 'rovermind' → agora /robo/...
            path: 'docs/robo',        // [ALTERADO] era 'docs/rovermind'
          },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Oficina Bit',
      logo: {
        alt: 'Oficina Bit Logo',
        src: 'img/logo.svg',
      },
      items: [
        // [ALTERADO] era item simples "Tutorial" → agora dropdown com os dois cursos
        {
          type: 'dropdown',
          label: 'Cursos',
          position: 'left',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'tutorialSidebar',
              label: 'Construa um robô autônomo',
            },
            {
              type: 'docSidebar',
              sidebarId: 'iaChipSidebar',
              docsPluginId: 'ia-chip',
              label: 'IA num Chip (ESP32-S3)',
            },
            {
              type: 'docSidebar',
              sidebarId: 'rovermindSidebar',   
              docsPluginId: 'rovermind',       
              label: 'RoverMind Completo',
            },
            {
              type: 'docSidebar',
              sidebarId: 'godotSidebar',      
              docsPluginId: 'godot',           
              label: 'Jogo 2D na Godot',
            },
          ],
        },
        //{to: '/blog', label: 'Blog', position: 'left'},
        {to: '/sobre', label: 'Sobre', position: 'left'}, 
        {
          href: 'https://github.com/luanabuscariolo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Cursos',
          items: [
            {
              label: 'Construa um robô autônomo',
              to: '/robo/parte-0-boas-vindas',
            },
            {
              label: 'IA num Chip (ESP32-S3)',
              to: '/ia-chip/parte-2-o-que-e-llm',
            },
          ],
        },
        {
          title: 'Oficina Bit',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/luanabuscariolo',
            },
            {
              label: 'LinkedIn',                                        
              href: 'https://www.linkedin.com/in/luana-buscariolo',
            },
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Oficina Bit · Luana Buscariolo. Feito com Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
