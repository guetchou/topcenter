
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiContentWrapper } from "@/components/ApiContentWrapper";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { Spinner } from "@/components/ui/spinner";

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  author: string;
  created_at: string;
  tags?: string[];
  summary?: string;
  meta_description?: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  
  const {
    data: post,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      // Simuler un délai pour montrer l'animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      return data as BlogPostData;
    },
    // Désactiver la récupération automatique
    enabled: !!id,
  });

  return (
    <ApiContentWrapper
      data={post}
      isLoading={isLoading}
      error={error as Error | null}
      refetch={refetch}
      loadingFallback={<BlogPostSkeleton />}
      fallback={<BlogPostFallback />}
    >
      {(blogPost) => (
        <BlogPostContent blogPost={blogPost} />
      )}
    </ApiContentWrapper>
  );
};

// Composant principal de contenu d'article
const BlogPostContent = ({ blogPost }: { blogPost: BlogPostData }) => {
  const dateFormatted = formatDistance(
    new Date(blogPost.created_at),
    new Date(),
    { addSuffix: true, locale: fr }
  );

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Helmet>
        <title>{blogPost.title} | TopCenter Blog</title>
        <meta name="description" content={blogPost.meta_description || blogPost.summary || `${blogPost.title} - Blog TopCenter`} />
      </Helmet>
      
      <div className="mb-8 animate-fade-in-top">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-4 hover-lift text-muted-foreground"
        >
          <Link to="/blog">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Retour aux articles
          </Link>
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogPost.title}</h1>
        
        <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{dateFormatted}</span>
          </div>
          
          <div className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            <span>{blogPost.author}</span>
          </div>
          
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((tag, index) => (
                <div key={index} className="flex items-center">
                  <Tag className="mr-1 h-3 w-3" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {blogPost.image_url && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-md animate-fade-in">
          <img 
            src={blogPost.image_url} 
            alt={blogPost.title} 
            className="w-full h-64 md:h-96 object-cover hover-scale"
          />
        </div>
      )}
      
      {blogPost.summary && (
        <div className="mb-8 p-4 bg-muted rounded-lg text-lg italic text-muted-foreground animate-fade-in">
          {blogPost.summary}
        </div>
      )}
      
      <div 
        className="prose prose-lg max-w-none mb-12 animate-fade-in"
        dangerouslySetInnerHTML={{ __html: blogPost.content }}
      />
      
      <div className="border-t pt-6 mt-8 flex justify-between animate-fade-in-bottom">
        <Button variant="outline" className="hover-lift">
          <Share2 className="mr-2 h-4 w-4" />
          Partager
        </Button>
        
        <Button asChild className="hover-lift">
          <Link to="/blog">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voir plus d'articles
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Skeleton loader pendant le chargement
const BlogPostSkeleton = () => {
  return (
    <div className="container py-8 max-w-4xl mx-auto animate-pulse">
      <div className="h-10 w-40 bg-muted rounded mb-6"></div>
      <div className="h-14 w-3/4 bg-muted rounded mb-4"></div>
      <div className="flex gap-4 mb-8">
        <div className="h-6 w-32 bg-muted rounded"></div>
        <div className="h-6 w-32 bg-muted rounded"></div>
      </div>
      <div className="h-64 bg-muted rounded-lg mb-8"></div>
      <div className="space-y-4 mb-12">
        <div className="h-6 bg-muted rounded"></div>
        <div className="h-6 w-5/6 bg-muted rounded"></div>
        <div className="h-6 w-4/6 bg-muted rounded"></div>
        <div className="h-6 w-5/6 bg-muted rounded"></div>
        <div className="h-6 bg-muted rounded"></div>
      </div>
    </div>
  );
};

// Fallback quand aucun article n'est trouvé
const BlogPostFallback = () => {
  return (
    <div className="container py-12 text-center">
      <Helmet>
        <title>Article introuvable | TopCenter Blog</title>
      </Helmet>
      
      <div className="mb-8 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-muted mx-auto flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-4 animate-fade-in-top">Article introuvable</h1>
      
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto animate-fade-in">
        Nous n'avons pas pu trouver l'article que vous recherchez. Il a peut-être été déplacé ou supprimé.
      </p>
      
      <div className="animate-fade-in-bottom">
        <Button asChild className="hover-lift">
          <Link to="/blog">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voir tous les articles
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BlogPost;
