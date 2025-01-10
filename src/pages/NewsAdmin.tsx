import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NewsAdmin = () => {
  const navigate = useNavigate();
  const [articles] = useState([
    {
      id: 1,
      title: "Top Center étend ses services en Afrique Centrale",
      status: "published",
      date: "2024-02-20"
    },
    {
      id: 2,
      title: "L'évolution des centres d'appels en 2024",
      status: "draft",
      date: "2024-02-18"
    }
  ]);

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
        <h1 className="text-3xl font-bold">Administration des Actualités</h1>
      </div>

      <div className="mb-8">
        <Button className="group">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-semibold">{article.title}</h3>
                  <div className="flex items-center mt-2 space-x-2 text-sm text-muted-foreground">
                    <span>{article.date}</span>
                    <Badge variant={article.status === "published" ? "default" : "secondary"}>
                      {article.status === "published" ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsAdmin;