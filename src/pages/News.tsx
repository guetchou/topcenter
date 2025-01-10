import { NewsGrid } from "@/components/NewsGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const News = () => {
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold">Actualités</h1>
      </div>
      <NewsGrid />
    </div>
  );
};

export default News;