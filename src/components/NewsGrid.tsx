import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "./NewsCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to map database category to component category
const mapCategory = (dbCategory: string): "company" | "industry" => {
  return dbCategory.toLowerCase() === "entreprise" ? "company" : "industry";
};

export const NewsGrid = () => {
  const { data: news, isLoading } = useQuery({
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
        throw error;
      }

      return data;
    }
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news?.map((post) => (
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