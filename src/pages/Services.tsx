
import { usePageContent } from "@/hooks/usePageContent";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ImmersiveServiceViewer } from "@/components/ImmersiveServiceViewer";
import { CallToActionSection } from "@/components/sections/CallToActionSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { Eye3d } from "@/components/ui/icons";
import { ApiContentWrapper } from "@/components/ApiContentWrapper";
import { Helmet } from "react-helmet-async";

const Services = () => {
  const { data: pageContent, isLoading, error, refetch } = usePageContent('services');

  const ServiceContent = ({ data }: { data: any }) => {
    return (
      <div>
        <Helmet>
          <title>{data.meta_tags?.title || "Nos Services | TopCenter"}</title>
          <meta name="description" content={data.meta_tags?.description || data.description || "Découvrez notre gamme complète de services de centre d'appels et de relation client"} />
        </Helmet>
        
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          <p className="text-muted-foreground mb-8">{data.description}</p>
          
          <Tabs defaultValue="3d" className="w-full mb-12">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="3d" className="flex items-center gap-2">
                  <Eye3d className="w-4 h-4" />
                  <span>Vue Immersive</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Liste Détaillée</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="3d" className="border border-border p-1 rounded-xl shadow-lg">
              <div className="bg-gradient-to-b from-background/80 to-background p-4 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Explorez Nos Services en 3D</h2>
                <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Naviguez dans notre univers de services interactif. Cliquez sur les différentes sphères pour 
                  découvrir nos prestations et en savoir plus.
                </p>
                <ImmersiveServiceViewer />
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm">
                    <span className="mr-2">💡</span> Conseil: Utilisez la souris pour faire pivoter la vue
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <ServicesSection />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-20">
          <CallToActionSection />
        </div>
      </div>
    );
  };

  // Utilisation du ApiContentWrapper pour une gestion cohérente
  return (
    <ApiContentWrapper
      data={pageContent}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      fallback={<ServicesFallback />}
    >
      {(data) => <ServiceContent data={data} />}
    </ApiContentWrapper>
  );
};

// Composant de fallback visuel pour les services
const ServicesFallback = () => {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Nos Services</h1>
      <p className="text-muted-foreground mb-8">Découvrez notre gamme complète de services de centre d'appels et de relation client professionnels.</p>
      
      <ServicesSection />
      
      <div className="mt-20">
        <CallToActionSection />
      </div>
    </div>
  );
};

export default Services;
