import DefaultTheme from 'vitepress/theme'
import './custom.css'


export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register Vue components for shortcodes here if needed
    // app.component('Badge', Badge)
  }
}