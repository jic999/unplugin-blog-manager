export interface Options {
  targetDir: string
  author?: string
  excludes?: string[]
}

export interface Post {
  title: string
  /**
   * first: front matter
   * second: options.author
   */
  author: string
  /**
   * first: front matter
   * second: first paragraph or previous normal paragraph
   */
  excerpt?: string
  url: string
  path: string
  content: string
  date: string
  timestamp: number
  banner?: string
  tags?: string[]
  dir?: string
  readingTime?: number
  [k: string]: any
}

export interface PostGroupMap { [k: string]: Post[] }
export interface PostData {
  posts: Post[]
  postsByDate: PostGroupMap
  postsByDir: PostGroupMap
  postsByTag: PostGroupMap
}
