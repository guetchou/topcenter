import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "./NewsCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useSupabaseError } from "@/hooks/useSupabaseError";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const mapCategory = (dbCategory: string): "company" | "industry" => {
  return dbCategory.toLowerCase() === "entreprise" ? "company" : "industry";
};

export const NewsGrid = () => {
  const { handleError } = useSupabaseError();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching blog posts:", error);
        handleError(error);
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache pendant 5 minutes
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[400px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Une erreur est survenue lors du chargement des actualités.
        </AlertDescription>
      </Alert>
    );
  }

  if (!news?.length) {
    return (
      <Alert>
        <AlertDescription>
          Aucune actualité n'est disponible pour le moment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((post) => (
        <NewsCard
          key={post.id}
          id={post.id}
          title={post.title}
          description={post.excerpt || post.content.substring(0, 150) + "..."}
          date={new Date(post.published_at || post.created_at).toLocaleDateString()}
          category={mapCategory(post.category)}
          imageUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
        />
      ))}
    </div>
  );
};