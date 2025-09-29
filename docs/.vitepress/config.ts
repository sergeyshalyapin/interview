import { defineConfig } from 'vitepress'

export default defineConfig({
  // === Site metadata ===
  title: 'SFSD Interview',
  description: 'Preparation for Senior Full-Stack Developer Interview',

  // IMPORTANT for GitHub Pages project sites: set base to '/REPO_NAME/'
  base: '/interview/',

  // === Theme config ===
  themeConfig: {
    logo: '/silhouette.png',

    nav: [
      { text: 'Last Asked Questions', link: '/lastAskedQuestions/fullList' },
      { text: 'Glossary', link: '/glossary' },
      { text: 'Tips', link: '/tips' },
    ],

    sidebar: [
      {
        text: 'Last Asked Questions',
        collapsed: false,
        items: [
          { text: 'Full List', link: '/lastAskedQuestions/fullList' },
          { text: '28/08/2025 - SFED', link: '/lastAskedQuestions/i-2025-08-28' },
        ]
      },
      {
        text: 'Frontend',
        collapsed: false,
        items: [
          { text: 'React', link: '/lastAskedQuestions/fullList' },
          { text: 'CSS', link: '/lastAskedQuestions/i-2025-08-28' },
        ]
      },
      {
        text: 'Backend',
        collapsed: false,
        items: [
          { text: 'Node.js', link: '/backend/nodejs' },
          { text: 'Client - Server', link: '/backend/clientServer' },
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Authoring Markdown', link: '/guides/authoring' },
          { text: 'Theming & Branding', link: '/guides/theming' }
        ]
      },
      {
        text: 'General',
        items: [
          { text: 'Glossary', link: '/glossary' },
          { text: 'Tips', link: '/tips' },
          { text: 'Configuration', link: '/configuration' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sergeyshalyapin' }
    ],

    // Edit link pattern for the "Edit this page" link
    editLink: {
      pattern: 'https://github.com/sergeyshalyapin/interview/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },


    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: '© 2025 Sergey Shalyapin'
    },


    // Search: VitePress ships with a simple client-side search
    // For Algolia DocSearch, add its options here later if desired
  },


  // === Markdown options ===
  markdown: {
    lineNumbers: true,
    // VitePress includes custom containers like :::: info | tip | warning | danger
    // Code groups and tabs are available via ::: code-group
  },


  // === Social card (OG image) ===
  head: [
    ['meta', { property: 'og:image', content: '/social-card.png' }],
    ['meta', { name: 'theme-color', content: '#0ea5e9' }]
  ]
})