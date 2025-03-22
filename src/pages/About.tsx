
import { usePageContent } from "@/hooks/usePageContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AboutSection } from "@/components/sections/AboutSection";
import { Spinner } from "@/components/ui/spinner";
import { ApiErrorBoundary } from "@/components/ApiErrorBoundary";

const About = () => {
  const { data: pageContent, isLoading, error, refetch } = usePageContent('about');

  // Composant qui affiche le contenu de l'API
  const ApiContent = () => {
    if (!pageContent) return null;
    
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
  };

  // Utilisation de notre composant ApiErrorBoundary
  return (
    <ApiErrorBoundary
      isLoading={isLoading}
      error={error as Error}
      retryFunction={refetch}
      loadingFallback={
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        </div>
      }
      fallback={<AboutSection />}
    >
      {pageContent ? <ApiContent /> : <AboutSection />}
    </ApiErrorBoundary>
  );
};

export default About;
