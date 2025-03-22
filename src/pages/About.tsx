
import { usePageContent } from "@/hooks/usePageContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AboutSection } from "@/components/sections/AboutSection";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";

const About = () => {
  const { data: pageContent, isLoading, error } = usePageContent('about');
  const [isApiError, setIsApiError] = useState(false);

  // Détecter si l'API est en erreur en observant l'erreur et mettre à jour l'état
  useEffect(() => {
    if (error) {
      console.log("Erreur détectée dans l'API usePageContent:", error);
      setIsApiError(true);
    }
  }, [error]);

  // Afficher un indicateur de chargement pendant que le contenu est récupéré
  if (isLoading && !isApiError) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  // Si on a du contenu API valide, l'afficher
  if (pageContent && !isApiError) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">{pageContent.title}</h1>
        <p className="text-muted-foreground mb-8">{pageContent.description}</p>

        <div className="grid gap-6 md:grid-cols-2">
          {pageContent.content?.sections?.map((section: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Dans tous les autres cas (erreur ou pas de contenu), afficher la section AboutSection statique
  console.log("Affichage du contenu AboutSection statique");
  return <AboutSection />;
};

export default About;
