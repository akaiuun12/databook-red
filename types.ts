
export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  author: Author;
  coverImage: string;
  readingTime: string;
}

export type ViewState = 'feed' | 'post' | 'editor';
