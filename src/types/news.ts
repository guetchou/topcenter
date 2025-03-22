
export interface News {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  image_url?: string;
  status: 'published' | 'draft' | 'archived';
  published_at?: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
    email?: string;
  };
  categories?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  views_count?: number;
  comments_count?: number;
  likes_count?: number;
  collaborators?: NewsCollaborator[];
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  language?: string;
  translations?: Record<string, NewsTranslation>;
}

export interface NewsTranslation {
  title: string;
  summary: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
}

export interface NewsCollaborator {
  id: string;
  user_id: string;
  news_id: string;
  role: 'editor' | 'viewer' | 'admin';
  name: string;
  email: string;
  added_at: string;
  last_active_at?: string;
}

export interface NewsFilter {
  category?: string;
  tag?: string;
  author?: string;
  status?: 'published' | 'draft' | 'archived' | 'all';
  search?: string;
  featured?: boolean;
  date_from?: string;
  date_to?: string;
  language?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsComment {
  id: string;
  news_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: 'approved' | 'pending' | 'rejected';
  author: {
    name: string;
    avatar_url?: string;
  };
  parent_id?: string;
  replies?: NewsComment[];
}
