
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

// Simulated blog posts for better content display
const mockBlogPosts = [
  {
    id: "1",
    title: "L'impact de l'IA sur les centres d'appels modernes",
    excerpt: "Comment l'intelligence artificielle transforme l'expérience client et améliore l'efficacité des centres d'appels au Congo.",
    content: "Dans un monde où l'expérience client est devenue primordiale, les centres d'appels doivent s'adapter aux nouvelles technologies pour rester compétitifs. L'intelligence artificielle représente aujourd'hui l'une des avancées les plus significatives dans ce domaine, permettant d'optimiser les processus, de réduire les temps d'attente et d'améliorer la qualité des interactions...",
    status: "published",
    category: "Technologie",
    created_at: new Date(2023, 9, 15).toISOString(),
    published_at: new Date(2023, 9, 15).toISOString(),
    updated_at: new Date(2023, 9, 15).toISOString(),
    slug: "impact-ia-centres-appels",
    featured_image_url: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1"
  },
  {
    id: "2",
    title: "Les meilleures pratiques pour la formation des agents en centre d'appels",
    excerpt: "Découvrez comment former efficacement vos agents pour garantir un service client de qualité supérieure.",
    content: "La qualité du service client repose principalement sur les compétences et le professionnalisme des agents en centre d'appels. Une formation adéquate est donc essentielle pour garantir des performances optimales et une satisfaction client élevée...",
    status: "published",
    category: "Formation",
    created_at: new Date(2023, 8, 22).toISOString(),
    published_at: new Date(2023, 8, 22).toISOString(),
    updated_at: new Date(2023, 8, 22).toISOString(),
    slug: "meilleures-pratiques-formation-agents",
    featured_image_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984"
  },
  {
    id: "3",
    title: "Perspectives du marché des centres d'appels en Afrique centrale",
    excerpt: "Analyse des tendances et opportunités pour les centres d'appels dans la région d'Afrique centrale pour 2024.",
    content: "Le marché des centres d'appels en Afrique centrale connaît une croissance significative, portée par la digitalisation croissante des économies locales et l'intérêt grandissant des entreprises internationales pour l'externalisation de leurs services client dans la région...",
    status: "published",
    category: "Marché",
    created_at: new Date(2023, 10, 5).toISOString(),
    published_at: new Date(2023, 10, 5).toISOString(),
    updated_at: new Date(2023, 10, 5).toISOString(),
    slug: "perspectives-marche-centres-appels-afrique",
    featured_image_url: "https://images.unsplash.com/photo-1560264280-88b68371db39"
  },
  {
    id: "4",
    title: "Comment TopCenter a révolutionné le service client au Congo",
    excerpt: "Découvrez l'histoire de notre entreprise et comment nous avons transformé l'approche du service client dans la région.",
    content: "Depuis sa création, TopCenter s'est donné pour mission de redéfinir les standards du service client au Congo. Face à un marché en pleine mutation et des attentes clients toujours plus élevées, notre approche innovante a permis de créer une nouvelle référence dans le secteur...",
    status: "published",
    category: "Entreprise",
    created_at: new Date(2023, 7, 10).toISOString(),
    published_at: new Date(2023, 7, 10).toISOString(),
    updated_at: new Date(2023, 7, 10).toISOString(),
    slug: "topcenter-revolution-service-client-congo",
    featured_image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
  },
  {
    id: "5",
    title: "L'importance de la multilocalisation dans les stratégies de service client",
    excerpt: "Pourquoi avoir des agents dans différentes régions peut améliorer significativement votre service client global.",
    content: "Dans un monde globalisé, la multilocalisation des centres d'appels représente un atout stratégique majeur pour les entreprises souhaitant offrir un service client de qualité sur différents marchés. Cette approche permet non seulement d'assurer une présence locale et culturellement adaptée, mais aussi d'optimiser les coûts et d'améliorer la résilience des opérations...",
    status: "published",
    category: "Stratégie",
    created_at: new Date(2023, 6, 28).toISOString(),
    published_at: new Date(2023, 6, 28).toISOString(),
    updated_at: new Date(2023, 6, 28).toISOString(),
    slug: "importance-multilocalisation-service-client",
    featured_image_url: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc"
  },
  {
    id: "6",
    title: "Tendances technologiques qui transforment l'industrie des centres d'appels",
    excerpt: "Découvrez les innovations technologiques qui façonnent l'avenir des centres d'appels et du service client.",
    content: "L'industrie des centres d'appels connaît une transformation rapide grâce à l'émergence de nouvelles technologies. De l'intelligence artificielle à l'omnicanalité, en passant par l'automatisation des processus, ces innovations redéfinissent la manière dont les entreprises interagissent avec leurs clients...",
    status: "published",
    category: "Technologie",
    created_at: new Date(2023, 5, 15).toISOString(),
    published_at: new Date(2023, 5, 15).toISOString(),
    updated_at: new Date(2023, 5, 15).toISOString(),
    slug: "tendances-technologiques-centres-appels",
    featured_image_url: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b"
  }
];

export const NewsGrid = () => {
  const { handleError } = useSupabaseError();

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6)
          .execute();

        if (result.error) {
          console.error("Error fetching blog posts:", result.error);
          handleError(result.error);
          throw result.error;
        }

        // If no data from Supabase or in development mode, use mock data
        if (!result.data || result.data.length === 0) {
          console.log("Using mock blog posts data");
          return mockBlogPosts;
        }

        return result.data;
      } catch (error) {
        console.error("Error in query function:", error);
        // Return mock data in case of error
        return mockBlogPosts;
      }
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
          imageUrl={post.featured_image_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c"}
        />
      ))}
    </div>
  );
};
