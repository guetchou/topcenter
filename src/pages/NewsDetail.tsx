import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

const NEWS_DATA = [
  {
    id: "1",
    title: "Top Center étend ses services en Afrique Centrale",
    description: "Notre centre d'appels continue son expansion avec de nouveaux partenariats stratégiques dans la région. Cette expansion permettra d'offrir des services de haute qualité à un plus grand nombre d'entreprises et de particuliers dans toute l'Afrique Centrale.",
    content: `
      Top Center, leader des centres d'appels au Congo, annonce aujourd'hui une expansion majeure de ses services en Afrique Centrale. Cette initiative stratégique vise à répondre à la demande croissante de services de relation client de qualité dans la région.

      Points clés de l'expansion :
      - Ouverture de nouveaux bureaux dans plusieurs pays
      - Recrutement et formation de plus de 200 nouveaux agents
      - Déploiement de technologies innovantes
      - Partenariats stratégiques avec des entreprises locales

      Cette expansion s'inscrit dans notre vision d'excellence et d'innovation continue.
    `,
    date: "2024-02-20",
    category: "company",
    imageUrl: "/news/expansion.jpg"
  },
  {
    id: "2",
    title: "L'évolution des centres d'appels en 2024",
    description: "Les dernières tendances en matière de service client et de centres d'appels omnicanaux...",
    content: `
      L'année 2024 marque un tournant décisif dans l'évolution des centres d'appels. Les nouvelles technologies et les changements dans les attentes des consommateurs transforment radicalement notre industrie.

      Principales tendances :
      - Intelligence artificielle et automatisation
      - Solutions omnicanales intégrées
      - Analyse prédictive des comportements clients
      - Formation continue des agents

      Ces innovations permettent d'offrir un service client plus personnalisé et efficace.
    `,
    date: "2024-02-18",
    category: "industry",
    imageUrl: "/news/call-center.jpg"
  },
  {
    id: "3",
    title: "Nouveau partenariat stratégique",
    description: "Top Center signe un partenariat majeur pour améliorer ses services de support client...",
    content: `
      Top Center est fier d'annoncer la signature d'un partenariat stratégique majeur qui va révolutionner notre offre de services de support client.

      Ce partenariat inclut :
      - Intégration de nouvelles technologies d'IA
      - Amélioration de notre infrastructure technique
      - Formation avancée pour nos équipes
      - Développement de solutions sur mesure

      Cette collaboration renforce notre position de leader dans le secteur.
    `,
    date: "2024-02-15",
    category: "company",
    imageUrl: "/news/partnership.jpg"
  }
];

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const news = NEWS_DATA.find(n => n.id === id);

  if (!news) {
    return (
      <div className="container py-8">
        <h1>Article non trouvé</h1>
        <Button onClick={() => navigate("/actualites")}>Retour aux actualités</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="group mb-8"
        onClick={() => navigate("/actualites")}
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Retour aux actualités
      </Button>

      <Card className="max-w-4xl mx-auto">
        {news.imageUrl && (
          <div className="relative h-[400px] overflow-hidden">
            <img 
              src={news.imageUrl} 
              alt={news.title} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant={news.category === "company" ? "default" : "secondary"}>
              {news.category === "company" ? "Top Center" : "Industrie"}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {news.date}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
          <p className="text-lg text-muted-foreground">{news.description}</p>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsDetail;