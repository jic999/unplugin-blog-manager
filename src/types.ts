export interface Options {
  targetDir: string
  author?: string
  excludes?: string[]
}

export interface Post {
  title: string
  author: string
  url: string
  path: string
  content: string
  date: {
    time: number
    string: string
  }
  excerpt?: string
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
