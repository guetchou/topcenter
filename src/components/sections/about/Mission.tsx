
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Target, Users, TrendingUp } from "lucide-react";

export const Mission = () => {
  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-center mb-8">Notre Mission</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-primary to-secondary"></div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold">Notre Vision</h4>
            </div>
            
            <p className="text-base leading-relaxed">
              Nous accompagnons les entreprises, commerçants, artisans, professions libérales 
              et institutions publiques dans la modernisation de leur communication, 
              l'optimisation de leur service client et l'amélioration de leur rentabilité.
            </p>
            
            <div className="flex items-center text-primary/80 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Leader en solutions de centre d'appels en Afrique centrale</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-secondary to-primary"></div>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center p-2 rounded-full bg-secondary/10">
                <Lightbulb className="h-6 w-6 text-secondary" />
              </div>
              <h4 className="text-lg font-semibold">Notre Approche</h4>
            </div>
            
            <p className="text-base leading-relaxed">
              Grâce à un centre d'appels performant, des solutions de télécommunications innovantes, 
              des outils de digitalisation avancés (CRM, ERP, API de paiement mobile) et une expertise 
              en cybersécurité, nous permettons aux entreprises de développer leur activité, 
              améliorer leur productivité et offrir un service client de qualité.
            </p>
            
            <div className="flex items-center text-secondary/80 text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>Des équipes formées pour répondre à vos besoins spécifiques</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
