
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, ChevronRight, Search, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Articles complets avec contenu détaillé
const blogArticles = [
  {
    id: 1,
    title: "Comment l'IA transforme les centres d'appels en 2024",
    excerpt: "Découvrez les technologies d'IA qui révolutionnent l'expérience client et améliorent l'efficacité des centres d'appels modernes.",
    content: `
      <h2>L'intelligence artificielle au cœur de la révolution des centres d'appels</h2>
      
      <p>L'intelligence artificielle transforme radicalement le paysage des centres d'appels en 2024. Les technologies d'IA ne sont plus réservées aux grandes entreprises - elles sont désormais accessibles et indispensables pour rester compétitif dans le domaine de la relation client.</p>
      
      <h3>L'analyse prédictive pour anticiper les besoins</h3>
      
      <p>Grâce à l'analyse prédictive alimentée par l'IA, les centres d'appels peuvent aujourd'hui anticiper les pics d'appels et adapter leurs ressources en conséquence. Cette technologie permet également de prédire les raisons d'appel des clients, ce qui permet aux agents de se préparer adéquatement avant même de décrocher.</p>
      
      <p>Chez Top Center, nous utilisons des algorithmes avancés qui analysent les historiques d'appels pour prévoir avec une précision de 94% les volumes d'appels quotidiens, ce qui nous permet d'optimiser nos plannings et de réduire les temps d'attente.</p>
      
      <h3>Les chatbots et assistants virtuels</h3>
      
      <p>Les chatbots nouvelle génération alimentés par l'IA conversationnelle comme GPT-4 ont fait des progrès remarquables. Ils peuvent désormais gérer jusqu'à 70% des demandes courantes sans intervention humaine, tout en offrant une expérience naturelle et personnalisée.</p>
      
      <p>Ces assistants virtuels filtrent et qualifient les demandes avant de les transférer aux agents humains si nécessaire, ce qui permet aux équipes de se concentrer sur les cas complexes nécessitant une véritable expertise.</p>
      
      <h3>La transcription et l'analyse en temps réel</h3>
      
      <p>L'une des avancées les plus significatives est la capacité à transcrire et analyser les conversations en temps réel. Cette technologie permet non seulement d'identifier les émotions et l'intention du client, mais aussi de suggérer des réponses appropriées aux agents pendant l'appel.</p>
      
      <p>Nos équipes bénéficient d'une assistance en direct qui leur fournit instantanément les informations pertinentes issues de notre base de connaissances, ce qui améliore considérablement la qualité et la précision des réponses.</p>
      
      <h3>L'avenir de l'IA dans les centres d'appels</h3>
      
      <p>Dans les années à venir, nous prévoyons que l'IA jouera un rôle encore plus central dans les centres d'appels. Les technologies d'analyse vocale avancée permettront d'identifier automatiquement les clients et de personnaliser l'expérience dès les premières secondes de l'appel.</p>
      
      <p>Pour rester à la pointe, Top Center continue d'investir dans des solutions d'IA innovantes tout en formant ses équipes à collaborer efficacement avec ces technologies. L'objectif n'est pas de remplacer l'humain, mais de l'augmenter pour offrir un service client d'excellence.</p>
    `,
    date: "2024-06-15",
    author: "Jean-Paul Makissa",
    category: "Technologie",
    tags: ["IA", "Innovation", "Service client", "Automatisation"],
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    views: 1245,
    featured: true
  },
  {
    id: 2,
    title: "Les 5 meilleures pratiques pour une satisfaction client exceptionnelle",
    excerpt: "Quelles sont les stratégies qui font vraiment la différence? Découvrez comment les meilleurs centres d'appels atteignent 98% de satisfaction.",
    content: `
      <h2>Comment atteindre l'excellence en satisfaction client</h2>
      
      <p>Dans un monde où les attentes des clients ne cessent d'augmenter, comment s'assurer que votre centre d'appels maintient un niveau de satisfaction exceptionnel? Voici les 5 meilleures pratiques que nous avons identifiées et mises en œuvre chez Top Center pour atteindre un taux de satisfaction de 98%.</p>
      
      <h3>1. Personnalisation à chaque point de contact</h3>
      
      <p>La personnalisation n'est plus un luxe mais une nécessité. Nos données montrent que les clients dont l'expérience est personnalisée sont 62% plus susceptibles de recommander votre entreprise.</p>
      
      <p>Pour une personnalisation efficace, il est essentiel de :</p>
      <ul>
        <li>Consolider les données clients dans un CRM performant</li>
        <li>Former les agents à utiliser efficacement ces informations</li>
        <li>Créer des scripts adaptables qui laissent place à l'authenticité</li>
      </ul>
      
      <h3>2. Formation continue et coaching personnalisé</h3>
      
      <p>Les meilleurs centres d'appels investissent constamment dans la formation de leurs équipes. Chez Top Center, nous consacrons en moyenne 15 heures par mois à la formation de chaque agent.</p>
      
      <p>Notre programme comprend :</p>
      <ul>
        <li>Des sessions hebdomadaires sur les compétences relationnelles</li>
        <li>Des ateliers de gestion des situations difficiles</li>
        <li>Des séances d'écoute collective et d'analyse d'appels</li>
        <li>Un coaching personnalisé basé sur les points d'amélioration identifiés</li>
      </ul>
      
      <h3>3. Omnicanalité fluide et cohérente</h3>
      
      <p>Les clients s'attendent à une expérience cohérente quel que soit le canal qu'ils utilisent. La synchronisation des informations entre les différents canaux (téléphone, email, chat, réseaux sociaux) est cruciale.</p>
      
      <p>Cette approche permet de réduire de 47% le temps de résolution des problèmes complexes qui nécessitent plusieurs interactions.</p>
      
      <h3>4. Autonomisation des agents</h3>
      
      <p>Les agents qui se sentent autonomes et valorisés offrent un service de meilleure qualité. Nous avons constaté que donner aux agents la liberté de prendre certaines décisions sans validation hiérarchique réduit le temps de traitement de 28% tout en augmentant la satisfaction des clients.</p>
      
      <p>Cette autonomie doit s'accompagner d'un cadre clair et de formations appropriées.</p>
      
      <h3>5. Analyse continue et amélioration itérative</h3>
      
      <p>L'excellence n'est pas un état statique mais un processus d'amélioration continue. L'analyse systématique des interactions clients permet d'identifier les points de friction et d'y remédier rapidement.</p>
      
      <p>Nos équipes utilisent un tableau de bord en temps réel qui mesure plus de 20 indicateurs de performance différents, ce qui nous permet d'ajuster nos processus en permanence.</p>
      
      <h3>Conclusion</h3>
      
      <p>La mise en œuvre de ces cinq pratiques a permis à Top Center d'atteindre des niveaux de satisfaction client exceptionnels. L'essentiel est de maintenir l'humain au centre de la relation client tout en s'appuyant sur des outils technologiques performants pour faciliter et enrichir cette relation.</p>
    `,
    date: "2024-06-10",
    author: "Marie Bayimina",
    category: "Service client",
    tags: ["Satisfaction client", "Formation", "Best practices", "Expérience client"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    views: 982,
    featured: true
  },
  {
    id: 3,
    title: "Omnicanalité: Pourquoi c'est essentiel pour votre entreprise",
    excerpt: "L'approche omnicanale n'est plus optionnelle. Apprenez comment l'intégrer efficacement dans votre stratégie de relation client.",
    content: `
      <h2>L'omnicanalité : un impératif stratégique</h2>
      
      <p>À l'ère du digital, les consommateurs interagissent avec les marques à travers une multitude de canaux. Un client peut commencer sa recherche sur un site web, poser une question sur les réseaux sociaux, puis finaliser sa demande par téléphone. Dans ce contexte, l'omnicanalité n'est plus un luxe mais une nécessité absolue.</p>
      
      <h3>Qu'est-ce que l'omnicanalité?</h3>
      
      <p>L'omnicanalité va au-delà de la simple présence sur plusieurs canaux (multicanalité). Elle implique une intégration complète et une synchronisation parfaite entre tous les points de contact, permettant aux clients de passer d'un canal à l'autre sans rupture dans leur parcours.</p>
      
      <p>Une stratégie omnicanale réussie garantit que :</p>
      <ul>
        <li>Les informations client sont accessibles sur tous les canaux</li>
        <li>L'historique des interactions est préservé quel que soit le canal utilisé</li>
        <li>L'expérience est cohérente en termes de ton, d'image et de service</li>
        <li>Les transitions entre canaux sont fluides et transparentes</li>
      </ul>
      
      <h3>Les bénéfices concrets de l'omnicanalité</h3>
      
      <p>Les entreprises qui adoptent une approche omnicanale bénéficient d'avantages considérables :</p>
      
      <h4>1. Augmentation de la rétention client</h4>
      
      <p>Selon nos études, les entreprises avec une stratégie omnicanale solide atteignent un taux de rétention client supérieur de 89% à celles qui négligent cet aspect. Les clients apprécient de ne pas avoir à répéter leurs informations et de retrouver une continuité dans leurs interactions.</p>
      
      <h4>2. Réduction des coûts opérationnels</h4>
      
      <p>La centralisation des données et l'automatisation des processus à travers les différents canaux permet de réduire les coûts opérationnels de 25% en moyenne, tout en améliorant la qualité du service.</p>
      
      <h4>3. Amélioration du taux de conversion</h4>
      
      <p>Les parcours d'achat sont rarement linéaires aujourd'hui. Une approche omnicanale qui accompagne le client à chaque étape de son parcours peut augmenter les taux de conversion de plus de 30%.</p>
      
      <h3>Comment mettre en place une stratégie omnicanale efficace?</h3>
      
      <h4>Étape 1: Cartographier le parcours client</h4>
      
      <p>Avant tout déploiement technique, il est essentiel de comprendre en détail les différents parcours de vos clients. Quels canaux utilisent-ils? À quels moments? Pour quels types d'interactions?</p>
      
      <h4>Étape 2: Unifier les données client</h4>
      
      <p>La pierre angulaire de l'omnicanalité est un système centralisé qui regroupe toutes les données client. CRM, historiques d'achats, interactions précédentes – toutes ces informations doivent être accessibles instantanément quel que soit le canal.</p>
      
      <h4>Étape 3: Former les équipes</h4>
      
      <p>La technologie ne suffit pas. Les équipes doivent être formées à utiliser efficacement les outils omnicanaux et à maintenir une cohérence dans les interactions avec les clients.</p>
      
      <h4>Étape 4: Mesurer et optimiser</h4>
      
      <p>Définissez des KPIs clairs pour évaluer l'efficacité de votre stratégie omnicanale et ajustez-la en fonction des résultats obtenus et des retours clients.</p>
      
      <h3>L'approche Top Center</h3>
      
      <p>Chez Top Center, nous avons développé une plateforme omnicanale intégrée qui permet à nos clients de bénéficier immédiatement des avantages de cette approche sans avoir à gérer la complexité technique sous-jacente.</p>
      
      <p>Notre solution centralise les interactions téléphoniques, emails, chats, SMS et réseaux sociaux dans une interface unifiée, permettant à vos équipes de fournir un service cohérent et personnalisé sur tous les canaux.</p>
    `,
    date: "2024-06-05",
    author: "Gabriel Matoko",
    category: "Stratégie",
    tags: ["Omnicanalité", "Expérience client", "Digitalisation", "Service client"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    views: 756,
    featured: false
  },
  {
    id: 4,
    title: "Management à distance: Guide complet pour les centres d'appels",
    excerpt: "La gestion d'équipes délocalisées présente des défis uniques. Voici les solutions que Top Center a développées avec succès.",
    content: `
      <h2>Manager efficacement des équipes de centre d'appels à distance</h2>
      
      <p>Avec l'essor du travail à distance, de nombreux centres d'appels ont dû adapter leur modèle de gestion. Chez Top Center, nous avons transformé ce défi en opportunité en développant des méthodes de management à distance qui ont non seulement maintenu mais amélioré notre performance.</p>
      
      <h3>Les défis spécifiques du management à distance en centre d'appels</h3>
      
      <p>Le secteur des centres d'appels présente des particularités qui rendent le management à distance particulièrement exigeant :</p>
      <ul>
        <li>Nécessité d'un suivi en temps réel des indicateurs de performance</li>
        <li>Importance de la cohésion d'équipe pour maintenir la motivation</li>
        <li>Besoin de formation continue et d'accompagnement</li>
        <li>Exigences techniques pour garantir la qualité des appels</li>
      </ul>
      
      <h3>Notre méthodologie en 5 piliers</h3>
      
      <h4>1. Infrastructure technique adaptée</h4>
      
      <p>Une infrastructure robuste est le fondement du travail à distance. Nos agents disposent d'une solution cloud sécurisée qui leur permet d'accéder à tous leurs outils depuis n'importe quel lieu, avec une qualité d'appel constante.</p>
      
      <p>Nous avons investi dans :</p>
      <ul>
        <li>Des VPN sécurisés pour protéger les données sensibles</li>
        <li>Des logiciels de téléphonie basés sur le cloud</li>
        <li>Des outils de monitoring de la qualité des appels</li>
        <li>Des systèmes de surveillance de la connectivité</li>
      </ul>
      
      <h4>2. Communication structurée et régulière</h4>
      
      <p>Pour compenser l'absence d'interactions physiques, nous avons mis en place un cadre de communication structuré :</p>
      <ul>
        <li>Réunions quotidiennes de 15 minutes en visioconférence</li>
        <li>Points individuels hebdomadaires</li>
        <li>Sessions de partage d'expérience bi-mensuelles</li>
        <li>Canaux de communication dédiés par thématique</li>
      </ul>
      
      <h4>3. Management par objectifs clairs</h4>
      
      <p>Le management à distance nécessite des objectifs précis et mesurables. Chaque agent dispose d'un tableau de bord personnel avec :</p>
      <ul>
        <li>Objectifs quantitatifs (nombre d'appels, taux de résolution...)</li>
        <li>Objectifs qualitatifs (satisfaction client, respect des procédures...)</li>
        <li>Indicateurs de progression personnelle</li>
      </ul>
      
      <p>Ces objectifs sont révisés mensuellement lors d'entretiens individuels.</p>
      
      <h4>4. Bien-être et engagement des équipes</h4>
      
      <p>Le travail à distance peut engendrer un sentiment d'isolement. Pour y remédier, nous avons développé :</p>
      <ul>
        <li>Des rituels d'équipe virtuels (cafés, jeux, célébrations)</li>
        <li>Un programme de bien-être avec des pauses actives guidées</li>
        <li>Des activités de team building virtuelles mensuelles</li>
        <li>Un système de reconnaissance des succès visible par toute l'équipe</li>
      </ul>
      
      <h4>5. Formation et développement continus</h4>
      
      <p>La formation à distance nécessite une approche spécifique :</p>
      <ul>
        <li>Modules de micro-learning adaptés au format digital</li>
        <li>Sessions de coaching en visioconférence</li>
        <li>Simulations d'appels enregistrées et analysées</li>
        <li>Bibliothèque de ressources accessible 24/7</li>
      </ul>
      
      <h3>Résultats obtenus</h3>
      
      <p>Cette approche structurée nous a permis d'obtenir des résultats remarquables :</p>
      <ul>
        <li>Augmentation de la productivité de 17%</li>
        <li>Réduction de l'absentéisme de 25%</li>
        <li>Amélioration de la satisfaction client de 12%</li>
        <li>Diminution du turnover de 30%</li>
      </ul>
      
      <h3>Conclusion</h3>
      
      <p>Le management à distance des centres d'appels n'est pas qu'une réponse à une contrainte, c'est une opportunité de réinventer les méthodes de travail. Avec une approche structurée et des outils adaptés, il est possible non seulement de maintenir mais d'améliorer la performance et la satisfaction des équipes.</p>
      
      <p>Chez Top Center, nous continuons d'innover dans ce domaine pour offrir à nos collaborateurs un environnement de travail flexible et épanouissant, tout en garantissant un service d'excellence à nos clients.</p>
    `,
    date: "2024-06-01",
    author: "Nidda Mabiala",
    category: "Management",
    tags: ["Télétravail", "Management", "Productivité", "Bien-être"],
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
    views: 624,
    featured: false
  }
];

// Catégories disponibles dans nos articles
const categories = [
  { id: "all", name: "Tous les articles" },
  { id: "technologie", name: "Technologie" },
  { id: "service-client", name: "Service client" },
  { id: "strategie", name: "Stratégie" },
  { id: "management", name: "Management" }
];

const News = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState(blogArticles);

  // Filtrer les articles en fonction de la recherche et de la catégorie
  useEffect(() => {
    let results = blogArticles;
    
    if (searchTerm) {
      results = results.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== "all") {
      results = results.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredArticles(results);
  }, [searchTerm, selectedCategory]);

  // Articles à la une (featured)
  const featuredArticles = blogArticles.filter(article => article.featured);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          className="group"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Retour à l'accueil
        </Button>
        <h1 className="text-3xl font-bold">Actualités et Insights</h1>
      </div>
      
      {/* Section de recherche et filtrage */}
      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un article..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Articles à la une */}
      {featuredArticles.length > 0 && selectedCategory === "all" && !searchTerm && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Articles à la une</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredArticles.map(article => (
              <Card key={article.id} className="overflow-hidden group cursor-pointer" onClick={() => navigate(`/blog/${article.id}`)}>
                <div className="relative h-64">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute bottom-0 p-6 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="border-primary text-primary bg-primary/10">
                          À la une
                        </Badge>
                        <Badge variant="secondary">
                          {article.category}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                      <p className="text-white/80 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center mt-4 text-sm text-white/70">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(article.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Liste principale d'articles */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {searchTerm ? `Résultats de recherche (${filteredArticles.length})` : 
           selectedCategory !== "all" ? `Articles - ${categories.find(c => c.id === selectedCategory)?.name}` :
           "Tous les articles"}
        </h2>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Aucun article trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Aucun article ne correspond à vos critères de recherche.
            </p>
            <Button onClick={() => {setSearchTerm(""); setSelectedCategory("all");}}>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map(article => (
              <Card key={article.id} className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/blog/${article.id}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Tag className="w-3.5 h-3.5 mr-1" />
                      <span>{article.tags.slice(0, 2).join(", ")}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Lire l'article
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Séparateur et newsletter */}
      <Separator className="my-12" />
      
      <div className="bg-primary/5 p-8 rounded-lg mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Abonnez-vous à notre newsletter</h2>
          <p className="mb-6 text-muted-foreground">
            Recevez nos derniers articles et insights directement dans votre boîte mail.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <Input placeholder="Votre adresse email" />
            <Button>S'abonner</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
