import { NewsCard } from "./NewsCard";

const NEWS_DATA = [
  {
    id: 1,
    title: "Top Center étend ses services en Afrique Centrale",
    description: "Notre entreprise continue son expansion avec de nouveaux partenariats stratégiques dans la région...",
    date: "2024-02-20",
    category: "company" as const,
    imageUrl: "/news/expansion.jpg"
  },
  {
    id: 2,
    title: "Innovations dans le secteur IT en 2024",
    description: "Les dernières tendances technologiques qui transforment le paysage informatique en Afrique...",
    date: "2024-02-18",
    category: "industry" as const,
    imageUrl: "/news/tech-trends.jpg"
  },
  // Plus d'articles peuvent être ajoutés ici
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