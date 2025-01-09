import { NewsCard } from "./NewsCard";

const NEWS_DATA = [
  {
    id: 1,
    title: "Top Center étend ses services en Afrique Centrale",
    description: "Notre centre d'appels continue son expansion avec de nouveaux partenariats stratégiques dans la région...",
    date: "2024-02-20",
    category: "company" as const,
    imageUrl: "/news/expansion.jpg"
  },
  {
    id: 2,
    title: "L'évolution des centres d'appels en 2024",
    description: "Les dernières tendances en matière de service client et de centres d'appels omnicanaux...",
    date: "2024-02-18",
    category: "industry" as const,
    imageUrl: "/news/call-center.jpg"
  },
  {
    id: 3,
    title: "Nouveau partenariat stratégique",
    description: "Top Center signe un partenariat majeur pour améliorer ses services de support client...",
    date: "2024-02-15",
    category: "company" as const,
    imageUrl: "/news/partnership.jpg"
  }
];

export const NewsGrid = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {NEWS_DATA.map((news) => (
        <NewsCard key={news.id} {...news} />
      ))}
    </div>
  );
};