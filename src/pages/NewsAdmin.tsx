
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Share2, Eye, Calendar, CheckCircle, XCircle, Image, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

// Type pour les articles
type Article = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  date: string;
  image?: string;
  category: string;
  featured: boolean;
};

const NewsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Simulation de chargement des articles depuis l'API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        // Vous pouvez remplacer cette partie par une vraie appel à l'API Supabase
        setTimeout(() => {
          setArticles([
            {
              id: 1,
              title: "Top Center étend ses services en Afrique Centrale",
              content: "Top Center, leader dans le domaine des centres d'appels et services clients au Congo, annonce aujourd'hui son expansion dans plusieurs pays d'Afrique Centrale. Cette initiative stratégique vise à répondre à une demande croissante de services de relation client de qualité dans la région.\n\nGrâce à notre expertise locale et nos standards internationaux, nous sommes désormais en mesure d'offrir nos services au Gabon, au Cameroun et en République Démocratique du Congo. Cette expansion s'accompagne d'un recrutement de nouveaux talents locaux et d'investissements importants dans nos infrastructures technologiques.\n\n\"Notre objectif est de devenir le partenaire de référence en matière de relation client sur l'ensemble du marché d'Afrique Centrale d'ici 2025\", déclare Gess NGUIE, Manager Général de Top Center.",
              excerpt: "Top Center poursuit sa croissance et s'implante dans de nouveaux pays d'Afrique Centrale pour répondre à la demande croissante.",
              status: "published",
              date: "2024-02-20",
              category: "Entreprise",
              featured: true,
              image: "/lovable-uploads/equipe-topcenter.jpg"
            },
            {
              id: 2,
              title: "L'évolution des centres d'appels en 2024",
              content: "Le secteur des centres d'appels connaît une transformation profonde en 2024, portée par l'intégration de nouvelles technologies et l'évolution des attentes des consommateurs.\n\nL'intelligence artificielle joue désormais un rôle central dans la gestion des interactions clients. Chez Top Center, nous avons déployé des solutions d'IA avancées qui permettent d'analyser les conversations en temps réel et de fournir aux agents les informations nécessaires pour résoudre rapidement les problèmes des clients.\n\nLe support omnicanal s'est également imposé comme un standard incontournable. Les clients s'attendent à pouvoir contacter les entreprises via leur canal préféré - que ce soit par téléphone, email, chat ou réseaux sociaux - et à bénéficier d'une expérience cohérente.\n\nEnfin, le travail à distance a redéfini l'organisation des centres d'appels. Notre modèle hybride permet désormais à nos agents de travailler aussi bien depuis nos locaux que depuis leur domicile, tout en maintenant les mêmes standards de qualité.",
              excerpt: "Découvrez comment l'IA, l'omnicanal et le travail hybride transforment le secteur des centres d'appels en 2024.",
              status: "draft",
              date: "2024-02-18",
              category: "Technologie",
              featured: false
            },
            {
              id: 3,
              title: "Comment améliorer la satisfaction client grâce aux données",
              content: "Dans l'économie actuelle centrée sur le client, la capacité à exploiter les données pour améliorer l'expérience client est devenue un avantage compétitif majeur.\n\nChez Top Center, nous utilisons l'analyse avancée des données pour optimiser chaque interaction client. En collectant et en analysant systématiquement les retours, les comportements et les préférences des clients, nous sommes en mesure d'identifier précisément les points de friction et d'y apporter des solutions adaptées.\n\nL'analyse prédictive nous permet également d'anticiper les besoins des clients et de personnaliser leur expérience. Par exemple, nos systèmes peuvent identifier quand un client est susceptible de rencontrer un problème particulier et proposer une assistance proactive.\n\nEnfin, le partage des insights tirés des données avec l'ensemble de l'organisation permet d'aligner tous les départements sur les attentes réelles des clients et d'améliorer continuellement nos processus et nos services.",
              excerpt: "Découvrez comment l'analyse des données permet d'offrir une expérience client personnalisée et proactive.",
              status: "published",
              date: "2024-01-15",
              category: "Satisfaction client",
              featured: true
            }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les articles.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);
  
  const resetForm = () => {
    setCurrentArticle({
      id: Date.now(), // Temporaire pour simulation
      title: "",
      content: "",
      excerpt: "",
      status: "draft",
      date: new Date().toISOString().split('T')[0],
      category: "",
      featured: false
    });
  };

  const handleCreateNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleEdit = (article: Article) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setArticles(prev => prev.filter(article => article.id !== id));
    toast({
      title: "Article supprimé",
      description: "L'article a été supprimé avec succès."
    });
  };

  const handleSave = () => {
    if (!currentArticle) return;
    
    if (currentArticle.id && articles.some(a => a.id === currentArticle.id)) {
      // Mise à jour
      setArticles(prev => prev.map(article => 
        article.id === currentArticle.id ? currentArticle : article
      ));
      toast({
        title: "Article mis à jour",
        description: "L'article a été modifié avec succès."
      });
    } else {
      // Création
      setArticles(prev => [...prev, currentArticle]);
      toast({
        title: "Article créé",
        description: "L'article a été créé avec succès."
      });
    }
    
    setIsEditing(false);
  };

  const handleShare = (id: number) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: `https://topcenter.cg/blog/${id}`
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
      navigator.clipboard.writeText(`https://topcenter.cg/blog/${id}`);
      toast({
        title: "Lien copié",
        description: "Le lien de l'article a été copié dans le presse-papier."
      });
    }
  };

  const handlePublish = (id: number, status: 'draft' | 'published') => {
    setArticles(prev => prev.map(article => 
      article.id === id ? {...article, status} : article
    ));
    
    toast({
      title: status === 'published' ? "Article publié" : "Article mis en brouillon",
      description: status === 'published' 
        ? "L'article est maintenant visible sur le site." 
        : "L'article a été retiré du site."
    });
  };
  
  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.status === filter);

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
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={currentArticle?.date || ''} 
                  onChange={(e) => setCurrentArticle(prev => prev ? {...prev, date: e.target.value} : null)} 
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
              <Label htmlFor="image">Image principale</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="image" 
                  value={currentArticle?.image || ''} 
                  onChange={(e) => setCurrentArticle(prev => prev ? {...prev, image: e.target.value} : null)} 
                  placeholder="URL de l'image"
                />
                <Button type="button" variant="outline" size="sm">
                  <Image className="h-4 w-4 mr-2" />
                  Parcourir
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured" 
                checked={currentArticle?.featured || false} 
                onCheckedChange={(checked) => setCurrentArticle(prev => prev ? {...prev, featured: checked} : null)} 
              />
              <Label htmlFor="featured">Mettre en avant sur la page d'accueil</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => currentArticle && setCurrentArticle({...currentArticle, status: "draft"})}
              >
                Enregistrer comme brouillon
              </Button>
              <Button onClick={handleSave}>
                {currentArticle?.status === "published" ? "Publier les modifications" : "Publier"}
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
                <Card key={article.id} className={article.featured ? "border-primary/50" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={article.status === "published" ? "default" : "secondary"}>
                          {article.status === "published" ? "Publié" : "Brouillon"}
                        </Badge>
                        {article.featured && (
                          <Badge variant="outline" className="border-primary text-primary">
                            En vedette
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {article.date}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-2">{article.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                    
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive/90"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirmer la suppression</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setOpenDialog(false)}>Annuler</Button>
                              <Button 
                                variant="destructive"
                                onClick={() => {
                                  handleDelete(article.id);
                                  setOpenDialog(false);
                                }}
                              >
                                Supprimer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {article.status === "draft" ? (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handlePublish(article.id, "published")}
                            title="Publier"
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
    </div>
  );
};

export default NewsAdmin;
