
import { z } from 'zod';

export const articleFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters' }),
  excerpt: z.string().optional(),
  content: z.string(),
  category_id: z.string().optional(),
  published: z.boolean().default(false),
  featured_image: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  author_id: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;
