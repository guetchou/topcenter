
import { Json } from "@/integrations/supabase/types";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  category: string;
  featured_image_url: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  slug: string;
  featured?: boolean;
  media_gallery?: Json;
};

export interface BlogPostProps {
  post: BlogPost;
  title?: string;
}

export interface NewsProps {
  title?: string;
  description?: string;
}

