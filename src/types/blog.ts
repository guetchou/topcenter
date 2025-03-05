
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
  media_gallery?: Json;
  
  // Mapped fields for backwards compatibility
  date?: string;
  featured?: boolean;
  image?: string;
};

export type DisplayBlogPost = BlogPost & {
  author_name?: string;
  author_avatar?: string;
}
