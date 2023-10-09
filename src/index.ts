import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options, Post } from './types'
import { categorizePosts, formatDate, isNormalParagraph } from './utils'

export const unpluginFactory: UnpluginFactory<Options> = (options) => {
  const targetDir = options.targetDir
  const excludes = options.excludes || []

  const readDir = (dirPath: string) => {
    const list: string[] = []
    const files = fs.readdirSync(dirPath)
    files.forEach((file) => {
      const filePath = path.join(dirPath, file)
      const stats = fs.statSync(filePath)
      if (stats.isDirectory())
        list.push(...readDir(filePath))
      else if (
        stats.isFile()
      && filePath.endsWith('.md')
      && !excludes.includes(filePath)
      )
        list.push(filePath)
    })
    return list
  }
  const articleFiles = readDir(targetDir)

  const posts = articleFiles
    .map((articleFile) => {
      const articleContent = fs.readFileSync(articleFile, 'utf-8')
      let { data, excerpt } = matter(articleContent, { excerpt: true })
      // 计算阅读时间
      const md = new MarkdownIt()
      const tokens = md.parse(articleContent, {})
      // 若无摘录 excerpt，则自动生成
      if (!excerpt) {
        excerpt = ''
        const filterTokens = tokens.filter(item => item.children?.length === 1)
        for (const token of filterTokens) {
          if (isNormalParagraph(token.content))
            excerpt += token.content
          if (excerpt.length > 120)
            break
        }
      }
      return {
        author: options.author,
        ...data,
        date: formatDate(data.date),
        excerpt,
        path: articleFile.substring(articleFile.lastIndexOf('/posts/')).replace(/\.md$/, ''),
        readingTime: Math.ceil(tokens.length / 30),
      } as Post
    })
    .sort((a, b) => b.date.time - a.date.time)
  const postData = categorizePosts(posts)

  return {
    name: 'unplugin-blog-manager',
    resolveId(source) {
      if (source === 'unplugin-blog-manager/blogs')
        return source
      return null
    },
    load(id) {
      if (id === 'unplugin-blog-manager/blogs')
        return `export default ${JSON.stringify(postData)}`
      return null
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
