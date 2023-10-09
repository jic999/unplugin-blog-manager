import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin({
      author: 'jic999',
      targetDir: './posts',
      excludes: ['index.md'],
    }),
  ],
})
