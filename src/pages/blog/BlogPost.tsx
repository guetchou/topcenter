
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Article = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  date: string;
  category: string;
  image?: string;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Récupérer l'article
        const { data: articleData, error: articleError } = await supabase
          .from('blog_posts')
          .select('*, profiles(full_name, avatar_url)')
          .eq('id', id)
          .eq('status', 'published')
          .single();
        
        if (articleError) throw articleError;
        
        if (articleData) {
          // Format de l'article avec les informations de l'auteur
          const formattedArticle: Article = {
            ...articleData,
            author_name: articleData.profiles?.full_name || 'Équipe TopCenter',
            author_avatar: articleData.profiles?.avatar_url || '/lovable-uploads/avatar_homme.png'
          };
          
          setArticle(formattedArticle);
          
          // Récupérer les articles connexes de la même catégorie
          const { data: relatedData, error: relatedError } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .eq('category', formattedArticle.category)
            .neq('id', id)
            .limit(3);
          
          if (!relatedError && relatedData) {
            setRelatedArticles(relatedData as Article[]);
          }
        } else {
          navigate('/blog');
          toast({
            title: "Article introuvable",
            description: "L'article que vous recherchez n'existe pas ou a été retiré.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'article:", error);
        navigate('/blog');
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = () => {
    if (!article) return;
    
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      }).catch(err => {
        console.error('Erreur lors du partage:', err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Lien copié",
      description: "Le lien de l'article a été copié dans le presse-papier."
    });
  };

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <div className="flex items-center space-x-4 mb-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="group mb-8"
          onClick={() => navigate("/blog")}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour aux articles
        </Button>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(article.date)}
              </div>
              <Badge>{article.category}</Badge>
              <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8"
              />
            )}
          </header>

          <div className="prose prose-stone dark:prose-invert max-w-none mb-16">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">{paragraph}</p>
            ))}
          </div>

          <footer className="border-t pt-8">
            <div className="flex items-center">
              <img
                src={article.author_avatar}
                alt={article.author_name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <p className="font-medium">Auteur</p>
                <p className="text-muted-foreground">{article.author_name}</p>
              </div>
            </div>
          </footer>
        </article>

        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Card 
                  key={related.id} 
                  className="hover-lift overflow-hidden cursor-pointer group"
                  onClick={() => {
                    navigate(`/blog/${related.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  {related.image && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(related.date)}
                    </div>
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">{related.title}</h3>
                    <Button variant="ghost" size="sm" className="group/btn mt-2 text-xs p-0 h-auto">
                      Lire <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
