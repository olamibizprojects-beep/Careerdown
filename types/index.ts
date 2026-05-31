// Type stubs — will be expanded in Phase 2

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  createdAt?: Date;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  commentCount: number;
  tags: string[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  createdAt: Date;
  upvotes: number;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface TrendingTopic {
  tag: string;
  count: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}
