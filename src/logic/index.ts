import path from 'node:path'
import fs from 'node:fs'
import type { Post, PostData, PostGroupMap } from '../types'

export function readDir(dirPath: string, excludes: string[]) {
  const list: string[] = []
  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory())
      list.push(...readDir(filePath, excludes))
    else if (
      stats.isFile()
    && filePath.endsWith('.md')
    && !excludes.includes(filePath)
    )
      list.push(filePath)
  })
  return list
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  if (!(date instanceof Date))
    date = new Date(date)
  return {
    timestamp: +date,
    date: date.toLocaleDateString('en-US', options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }
}

export function categorizePosts(posts: Post[], targetDir: string): PostData {
  const postsByDate: PostGroupMap = {}
  const postsByDir: PostGroupMap = {}
  const postsByTag: PostGroupMap = {}

  posts.forEach((post) => {
    // 按date分类
    if (!postsByDate[post.date] && post.date)
      postsByDate[post.date] = []
    if (post.date)
      postsByDate[post.date].push(post)

    // By dir
    // - path从posts截断
    const start = post.path.indexOf(targetDir)
    post.path = post.path.substring(start, post.path.length).split('\\').join('/')
    // - 倒数第二个即为目录
    const dirArr = post.path.split('/')
    const dirName = dirArr[dirArr.length - 2]
    if (!postsByDir[dirName])
      postsByDir[dirName] = []
    post.dir = dirName
    postsByDir[dirName].push(post)

    // By tag
    const tagList = post.tags || []
    tagList.forEach((tag) => {
      if (!postsByTag[tag])
        postsByTag[tag] = []
      postsByTag[tag].push(post)
    })
  })
  return {
    posts,
    postsByDate,
    postsByDir,
    postsByTag,
  }
}

export function isNormalParagraph(mdText: string) {
  const imagePattern = /!\[[^\]]*\]\((.*?)\)/
  const linkPattern = /\[[^\]]*\]\((.*?)\)/
  const tablePattern = /\|.*\|/
  const headerPattern = /#{1,6} .*/

  if (
    imagePattern.test(mdText)
    || linkPattern.test(mdText)
    || tablePattern.test(mdText)
    || headerPattern.test(mdText)
  )
    return false
  return true
}
