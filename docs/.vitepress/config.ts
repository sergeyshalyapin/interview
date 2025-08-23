import { defineConfig } from 'vitepress'


export default defineConfig({
  // === Site metadata ===
  title: 'Pretty Docs',
  description: 'Beautiful, fast docs from plain Markdown',


  // IMPORTANT for GitHub Pages project sites: set base to '/REPO_NAME/'
  // base: '/your-repo-name/',


  // === Theme config ===
  themeConfig: {
    logo: '/logo.svg',


    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Configuration', link: '/configuration' },
      { text: 'Guides', link: '/guides/authoring' }
    ],


    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Welcome', link: '/' },
          { text: 'Getting Started', link: '/getting-started' }
        ]
      },
      {
        text: 'Core',
        items: [
          { text: 'Configuration', link: '/configuration' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Authoring Markdown', link: '/guides/authoring' },
          { text: 'Theming & Branding', link: '/guides/theming' }
        ]
      }
    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/sergeyshalyapin/interview' }
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