# Smornfly / Field Notes

使用 Astro 构建的个人博客与作品集，部署在 GitHub Pages。

- 正式地址：https://smornfly.github.io
- GitHub 仓库：https://github.com/smornfly/smornfly.github.io
- 网站框架：Astro 7
- 输出模式：纯静态 HTML、CSS 和少量渐进增强 JavaScript

## 当前状态

网站已经具备完整的博客和作品集内容架构，但尚未发布虚构作品或文章。
首页、关于页、博客空状态和作品空状态均可以正常访问。

## 本地开发

要求 Node.js 22 或更高版本。

```powershell
cd E:\FileFolder\codex\self-improve\personal-site
npm install
npm run dev
```

开发服务器默认地址为 `http://localhost:4321`。

生产构建与检查：

```powershell
npm run check
npm run build
npm run preview
```

构建产物位于 `dist/`，不要手动修改或提交 `dist/`。

## 内容结构

```text
src/
├─ content/
│  ├─ posts/
│  │  └─ _template.md
│  └─ projects/
│     └─ _template.md
├─ components/
├─ data/site.ts
├─ layouts/
├─ pages/
│  ├─ writing/
│  ├─ works/
│  ├─ index.astro
│  └─ about.astro
└─ content.config.ts
```

站点名称、简介和 GitHub 地址集中在 `src/data/site.ts`。

## 新增博客文章

1. 在 `src/content/posts/` 新建 Markdown 文件，例如 `first-note.md`。
2. 填写 Frontmatter。
3. 将 `draft` 设为 `false`。
4. 运行 `npm run dev` 本地预览。
5. 运行 `npm run check` 与 `npm run build`。
6. 提交并推送，GitHub Actions 会自动部署。

Frontmatter 示例：

```md
---
title: 文章标题
description: 用一两句话说明这篇文章解决了什么问题。
date: 2026-10-20
updated: 2026-10-21
tags: [运维, 自动化]
draft: false
---

正文从这里开始。
```

文章页面、博客列表、标签筛选、搜索、RSS 和 Sitemap 会自动更新。

## 新增作品

在 `src/content/projects/` 新建 Markdown 文件：

```md
---
title: 项目名称
description: 用一两句话说明项目解决了什么问题。
date: 2026-10-20
tags: [运维]
stack: [Python, Linux]
role: 个人项目
status: 进行中
featured: true
order: 10
draft: false
---

## 问题背景

说明项目为什么被启动。

## 我的工作

说明职责、关键判断与实现过程。

## 结果与反思

记录结果、遗留问题和下一步计划。
```

`status` 可选值：

- `进行中`
- `已完成`
- `持续迭代`
- `实验`

`featured: true` 会让项目优先出现在首页。`order` 越小，排序越靠前。

## 草稿规则

`draft: true` 的内容不会出现在生产站点、RSS 或 Sitemap 中。
`src/content/` 下的两个 `_template.md` 默认是草稿，可以直接复制和重命名。

## GitHub Pages 部署

推送至 `main` 分支会触发 `.github/workflows/pages.yml`：

1. 安装锁定版本的 npm 依赖。
2. 运行 Astro 构建。
3. 上传 `dist/`。
4. 部署到 GitHub Pages。

仓库设置需要保持：

```text
Settings → Pages → Build and deployment → Source: GitHub Actions
```

## 日常维护

发布前检查：

- `npm run check` 无错误。
- `npm run build` 成功。
- 首页、博客、作品和关于页在手机宽度下没有横向溢出。
- 新增内容的链接、标题、日期和标签正确。

每次发布后：

- 检查 GitHub Actions 是否成功。
- 打开新增页面，确认线上版本已经更新。
- 必要时使用 Git 回退有问题的提交。

## 备份

GitHub 仓库是主备份，本地工作目录是第二份副本。
网站源代码、文章和作品都在 Git 历史中，部署生成的 `dist/` 不需要单独备份。
