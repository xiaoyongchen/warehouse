---
home: true
title: 首页
heroImage: /images/hero.png
actions:
  - text: 快速上手
    link: /zh/blog/bestBlog/index.html
    type: primary
  - text: 项目简介
    link: /zh/blog/bestBlog/index.html
    type: secondary
features:
  - title: 简洁至上
    details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
  - title: Vue 驱动
    details: 享受 Vue 的开发体验，可以在 Markdown 中使用 Vue 组件，又可以使用 Vue 来开发自定义主题。
  - title: 高性能
    details: VuePress 会为每个页面预渲染生成静态的 HTML，同时，每个页面被加载的时候，将作为 SPA 运行。
  - title: 主题
    details: 提供了一个开箱即用的默认主题。你也可以挑选一个社区主题，或者创建一个你自己的主题。
  - title: 插件
    details: 灵活的插件API，使得插件可以为你的站点提供许多即插即用的功能。
  - title: 打包工具
    details: 默认的打包工具是 Vite ，也同样支持 Webpack 。选一个你喜欢的来使用吧！
footer: MIT Licensed | Copyright © 2018-present Evan You
---

## 快速开始

- **步骤1**: 创建并进入一个新目录

```bash
mkdir vuepress-starter
cd vuepress-starter
```

- **步骤2**: 初始化项目

<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash
git init
yarn init
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash
git init
npm init
```

  </CodeGroupItem>
</CodeGroup>


- **步骤3**: 将 VuePress 安装为本地依赖

<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash
yarn add -D vuepress@next
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash
npm install -D vuepress@next
```

  </CodeGroupItem>
</CodeGroup>

- **步骤4**: 在 `package.json` 中添加一些 [scripts](https://classic.yarnpkg.com/zh-Hans/docs/package-json#toc-scripts)

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

- **步骤5**: 将默认的临时目录和缓存目录添加到 `.gitignore` 文件中

```bash
echo 'node_modules' >> .gitignore
echo '.temp' >> .gitignore
echo '.cache' >> .gitignore
```

- **步骤6**: 创建你的第一篇文档

```bash
mkdir docs
echo '# Hello VuePress' > docs/README.md
```

- **步骤7**: 在本地启动服务器来开发你的文档网站

<CodeGroup>
  <CodeGroupItem title="YARN" active>

```bash
yarn docs:dev
```

  </CodeGroupItem>

  <CodeGroupItem title="NPM">

```bash
npm run docs:dev
```

  </CodeGroupItem>
</CodeGroup>

  VuePress 会在 [http://localhost:8080](http://localhost:8080) 启动一个热重载的开发服务器。当你修改你的 Markdown 文件时，浏览器中的内容也会自动更新。