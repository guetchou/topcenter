
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/api';
import { articleFormSchema, ArticleFormValues } from './articleSchema';
import { MainArticleFields } from './components/MainArticleFields';
import { PublishingOptions } from './components/PublishingOptions';
import { FeaturedImage } from './components/FeaturedImage';
import { SeoOptions } from './components/SeoOptions';

interface ArticleFormProps {
  initialData?: Partial<ArticleFormValues>;
  articleId?: string;
  categories: any[];
  authors: any[];
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ 
  initialData, 
  articleId, 
  categories, 
  authors 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>(initialData?.featured_image || null);

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      category_id: initialData?.category_id || '',
      published: initialData?.published || false,
      featured_image: initialData?.featured_image || '',
      meta_title: initialData?.meta_title || '',
      meta_description: initialData?.meta_description || '',
      author_id: initialData?.author_id || '',
      status: initialData?.status || 'draft',
    },
  });

  const onSubmit = async (values: ArticleFormValues) => {
    try {
      setIsLoading(true);
      
      if (imageUrl) {
        values.featured_image = imageUrl;
      }
      
      if (articleId) {
        await api.put(`/admin/articles/${articleId}`, values);
        toast.success('Article updated successfully');
      } else {
        await api.post('/admin/articles', values);
        toast.success('Article created successfully');
      }
      
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = () => {
    const title = form.getValues('title');
    if (!title) return;
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    form.setValue('slug', slug);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MainArticleFields form={form} generateSlug={generateSlug} />
          
          <div className="space-y-6">
            <PublishingOptions form={form} categories={categories} authors={authors} />
            
            <FeaturedImage 
              form={form} 
              imageUrl={imageUrl} 
              setImageUrl={setImageUrl} 
            />
            
            <SeoOptions form={form} />
          </div>
        </div>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/articles')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Saving...
              </>
            ) : articleId ? (
              'Update Article'
            ) : (
              'Create Article'
            )}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default ArticleForm;
