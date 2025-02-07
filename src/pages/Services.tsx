
import { usePageContent } from "@/hooks/usePageContent";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ServiceViewer3D } from "@/components/ServiceViewer3D";
import { CallToActionSection } from "@/components/sections/CallToActionSection";

const Services = () => {
  const { data: pageContent, isLoading } = usePageContent('services');

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
    <div>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">{pageContent.title}</h1>
        <p className="text-muted-foreground mb-8">{pageContent.description}</p>
      </div>

      <div className="space-y-20">
        <ServicesSection />
        <ServiceViewer3D />
        <CallToActionSection />
      </div>
    </div>
  );
};

export default Services;
