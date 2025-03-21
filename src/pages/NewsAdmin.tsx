import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Share2, Eye, Calendar, CheckCircle, XCircle, Image, Send, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { BlogPost } from "@/types/blog";
import { slugify } from "@/lib/utils";

const NewsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<BlogPost> | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Vérification que l'utilisateur a le rôle admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Chargement des articles depuis Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        
        const response = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .execute();
        
        if (response.error) {
          throw response.error;
        }
        
        if (response.data) {
          setArticles(response.data as BlogPost[]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);
  
  const resetForm = () => {
    setCurrentArticle({
      title: "",
      content: "",
      excerpt: "",
      status: "draft",
      category: "",
      featured_image_url: "",
      slug: ""
    });
  };

  const handleCreateNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleEdit = (article: BlogPost) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsSubmitting(true);
      const response = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deleteId)
        .execute();
      
      if (response.error) throw response.error;
      
      setArticles(prev => prev.filter(article => article.id !== deleteId));
      
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!currentArticle || !user?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Create slug if needed
      if (!currentArticle.slug) {
        currentArticle.slug = slugify(currentArticle.title || '');
      }
      
      // Ensure that all required fields are set
      const articleData = {
        ...currentArticle,
        author_id: user.id,
        title: currentArticle.title || '',
        content: currentArticle.content || '',
        category: currentArticle.category || 'Général',
        slug: currentArticle.slug || '',
        published_at: currentArticle.status === 'published' ? new Date().toISOString() : null,
        status: currentArticle.status || 'draft'
      };
      
      let result;
      
      if (currentArticle.id) {
        // Update
        const response = await supabase
          .from('blog_posts')
          .update(articleData)
          .eq('id', currentArticle.id)
          .execute();
        
        if (response.error) throw response.error;
        
        setArticles(prev => prev.map(article => 
          article.id === currentArticle.id ? { ...article, ...articleData } as BlogPost : article
        ));
        
        toast({
          title: "Article mis à jour",
          description: "L'article a été modifié avec succès."
        });
      } else {
        // Create
        const response = await supabase
          .from('blog_posts')
          .insert(articleData)
          .execute();
        
        if (response.error) throw response.error;
        result = response.data;
        
        if (response.data && response.data[0]) {
          setArticles(prev => [response.data[0] as BlogPost, ...prev]);
        }
        
        toast({
          title: "Article créé",
          description: "L'article a été créé avec succès."
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'article.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const handleShare = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt || article.title,
        url: `${window.location.origin}/blog/${id}`
      }).catch(err => {
        console.error('Erreur lors du partage:', err);
        toast({
          title: "Erreur de partage",
          description: "Impossible de partager l'article.",
          variant: "destructive"
        });
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
      toast({
        title: "Lien copié",
        description: "Le lien de l'article a été copié dans le presse-papier."
      });
    }
  };

  const handlePublish = async (id: string, status: 'draft' | 'published') => {
    try {
      setIsSubmitting(true);
      
      const response = await supabase
        .from('blog_posts')
        .update({ 
          status, 
          published_at: status === 'published' ? new Date().toISOString() : null 
        })
        .eq('id', id)
        .execute();
      
      if (response.error) throw response.error;
      
      setArticles(prev => prev.map(article => 
        article.id === id ? {...article, status} as BlogPost : article
      ));
      
      toast({
        title: status === 'published' ? "Article publié" : "Article mis en brouillon",
        description: status === 'published' 
          ? "L'article est maintenant visible sur le site." 
          : "L'article a été retiré du site."
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'article.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.status === filter);

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          className="group"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </Button>
        <h1 className="text-3xl font-bold">Administration des Actualités</h1>
      </div>

      {isEditing ? (
        // Formulaire d'édition
        <Card>
          <CardHeader>
            <CardTitle>{currentArticle?.id ? "Modifier l'article" : "Nouvel article"}</CardTitle>
            <CardDescription>
              {currentArticle?.id 
                ? "Modifiez les informations de l'article" 
                : "Créez un nouvel article pour le blog"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input 
                id="title" 
                value={currentArticle?.title || ''} 
                onChange={(e) => setCurrentArticle(prev => prev ? {...prev, title: e.target.value} : null)} 
                placeholder="Titre de l'article"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={currentArticle?.category || ''} 
                  onValueChange={(value) => setCurrentArticle(prev => prev ? {...prev, category: value} : null)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entreprise">Entreprise</SelectItem>
                    <SelectItem value="Technologie">Technologie</SelectItem>
                    <SelectItem value="Satisfaction client">Satisfaction client</SelectItem>
                    <SelectItem value="Innovation">Innovation</SelectItem>
                    <SelectItem value="Formation">Formation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input 
                  id="slug" 
                  value={currentArticle?.slug || ''} 
                  onChange={(e) => setCurrentArticle(prev => prev ? {...prev, slug: e.target.value} : null)} 
                  placeholder="slug-de-article"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea 
                id="excerpt" 
                value={currentArticle?.excerpt || ''} 
                onChange={(e) => setCurrentArticle(prev => prev ? {...prev, excerpt: e.target.value} : null)} 
                placeholder="Court résumé de l'article"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea 
                id="content" 
                value={currentArticle?.content || ''} 
                onChange={(e) => setCurrentArticle(prev => prev ? {...prev, content: e.target.value} : null)} 
                placeholder="Contenu détaillé de l'article"
                rows={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featured_image_url">Image principale</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="featured_image_url" 
                  value={currentArticle?.featured_image_url || ''} 
                  onChange={(e) => setCurrentArticle(prev => prev ? {...prev, featured_image_url: e.target.value} : null)} 
                  placeholder="URL de l'image"
                />
                <Button type="button" variant="outline" size="sm">
                  <Image className="h-4 w-4 mr-2" />
                  Parcourir
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>Annuler</Button>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => currentArticle && setCurrentArticle({...currentArticle, status: "draft"})}
                disabled={isSubmitting}
              >
                Enregistrer comme brouillon
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  currentArticle?.status === "published" ? "Publier les modifications" : "Publier"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        // Liste des articles
        <>
          <div className="flex justify-between items-center mb-8">
            <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as any)}>
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="published">Publiés</TabsTrigger>
                <TabsTrigger value="draft">Brouillons</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button className="group" onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </div>

          <div className="grid gap-4">
            {isLoading ? (
              // Affichage des skeletons pendant le chargement
              Array(3).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-start">
                      <Skeleton className="w-32 h-full rounded-l-lg" />
                      <div className="p-6 flex-1">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex items-center mt-4">
                          <Skeleton className="h-5 w-20 rounded-full mr-2" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredArticles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={article.status === "published" ? "default" : "secondary"}>
                          {article.status === "published" ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.created_at)}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-2">{article.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt || ''}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge variant="outline">{article.category}</Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleShare(article.id)}
                          title="Partager"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/blog/${article.id}`)}
                          title="Prévisualiser"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(article)}
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => confirmDelete(article.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {article.status === "draft" ? (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handlePublish(article.id, "published")}
                            title="Publier"
                            disabled={isSubmitting}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-amber-600 hover:text-amber-700"
                            onClick={() => handlePublish(article.id, "draft")}
                            title="Retirer de la publication"
                            disabled={isSubmitting}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {!isLoading && filteredArticles.length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Aucun article trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  {filter === 'all' 
                    ? "Vous n'avez pas encore créé d'articles." 
                    : filter === 'published' 
                      ? "Vous n'avez pas encore d'articles publiés."
                      : "Vous n'avez pas de brouillons en cours."}
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un article
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Dialog de confirmation pour la suppression */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={isSubmitting}>Annuler</Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsAdmin;
