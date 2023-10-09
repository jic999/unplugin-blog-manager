# unplugin-blog-manager

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

一个可以帮助你管理和组织博客文章的插件，基于 [unplugin](https://github.com/unjs/unplugin)。它会根据你的博客文章中的 *front matter* 信息对其进行索引和分类，并对外提供一个易于渲染和使用的数据对象。

仅仅这些，似乎并不需要一个插件来完成。的确如此，我主要是想学习如何开发一个 unplugin 插件，所以就有了 *unplugin-blog-manager*😊。

## 安装

```bash
npm i unplugin-blog-manager -D
```

## 使用

以 vite 为例：

```ts
// vite.config.ts
import BlogManager from 'unplugin-blog-manager/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    BlogManager({
      author: 'jic999',
      // please use absolute path, otherwise it may not work
      targetDir: resolve(__dirname, './posts'),
      excludes: ['index.md'],
    }),
  ],
})
```

引用数据：

```Vue
<script setup lang="ts">
import { data as postData } from 'unplugin-blog-manager/data'

console.log(postData)
</script>
```