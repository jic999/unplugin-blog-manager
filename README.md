# unplugin-blog-manager

<p align="center">English | <a href="./README.zh.md">简体中文</a></p>

A plugin that helps you manage and organize blog posts, based on [unplugin](https://github.com/unjs/unplugin). It will index and classify your blog posts according to the *front matter* information in your blog posts, and provide an easy-to-render and use data object.

Just these, it seems that a plugin is not needed to complete. Indeed, I mainly want to learn how to develop an unplugin plugin, so there is *unplugin-blog-manager*😊.

## Install

```bash
npm i unplugin-blog-manager -D
```

## Usage

take vite as an example:

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

Reference data:

```Vue
<script setup lang="ts">
import { data as postData } from 'unplugin-blog-manager/data'

console.log(postData)
</script>
```