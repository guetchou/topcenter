
export interface News {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  image_url?: string;
  status: 'published' | 'draft';
  published_at?: string;
  author: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  categories?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  views_count?: number;
  comments_count?: number;
  collaborators?: NewsCollaborator[];
  featured?: boolean;
}

export interface NewsCollaborator {
  id: string;
  user_id: string;
  news_id: string;
  role: 'editor' | 'viewer';
  name: string;
  email: string;
  added_at: string;
}

export interface NewsFilter {
  category?: string;
  tag?: string;
  author?: string;
  status?: 'published' | 'draft' | 'all';
  search?: string;
  featured?: boolean;
  date_from?: string;
  date_to?: string;
}
