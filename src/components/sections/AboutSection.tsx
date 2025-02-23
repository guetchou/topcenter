
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Award, TrendingUp, CheckCircle2, Rocket, Shield, Users2, Smartphone, Globe } from "lucide-react";

export const AboutSection = () => {
  const stats = [
    {
      icon: Building2,
      title: "Années d'expérience",
      value: "10+",
      description: "Dans la relation client"
    },
    {
      icon: Users,
      title: "Clients satisfaits",
      value: "500+",
      description: "À travers l'Afrique"
    },
    {
      icon: Award,
      title: "Taux de satisfaction",
      value: "98%",
      description: "Clients satisfaits"
    },
    {
      icon: TrendingUp,
      title: "Appels traités",
      value: "1M+",
      description: "Par an"
    }
  ];

  const values = [
    {
      icon: CheckCircle2,
      title: "Excellence",
      description: "Un service de qualité basé sur des équipes qualifiées et des technologies performantes"
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Intégration des dernières technologies : téléphonie VoIP, solutions cloud, automatisation, IA"
    },
    {
      icon: Shield,
      title: "Sécurité",
      description: "Protection des communications et des données grâce à des solutions avancées de cybersécurité"
    },
    {
      icon: Users2,
      title: "Proximité",
      description: "Une approche adaptée aux réalités des entreprises locales et internationales"
    },
    {
      icon: Smartphone,
      title: "Flexibilité",
      description: "Des solutions personnalisables pour s'adapter aux besoins de chaque entreprise"
    },
    {
      icon: Globe,
      title: "Éthique",
      description: "Engagement envers une gestion responsable des interactions et des données clients"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">À propos de Top Center</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Top Center est une entreprise spécialisée dans la gestion de la relation client, 
            l'externalisation des services commerciaux, la téléphonie d'entreprise, 
            la cybersécurité et les solutions digitales avancées.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="font-medium mb-2">{stat.title}</p>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Notre mission */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Notre Mission</h3>
          <div className="bg-card/50 backdrop-blur rounded-lg p-6 shadow-lg">
            <p className="text-lg leading-relaxed">
              Nous accompagnons les entreprises, commerçants, artisans, professions libérales 
              et institutions publiques dans la modernisation de leur communication, 
              l'optimisation de leur service client et l'amélioration de leur rentabilité.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Grâce à un centre d'appels performant, des solutions de télécommunications innovantes, 
              des outils de digitalisation avancés (CRM, ERP, API de paiement mobile) et une expertise 
              en cybersécurité, nous permettons aux entreprises de développer leur activité, 
              améliorer leur productivité et offrir un service client de qualité.
            </p>
          </div>
        </div>

        {/* Nos valeurs */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Nos Valeurs</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h4 className="text-xl font-semibold mb-2">{value.title}</h4>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
