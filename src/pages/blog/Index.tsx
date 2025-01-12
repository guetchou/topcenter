import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const BlogIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const articles = [
    {
      id: 1,
      title: "L'évolution des centres d'appels en 2024",
      excerpt: "Découvrez les dernières tendances et innovations dans le secteur des centres d'appels...",
      category: "Tendances",
      date: "2024-02-20"
    },
    {
      id: 2,
      title: "Guide : Optimiser votre relation client",
      excerpt: "Les meilleures pratiques pour améliorer votre service client et fidéliser vos clients...",
      category: "Guides",
      date: "2024-02-18"
    },
    {
      id: 3,
      title: "L'importance du support multilingue",
      excerpt: "Comment le support multilingue peut développer votre entreprise à l'international...",
      category: "Conseils",
      date: "2024-02-15"
    }
  ];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Blog & Ressources</h1>

      <div className="max-w-xl mb-8">
        <Input
          type="search"
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card 
            key={article.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/blog/${article.id}`)}
          >
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2">
                {article.category} • {article.date}
              </div>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{article.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BlogIndex;