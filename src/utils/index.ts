import type { Post, PostData, PostGroupMap } from '../types'

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  if (!(date instanceof Date))
    date = new Date(date)
  return {
    time: +date,
    string: date.toLocaleDateString('en-US', options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }
}

export function categorizePosts(posts: Post[]): PostData {
  const postsByDate: PostGroupMap = {}
  const postsByDir: PostGroupMap = {}
  const postsByTag: PostGroupMap = {}

  posts.forEach((post) => {
    // 按date分类
    if (!postsByDate[post.date.string] && post.date.time)
      postsByDate[post.date.string] = []
    if (post.date.time)
      postsByDate[post.date.string].push(post)

    // By dir
    // - path从posts截断
    const start = post.path.indexOf('\\posts')
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
