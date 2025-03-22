import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from '@/components/RichTextEditor';
import { useToast } from "@/components/ui/use-toast";
import { News } from '@/types/news';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const ArticleEditor = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: articleId } = useParams<{ id: string }>();

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, "yyyy-MM-dd") : "";
  };

  const fetchArticle = useCallback(async () => {
    if (articleId) {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) {
        toast({
          title: 'Error fetching article',
          description: error.message,
          variant: 'destructive',
        });
      }

      if (data) {
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
        setStatus(data.status);
        setImageUrl(data.image_url || '');
        setIsFeatured(data.featured || false);
        setSeoTitle(data.seo_title || '');
        setSeoDescription(data.seo_description || '');
        setPublishedAt(data.published_at ? new Date(data.published_at) : undefined);
      }
    }
  }, [articleId, toast]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleSave = async (newStatus: News['status']) => {
    setIsSaving(true);

    const articleData = {
      title,
      summary,
      content,
      status: newStatus,
      image_url: imageUrl,
      featured: isFeatured,
      seo_title: seoTitle,
      seo_description: seoDescription,
      published_at: formatDate(publishedAt),
    };

    try {
      if (articleId) {
        const { error } = await supabase
          .from('news')
          .update(articleData)
          .eq('id', articleId);

        if (error) {
          throw error;
        }

        toast({
          title: 'Article mis à jour',
          description: 'L\'article a été mis à jour avec succès.',
        });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([articleData]);

        if (error) {
          throw error;
        }

        toast({
          title: 'Article créé',
          description: 'L\'article a été créé avec succès.',
        });
      }

      navigate('/admin/news');
    } catch (error: any) {
      toast({
        title: 'Erreur lors de l\'enregistrement',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = () => handleSave('published');
  const handleSaveAsDraft = () => handleSave('draft');

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{articleId ? 'Modifier l\'article' : 'Nouvel article'}</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/news')}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveAsDraft}
            variant="secondary"
            disabled={isSaving}
          >
            Enregistrer comme brouillon
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isSaving}
          >
            {isSaving ? 'Enregistrement...' : 'Publier'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu de l'article</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Titre de l'article"
                />
              </div>
              
              <div>
                <Label htmlFor="summary">Résumé</Label>
                <Textarea 
                  id="summary" 
                  value={summary} 
                  onChange={(e) => setSummary(e.target.value)} 
                  placeholder="Bref résumé de l'article"
                />
              </div>
              
              <div>
                <Label>Contenu</Label>
                <RichTextEditor 
                  value={content} 
                  onChange={setContent} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Paramètres SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">SEO Title</Label>
                <Input
                  id="seo-title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Titre SEO de l'article"
                />
              </div>
              <div>
                <Label htmlFor="seo-description">SEO Description</Label>
                <Textarea
                  id="seo-description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Description SEO de l'article"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as 'published' | 'draft')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="image-url">URL de l'image</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL de l'image"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked || false)}
                />
                <Label htmlFor="featured">Article mis en avant</Label>
              </div>

              <div>
                <Label>Date de publication</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !publishedAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {publishedAt ? format(publishedAt, "PPP") : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={publishedAt}
                      onSelect={setPublishedAt}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
