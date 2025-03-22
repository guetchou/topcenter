
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArticleForm } from './ArticleForm';
import { ArticleFormValues } from './articleSchema';

const ArticleEditor = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<ArticleFormValues>>({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await api.get('/admin/authors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
        toast.error('Failed to load authors');
      }
    };

    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await api.get(`/admin/articles/${id}`);
        const article = response.data;
        
        setInitialData({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || '',
          content: article.content || '',
          category_id: article.category_id || '',
          published: article.published || false,
          featured_image: article.featured_image || '',
          meta_title: article.meta_title || '',
          meta_description: article.meta_description || '',
          author_id: article.author_id || '',
          status: article.status || 'draft',
        });
      } catch (error) {
        console.error('Error fetching article:', error);
        toast.error('Failed to load article data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchAuthors();
    fetchArticle();
  }, [id]);

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{id ? 'Edit Article' : 'Create New Article'}</CardTitle>
        </CardHeader>
      </Card>
      
      <ArticleForm 
        initialData={initialData}
        articleId={id}
        categories={categories}
        authors={authors}
      />
    </>
  );
};

export default ArticleEditor;
