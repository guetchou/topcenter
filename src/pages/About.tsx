import { AboutSection } from "@/components/sections/AboutSection";
import { DynamicFAQ } from "@/components/DynamicFAQ";

const About = () => {
  return (
    <div className="space-y-20">
      <AboutSection />
      
      <section className="py-20 bg-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions Fréquentes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos questions sur nos services
            </p>
          </div>
          <DynamicFAQ />
        </div>
      </section>
    </div>
  );
};

export default About;