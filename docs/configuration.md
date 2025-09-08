# Configuration


The main config file is at `docs/.vitepress/config.ts`.


## Sidebar & Nav
Edit `themeConfig.sidebar` and `themeConfig.nav` to add or rearrange pages.


## Edit Link
Update the `editLink.pattern` with your GitHub `OWNER/REPO`.


## Base path (GitHub Pages)
If your project is served from `https://OWNER.github.io/REPO/`, set:


```ts
export default defineConfig({
  base: '/REPO/',
})
```


<details>
<summary> Click to reveal</summary>

This is the hidden content.  
You can include **Markdown**, code blocks, lists, images, etc.

```ts
console.log("This also works inside!");
```
</details>


> For user/organization sites like `OWNER.github.io`, keep `base: '/'`.