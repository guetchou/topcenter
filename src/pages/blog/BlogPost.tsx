
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<BlogPost & { author_name?: string; author_avatar?: string }>();
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);

        if (!id) return;

        // Fetch the article
        const { data: article, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles:author_id(full_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!article) {
          navigate('/blog');
          return;
        }

        // Map the profile data
        let authorName = "Auteur inconnu";
        let authorAvatar = null;
        
        if (article.profiles && typeof article.profiles === 'object') {
          // @ts-ignore - we know the structure
          authorName = article.profiles.full_name || authorName;
          // @ts-ignore - we know the structure
          authorAvatar = article.profiles.avatar_url;
        }

        // Ensure the status is of the correct type for BlogPost
        const status = article.status === 'published' ? 'published' : 'draft';

        const articleWithAuthor = {
          ...article,
          status: status as 'draft' | 'published',
          author_name: authorName,
          author_avatar: authorAvatar
        };

        // Now set the state with properly typed object
        setArticle(articleWithAuthor);

        // Fetch related articles in the same category
        const { data: related, error: relatedError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .eq('category', article.category)
          .neq('id', id)
          .limit(3);

        if (relatedError) throw relatedError;

        setRelatedArticles(related as BlogPost[] || []);
      } catch (error) {
        console.error("Erreur lors du chargement de l'article:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'article demandé.",
          variant: "destructive"
        });
        navigate('/blog');
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
        text: article.excerpt || article.title,
        url: window.location.href
      }).catch((error) => console.error('Erreur lors du partage:', error));
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien de l'article a été copié dans le presse-papier."
      });
    }
  };

  return (
    <div className="container py-12">
      <Button
        variant="ghost"
        className="mb-8 group"
        onClick={() => navigate("/blog")}
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Retour aux actualités
      </Button>

      {isLoading ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ) : article ? (
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4">
              {article.category}
            </Badge>
            <h1 className="text-4xl font-bold mb-6">{article.title}</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={article.author_avatar || undefined} alt={article.author_name} />
                  <AvatarFallback>
                    <User className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{article.author_name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(article.created_at)}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>

          {article.featured_image_url && (
            <div className="mb-10">
              <img
                src={article.featured_image_url}
                alt={article.title}
                className="w-full h-auto rounded-lg object-cover max-h-[500px]"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-16">
            {article.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-16 border-t pt-10">
              <h2 className="text-2xl font-bold mb-6">Articles associés</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card
                    key={relatedArticle.id}
                    className="hover-lift cursor-pointer"
                    onClick={() => {
                      navigate(`/blog/${relatedArticle.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {relatedArticle.featured_image_url && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={relatedArticle.featured_image_url}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">
                        {relatedArticle.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(relatedArticle.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Article introuvable</h2>
          <p className="text-muted-foreground mb-6">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/blog")}>
            Voir tous les articles
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;
