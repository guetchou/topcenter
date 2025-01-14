import { ServicesSection } from "@/components/sections/ServicesSection";
import { ServiceViewer3D } from "@/components/ServiceViewer3D";
import { CallToActionSection } from "@/components/sections/CallToActionSection";

const Services = () => {
  return (
    <div className="space-y-20">
      <ServicesSection />
      <ServiceViewer3D />
      <CallToActionSection />
    </div>
  );
};

export default Services;