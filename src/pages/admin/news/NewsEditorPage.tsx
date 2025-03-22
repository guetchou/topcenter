
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save, Upload, Eye, FileCheck } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { RichTextEditor } from '@/components/RichTextEditor';
import { useQuery } from '@tanstack/react-query';

interface NewsFormData {
  title: string;
  summary: string;
  content: string;
  image_url: string;
  status: 'published' | 'draft';
}

const NewsEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    summary: '',
    content: '',
    image_url: '',
    status: 'draft'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Récupérer les données de l'actualité si en mode édition
  const { data: newsItem, isLoading } = useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      if (!id) return null;
      
      // Simuler une requête API
      return {
        id: '1',
        title: 'Lancement du nouveau service client',
        summary: 'TopCenter lance un nouveau service de support client...',
        content: '<p>Contenu détaillé du nouveau service client de TopCenter...</p>',
        image_url: '/lovable-uploads/staff-tce.jpg',
        status: 'published' as const,
        author: {
          id: '1',
          name: 'Admin'
        },
        created_at: '2023-10-15T10:30:00Z',
        updated_at: '2023-10-15T14:45:00Z'
      };
    },
    enabled: isEditMode
  });

  // Mettre à jour le formulaire avec les données existantes
  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title,
        summary: newsItem.summary,
        content: newsItem.content,
        image_url: newsItem.image_url,
        status: newsItem.status
      });
      
      if (newsItem.image_url) {
        setPreviewImage(newsItem.image_url);
      }
    }
  }, [newsItem]);

  // Gérer les changements de valeur dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer les changements dans l'éditeur de texte riche
  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // Gérer le téléchargement d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simuler le téléchargement d'image (à remplacer par votre logique d'upload)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      setFormData(prev => ({ ...prev, image_url: 'temp_image_url' }));
    };
    reader.readAsDataURL(file);
  };

  // Enregistrer l'actualité
  const handleSave = async (status: 'published' | 'draft' = 'draft') => {
    setIsSaving(true);
    
    try {
      // Valider le formulaire
      if (!formData.title || !formData.summary || !formData.content) {
        toast({
          variant: "destructive",
          title: "Erreur de validation",
          description: "Veuillez remplir tous les champs obligatoires."
        });
        return;
      }
      
      // Préparer les données à envoyer
      const newsData = {
        ...formData,
        status,
        author_id: user?.id
      };
      
      // Appel API pour créer/mettre à jour l'actualité ici
      
      toast({
        title: status === 'published' ? "Actualité publiée" : "Brouillon enregistré",
        description: isEditMode 
          ? "L'actualité a été mise à jour avec succès."
          : "L'actualité a été créée avec succès."
      });
      
      // Redirection vers la liste des actualités
      navigate('/admin/news');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer l'actualité."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="container py-6 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/admin/news')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditMode ? (
              <FormattedMessage id="news.edit" defaultMessage="Modifier l'actualité" />
            ) : (
              <FormattedMessage id="news.add" defaultMessage="Ajouter une actualité" />
            )}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleSave('draft')}
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            <FormattedMessage id="news.draft" defaultMessage="Enregistrer comme brouillon" />
          </Button>
          <Button 
            onClick={() => handleSave('published')}
            disabled={isSaving}
          >
            <FileCheck className="h-4 w-4 mr-2" />
            <FormattedMessage id="news.publish" defaultMessage="Publier" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre de l'actualité"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Résumé</Label>
                <Textarea 
                  id="summary" 
                  name="summary" 
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Bref résumé de l'actualité"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                initialContent={formData.content}
                onChange={handleContentChange}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image principale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {previewImage && (
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={previewImage} 
                    alt="Aperçu" 
                    className="w-full h-auto" 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label 
                    htmlFor="image-upload" 
                    className="cursor-pointer flex items-center justify-center border border-dashed rounded-md p-4 hover:bg-muted transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Télécharger une image
                  </Label>
                  <Input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!formData.title || !formData.content}
              >
                <Eye className="h-4 w-4 mr-2" />
                Prévisualiser
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsEditorPage;
