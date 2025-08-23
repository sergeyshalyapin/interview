# Authoring Markdown


## Images
Place assets in `docs/.vitepress/public` and reference them with absolute paths:


```md
![Social Card](/social-card.png)
```


## Badges


Use Shields.io in your README or pages:


```md
![CI](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/pages.yml)
![License](https://img.shields.io/badge/license-MIT-informational)
```


## Tables


| Option | Type | Default | Description |
|------: |:---- |:------- |:----------- |
| `port` | number | `3000` | Dev server port |


## Admonitions
Use `::: tip|info|warning|danger` blocks for emphasis.