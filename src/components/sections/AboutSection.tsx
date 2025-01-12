import { Building2, Target, Award } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">À propos de nous</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leader dans les solutions de centre d'appels et de relation client au Congo
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center p-6">
            <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Notre Histoire</h3>
            <p className="text-muted-foreground">
              Des années d'expérience dans la relation client et les solutions d'entreprise
            </p>
          </div>
          
          <div className="text-center p-6">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Notre Mission</h3>
            <p className="text-muted-foreground">
              Optimiser et moderniser la relation client des entreprises congolaises
            </p>
          </div>
          
          <div className="text-center p-6">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nos Valeurs</h3>
            <p className="text-muted-foreground">
              Excellence, innovation et satisfaction client au cœur de nos services
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};