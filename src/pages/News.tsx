import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ArrowRight, Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";

const News = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogPost[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          const articlesData = data as BlogPost[];
          setArticles(articlesData);
          setFilteredArticles(articlesData);
          
          // Extract featured articles (those with featured_image_url)
          const featured = articlesData.filter(article => article.featured_image_url);
          setFeaturedArticles(featured.length > 0 ? featured.slice(0, 3) : articlesData.slice(0, 3));
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(articlesData.map(article => article.category)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    // Filter articles by search term and category
    let results = articles;
    
    if (searchTerm) {
      results = results.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      results = results.filter(article => article.category === selectedCategory);
    }
    
    setFilteredArticles(results);
  }, [searchTerm, selectedCategory, articles]);

  // Format date helper function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog & Actualités</h1>
        <p className="text-muted-foreground">
          Découvrez nos dernières actualités, conseils et tendances dans le domaine du service client et des centres d'appels
        </p>
      </div>

      {/* Filtres de recherche */}
      <div className="mb-12">
        <div className="grid gap-4 md:grid-cols-3 md:gap-8">
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                <span>Catégorie</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Articles en vedette */}
      {featuredArticles.length > 0 && !isLoading && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Articles en vedette</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Card 
                key={article.id} 
                className="hover-lift overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                {article.featured_image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(article.created_at)}
                  </div>
                  <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt || ''}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <Button variant="ghost" size="sm" className="group/btn">
                      Lire plus <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Liste principale d'articles */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Tous les articles</h2>
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id} 
                className="hover-lift overflow-hidden cursor-pointer flex flex-col h-full group"
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <div className="flex flex-col h-full">
                  {article.featured_image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(article.created_at)}
                    </div>
                    <h3 className="font-semibold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">{article.excerpt || ''}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="outline">{article.category}</Badge>
                      <Button variant="ghost" size="sm" className="group/btn">
                        Lire plus <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Aucun article trouvé</h3>
            <p className="text-muted-foreground mb-4">Aucun article ne correspond à vos critères de recherche.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default News;
