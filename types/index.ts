export type PostType = 'THOUGHT' | 'ARTICLE'

export interface User {
  id: string
  username: string
  email: string
  displayName: string
  bio?: string | null
  avatarUrl?: string | null
  createdAt: Date
}

export interface Post {
  id: string
  authorId: string
  type: PostType
  title?: string | null
  body: string
  slug: string
  createdAt: Date
  updatedAt: Date
  author?: User
  _count?: {
    likes: number
    comments: number
    reposts: number
  }
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  body: string
  parentId?: string | null
  createdAt: Date
  author?: User
  replies?: Comment[]
}

export interface Topic {
  id: string
  name: string
  slug: string
}

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}
