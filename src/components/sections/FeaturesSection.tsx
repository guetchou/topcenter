
import { Phone, Calendar, MessageSquare, Clock, Check, UserCheck, BarChart2, Globe } from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des solutions innovantes pour optimiser votre relation client
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard 
            icon={<Phone className="w-12 h-12 text-primary" />}
            title="Centre d'appel"
            description="Service client professionnel disponible 24/7"
            details="Notre centre d'appels utilise les dernières technologies VoIP et IA pour offrir des réponses rapides et personnalisées. Nos agents sont formés pour gérer tous types de demandes avec professionnalisme."
          />
          
          <FeatureCard 
            icon={<Calendar className="w-12 h-12 text-primary" />}
            title="Rendez-vous"
            description="Planification simple et efficace"
            details="Notre système de gestion des rendez-vous permet d'organiser facilement vos réunions, avec des rappels automatiques et une synchronisation avec tous vos calendriers."
          />
          
          <FeatureCard 
            icon={<MessageSquare className="w-12 h-12 text-primary" />}
            title="Chat en direct"
            description="Assistance instantanée avec IA"
            details="Notre solution de chat en direct combine agents humains et intelligence artificielle pour offrir des réponses instantanées 24h/24, quel que soit le volume de demandes."
          />
          
          <FeatureCard 
            icon={<Clock className="w-12 h-12 text-primary" />}
            title="Support 24/7"
            description="Toujours là quand vous en avez besoin"
            details="Notre équipe de support est disponible jour et nuit pour répondre à vos questions et résoudre vos problèmes, sans interruption et avec un temps de réponse rapide."
          />
          
          <FeatureCard 
            icon={<UserCheck className="w-12 h-12 text-primary" />}
            title="Formation sur mesure"
            description="Des agents qualifiés pour votre secteur"
            details="Nous formons nos agents spécifiquement pour votre secteur d'activité, avec une connaissance approfondie de vos produits, services et procédures."
          />
          
          <FeatureCard 
            icon={<Globe className="w-12 h-12 text-primary" />}
            title="Service multilingue"
            description="Communication sans barrières"
            details="Nos agents maîtrisent plusieurs langues africaines et internationales pour servir efficacement une clientèle diversifiée."
          />
          
          <FeatureCard 
            icon={<BarChart2 className="w-12 h-12 text-primary" />}
            title="Analyse de données"
            description="Insights clients précieux"
            details="Nous fournissons des rapports détaillés et des analyses pour vous aider à comprendre le comportement de vos clients et améliorer vos services."
          />
          
          <FeatureCard 
            icon={<Check className="w-12 h-12 text-primary" />}
            title="Qualité certifiée"
            description="Excellence garantie"
            details="Notre centre d'appels est certifié ISO 27001 et suit des protocoles stricts pour garantir la sécurité des données et la qualité du service."
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
