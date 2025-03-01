
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, Share2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Import our blog articles data
import { blogArticles } from "@/data/blog-articles";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    // Find the article from our data
    const foundArticle = blogArticles.find(a => a.id.toString() === id);
    
    if (foundArticle) {
      setArticle(foundArticle);
      
      // Find related posts with the same category or tags
      const related = blogArticles
        .filter(a => a.id !== foundArticle.id)
        .filter(a => 
          a.category === foundArticle.category || 
          a.tags.some(tag => foundArticle.tags.includes(tag))
        )
        .slice(0, 3);
      
      setRelatedPosts(related);
    }
    
    setLoading(false);
    
    // Scroll to top when article changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien de l'article a été copié dans le presse-papier."
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-muted rounded mb-6"></div>
          <div className="h-64 bg-muted rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
        <p className="text-muted-foreground mb-6">
          L'article que vous recherchez n'existe pas ou a été déplacé.
        </p>
        <Button onClick={() => navigate("/blog")}>
          Retour aux actualités
        </Button>
      </div>
    );
  }

  // Function to create HTML from the article content
  const createMarkup = () => {
    return { __html: article.content };
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="group mr-auto"
          onClick={() => navigate("/blog")}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour aux actualités
        </Button>
      </div>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap gap-3 items-center text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>
            
            <span className="text-muted-foreground">•</span>
            
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>{article.author}</span>
            </div>
            
            <span className="text-muted-foreground">•</span>
            
            <Badge>{article.category}</Badge>
          </div>
          
          <p className="text-xl text-muted-foreground mb-6">
            {article.excerpt}
          </p>
        </header>
        
        <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-8">
          <span className="font-medium flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Tags:
          </span>
          {article.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="mr-2">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={`/lovable-uploads/avatar-homme.png`} alt={article.author} />
              <AvatarFallback>{article.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{article.author}</p>
              <p className="text-sm text-muted-foreground">Expert en relation client</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </article>
      
      <Separator className="my-12" />
      
      {/* Recommended articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedPosts.map(post => (
              <Card key={post.id} className="h-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/blog/${post.id}`)}>
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(post.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
