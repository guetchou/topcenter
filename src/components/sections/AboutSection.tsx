
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, Users, Award, TrendingUp, CheckCircle2, Rocket, Shield, 
  Users2, Smartphone, Globe, Bot, MessageSquare, Bell, BarChart3,
  Phone, Network, Lock, Cloud, GraduationCap, BuildingBank, ShoppingCart,
  Heart, Radio, Truck, Building, PlaneLanding, Scale, Diamond, MapPin
} from "lucide-react";

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

  const services = [
    {
      icon: Phone,
      title: "Centre d'appels & Relation client",
      items: [
        "Support client & assistance technique",
        "Télévente & prospection",
        "Prise de rendez-vous",
        "Service après-vente & enquêtes de satisfaction"
      ]
    },
    {
      icon: Network,
      title: "Téléphonie d'entreprise & interconnexion",
      items: [
        "Standard téléphonique (PABX / IPBX / VoIP)",
        "Interconnexion d'entreprises",
        "Solutions de télétravail"
      ]
    },
    {
      icon: Lock,
      title: "Cybersécurité & Sécurisation",
      items: [
        "Protection des appels & données",
        "Audit & conseil en cybersécurité",
        "Détection & prévention des cyberattaques"
      ]
    },
    {
      icon: Cloud,
      title: "Digitalisation & solutions cloud",
      items: [
        "CRM & ERP",
        "Automatisation & intégration API",
        "Plateforme de vente en ligne"
      ]
    },
    {
      icon: GraduationCap,
      title: "Formation & Conseil",
      items: [
        "Formations professionnelles",
        "Conseil stratégique",
        "Transformation digitale"
      ]
    }
  ];

  const sectors = [
    { icon: BuildingBank, title: "Banques & Assurances" },
    { icon: ShoppingCart, title: "Commerce & Distribution" },
    { icon: Heart, title: "Santé & Pharmacie" },
    { icon: Radio, title: "Télécommunications & IT" },
    { icon: Truck, title: "Transport & Logistique" },
    { icon: Building, title: "Secteur Public & Administrations" },
    { icon: PlaneLanding, title: "Tourisme & Hôtellerie" },
    { icon: Scale, title: "Cabinets juridiques & professions libérales" }
  ];

  const digitalSolutions = [
    {
      icon: Bot,
      title: "Chatbots & Assistance Virtuelle",
      description: "Automatisation intelligente du support client 24/7",
      features: [
        "Réponses automatisées multilingues",
        "Apprentissage continu",
        "Support client 24/7"
      ]
    },
    {
      icon: MessageSquare,
      title: "CRM & Gestion Client",
      description: "Solutions intégrées de gestion client",
      features: [
        "Historique centralisé",
        "Suivi des interactions",
        "Tableaux de bord personnalisés"
      ]
    },
    {
      icon: Bell,
      title: "Notifications Automatisées",
      description: "Communication multicanale proactive",
      features: [
        "SMS transactionnels",
        "Emails personnalisés",
        "Messages WhatsApp"
      ]
    },
    {
      icon: BarChart3,
      title: "Analyse & Reporting",
      description: "Insights pour une meilleure décision",
      features: [
        "Tableaux de bord en temps réel",
        "Analyse prédictive",
        "Rapports personnalisés"
      ]
    }
  ];

  const advantages = [
    {
      icon: Diamond,
      title: "Une expertise éprouvée",
      description: "En gestion de la relation client et télécommunications"
    },
    {
      icon: Network,
      title: "Infrastructure moderne",
      description: "Solutions VoIP, PABX et télétravail"
    },
    {
      icon: MessageSquare,
      title: "Approche omnicanale",
      description: "Appels, SMS, email, WhatsApp, chatbots"
    },
    {
      icon: Rocket,
      title: "Innovation continue",
      description: "CRM, ERP, IA, API de paiement"
    },
    {
      icon: Shield,
      title: "Sécurité maximale",
      description: "Solutions conformes aux normes de cybersécurité"
    }
  ];

  return (
    <section className="py-20 space-y-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container">
        {/* Introduction */}
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
        <div className="mb-16">
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

        {/* Nos services */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Nos Services</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h4 className="text-xl font-semibold mb-4">{service.title}</h4>
                    <ul className="space-y-2">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-1" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Solutions Digitales */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Solutions Digitales Avancées</h3>
          <div className="grid gap-8 md:grid-cols-2">
            {digitalSolutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">{solution.title}</h4>
                        <p className="text-muted-foreground mb-4">{solution.description}</p>
                        <ul className="space-y-2">
                          {solution.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Secteurs cibles */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Secteurs Cibles</h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <span className="font-medium">{sector.title}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Pourquoi nous choisir */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Pourquoi Choisir Top Center ?</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h4 className="text-xl font-semibold mb-2">{advantage.title}</h4>
                    <p className="text-muted-foreground">{advantage.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Localisation */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Localisation & Contact</h3>
          <div className="flex items-center justify-center gap-2 text-lg">
            <MapPin className="text-primary" />
            <p>P7GG+QX, Brazzaville, République du Congo</p>
          </div>
        </div>
      </div>
    </section>
  );
};
