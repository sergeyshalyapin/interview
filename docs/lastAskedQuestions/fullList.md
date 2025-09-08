# Full list of questions

This is full list of questions I've been asked. And statistics of the questions.

## General

This is <Badge type="info" text="INFO" />  

```bash
npm i
npm run docs:dev
```

Open the local URL from your terminal.


## Build for production

```bash
npm run docs:build
npm run docs:preview
```


## Authoring basics

- Write pages in `docs/` using **Markdown** (`.md`).
- Add pages to the sidebar via `docs/.vitepress/config.ts`.
- Use callouts:

::: tip
This is a **tip** block.
:::

::: info
This is an **info** block.
:::

::: warning
This is a **warning** block.
:::

::: danger
This is a **danger** block.
:::


### Code groups (tabs)

::: code-group
```ts [TypeScript]
export const greet = (name: string) => `Hello, ${name}`
```
```js [JavaScript]
export const greet = (name) => `Hello, ${name}`
```
:::


### Mermaid diagrams

```mermaid
flowchart TD
A[Markdown] --> B(VitePress)
B --> C{Static Site}
C --> D[GitHub Pages]
```