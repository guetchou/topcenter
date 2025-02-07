
import { usePageContent } from "@/hooks/usePageContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const { data: pageContent, isLoading } = usePageContent('about');

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!pageContent) return null;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{pageContent.title}</h1>
      <p className="text-muted-foreground mb-8">{pageContent.description}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {pageContent.content.sections.map((section: any, index: number) => (
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

export default About;
