
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsSearch } from "@/components/NewsSearch";
import { NewsGrid } from "@/components/NewsGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RssIcon, Newspaper, TrendingUp, CalendarIcon, Film, Camera } from "lucide-react";
import VideoPlayer from "@/components/sections/VideoPlayer";

const BlogIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container py-12">
      <Breadcrumbs />
      
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog & Actualités</h1>
        <p className="text-muted-foreground text-lg">
          Découvrez les dernières tendances, innovations et actualités dans le domaine des centres d'appels et du service client
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="mb-4">
                <span className="text-primary text-sm font-medium">À LA UNE</span>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                L'avenir des centres d'appels en Afrique : Opportunités et perspectives
              </h2>
              <p className="text-muted-foreground mb-4">
                Découvrez comment le marché africain des centres d'appels se transforme et offre de nouvelles opportunités pour les entreprises locales et internationales.
              </p>
              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>15 octobre 2023</span>
              </div>
              <Button onClick={() => navigate("/blog/featured-article")}>
                Lire l'article complet
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Catégories</h3>
              </div>
              <div className="space-y-2">
                {["Technologie", "Entreprise", "Formation", "Stratégie", "Innovation", "Marché"].map((category) => (
                  <Button 
                    key={category} 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate(`/blog/category/${category.toLowerCase()}`)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Articles populaires</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm font-medium hover:text-primary cursor-pointer">
                      Comment l'IA révolutionne le service client
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      1205 vues
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm font-medium hover:text-primary cursor-pointer">
                      Les défis de recrutement dans les centres d'appels
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      982 vues
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <h4 className="text-sm font-medium hover:text-primary cursor-pointer">
                      Optimiser l'expérience client omnicanale
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      856 vues
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Nouvelle section pour la médiathèque */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Médiathèque TopCenter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                Vidéothèque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden h-64 bg-black">
                <VideoPlayer />
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Nos vidéos récentes</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/30 rounded-lg flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                    <Film className="h-4 w-4 text-primary" />
                    <span className="text-sm">Présentation de nos services</span>
                  </div>
                  <div className="p-2 bg-muted/30 rounded-lg flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                    <Film className="h-4 w-4 text-primary" />
                    <span className="text-sm">Témoignages clients</span>
                  </div>
                  <div className="p-2 bg-muted/30 rounded-lg flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                    <Film className="h-4 w-4 text-primary" />
                    <span className="text-sm">Formation des agents</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">Voir toutes les vidéos</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Photothèque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <img 
                  src="/lovable-uploads/equipe-topcenter.jpg" 
                  alt="Équipe TopCenter" 
                  className="aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                />
                <img 
                  src="/lovable-uploads/staff-tce.jpg" 
                  alt="Staff TopCenter" 
                  className="aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                />
                <img 
                  src="/lovable-uploads/agent-topcenter1.png" 
                  alt="Agent TopCenter" 
                  className="aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                />
                <img 
                  src="/lovable-uploads/nidda2.png" 
                  alt="Nidda TopCenter" 
                  className="aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Nos albums photos</h3>
                <div className="space-y-2">
                  <div className="p-2 bg-muted/30 rounded-lg flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                    <Camera className="h-4 w-4 text-primary" />
                    <span className="text-sm">Équipe et installations</span>
                  </div>
                  <div className="p-2 bg-muted/30 rounded-lg flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                    <Camera className="h-4 w-4 text-primary" />
                    <span className="text-sm">Événements d'entreprise</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">Voir toutes les photos</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="max-w-xl mx-auto mb-8">
        <NewsSearch onSearch={setSearchTerm} />
      </div>
      
      <Tabs defaultValue="all" className="mb-10">
        <TabsList className="w-full max-w-lg mx-auto grid grid-cols-3 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            <span>Tous les articles</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <RssIcon className="w-4 h-4" />
            <span>TopCenter</span>
          </TabsTrigger>
          <TabsTrigger value="industry" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            <span>Industrie</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <NewsGrid />
        </TabsContent>
        
        <TabsContent value="company">
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">Filtrage par catégorie</h3>
            <p className="text-muted-foreground mb-4">Affichage des articles spécifiques à TopCenter.</p>
            <Button variant="outline" onClick={() => navigate("/blog")}>
              Voir tous les articles
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="industry">
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">Filtrage par catégorie</h3>
            <p className="text-muted-foreground mb-4">Affichage des articles sur l'industrie.</p>
            <Button variant="outline" onClick={() => navigate("/blog")}>
              Voir tous les articles
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-16 py-12 bg-muted/30 rounded-lg text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Abonnez-vous à notre newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Recevez les dernières actualités et tendances directement dans votre boîte de réception.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <Input placeholder="Votre adresse email" type="email" className="flex-1" />
            <Button>S'abonner</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogIndex;
