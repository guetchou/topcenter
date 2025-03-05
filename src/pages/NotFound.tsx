
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-6">Page introuvable</h2>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="default" 
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center"
        >
          <Home className="w-4 h-4 mr-2" />
          Accueil
        </Button>
      </div>
    </div>
  );
}
