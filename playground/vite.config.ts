import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from 'unplugin-blog-manager/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin({
      author: 'jic999(only test)',
      targetDir: resolve(__dirname, './posts'),
      excludes: ['index.md'],
    }),
  ],
})
