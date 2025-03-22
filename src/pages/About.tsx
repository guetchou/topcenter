
import { usePageContent } from "@/hooks/usePageContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AboutSection } from "@/components/sections/AboutSection";
import { Spinner } from "@/components/ui/spinner";

const About = () => {
  const { data: pageContent, isLoading, error } = usePageContent('about');

  // Display loading indicator while content is being fetched
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      </div>
    );
  }

  // Show error message if content couldn't be fetched
  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Impossible de charger le contenu</h2>
          <p>Veuillez actualiser la page ou réessayer plus tard.</p>
        </div>
      </div>
    );
  }

  // If we have API content, display it
  if (pageContent) {
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

  // If no API content is available, show the static AboutSection component as fallback
  return <AboutSection />;
};

export default About;
