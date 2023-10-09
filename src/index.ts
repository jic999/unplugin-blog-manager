import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options, Post } from './types'
import { categorizePosts, formatDate, isNormalParagraph, readDir } from './logic'

export const unpluginFactory: UnpluginFactory<Options> = (options) => {
  const targetDir = options.targetDir
  const excludes = options.excludes || []

  const targetDirname = targetDir.split(path.sep).pop()!
  const articleFiles = readDir(targetDir, excludes)
  const md = new MarkdownIt()

  const posts = articleFiles
    .map((articleFile) => {
      // get article content
      const articleContent = fs.readFileSync(articleFile, 'utf-8')
      // get front matter
      let { data, excerpt } = matter(articleContent, { excerpt: true })
      // get md
      const tokens = md.parse(articleContent, {})

      // - author
      const author = options.author
      // - date & timestamp
      const times = formatDate(data.date)
      // - excerpt
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

      // - path
      const path = articleFile
        .substring(articleFile.lastIndexOf(targetDirname) - 1)
        .replaceAll('\\', '/')
        .replace(/\.md$/, '')
      // - readingTime
      const readingTime = Math.ceil(tokens.length / 30)
      return {
        author,
        ...data,
        date: times.date,
        timestamp: times.timestamp,
        excerpt,
        path,
        readingTime,
      } as Post
    })
    .sort((a, b) => b.timestamp - a.timestamp)
  const postData = categorizePosts(posts, targetDir)

  return {
    name: 'unplugin-blog-manager',
    resolveId(source) {
      if (source === 'unplugin-blog-manager/data')
        return source
      return null
    },
    load(id) {
      if (id === 'unplugin-blog-manager/data')
        return `export const data = ${JSON.stringify(postData)}`
      return null
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
