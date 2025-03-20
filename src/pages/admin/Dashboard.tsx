
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Image, FolderTree, Menu as MenuIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['cms-stats'],
    queryFn: async () => {
      try {
        // Exécuter les requêtes en parallèle
        const articles = await supabase.from('blog_posts').count().execute();
        const categories = await supabase.from('content_categories').count().execute();
        const medias = await supabase.from('media_library').count().execute();
        const menus = await supabase.from('menus').count().execute();

        return {
          articles: articles.count || 0,
          categories: categories.count || 0,
          medias: medias.count || 0,
          menus: menus.count || 0
        };
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        return {
          articles: 0,
          categories: 0,
          medias: 0,
          menus: 0
        };
      }
    }
  });

  const statCards = [
    { title: "Articles", value: stats?.articles, icon: BookOpen },
    { title: "Catégories", value: stats?.categories, icon: FolderTree },
    { title: "Médias", value: stats?.medias, icon: Image },
    { title: "Menus", value: stats?.menus, icon: MenuIcon }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
