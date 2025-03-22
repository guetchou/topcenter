
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function NotFound() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [animate, setAnimate] = useState(false);

  // Animation d'entrée
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Effet de progression pour suggérer le retour automatique
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 1, 100));
      } else {
        navigate("/");
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [progress, navigate]);

  // Suggestions de redirections basées sur l'URL actuelle
  const getSuggestions = () => {
    const path = window.location.pathname.toLowerCase();
    const suggestions = [];

    if (path.includes("service")) {
      suggestions.push({ label: "Services", path: "/services" });
    }
    
    if (path.includes("blog") || path.includes("article")) {
      suggestions.push({ label: "Blog", path: "/blog" });
    }
    
    if (path.includes("contact")) {
      suggestions.push({ label: "Contact", path: "/contact" });
    }
    
    if (path.includes("propos") || path.includes("about")) {
      suggestions.push({ label: "À propos", path: "/about" });
    }

    return suggestions.length > 0 ? suggestions : [
      { label: "Accueil", path: "/" },
      { label: "Services", path: "/services" },
      { label: "Blog", path: "/blog" }
    ];
  };

  const suggestions = getSuggestions();

  return (
    <>
      <Helmet>
        <title>Page non trouvée | TopCenter</title>
        <meta name="description" content="La page que vous recherchez n'existe pas ou a été déplacée." />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center">
        <div className={cn(
          "transition-all duration-700 ease-out transform",
          animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <h1 className="text-9xl font-extrabold text-primary mb-2 animate-pulse-subtle">404</h1>
          
          <div className="w-24 h-24 border-4 border-primary/30 border-b-primary/80 rounded-full animate-spin mx-auto my-6"></div>
          
          <h2 className="text-3xl font-bold mt-4 mb-2">Page introuvable</h2>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <div className="mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-muted-foreground">Redirection automatique dans</p>
              <span className="font-medium">{Math.max(0, 20 - Math.floor(progress / 5))}s</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="default" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 animate-fade-in-bottom"
              style={{ animationDelay: "0.2s" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 animate-fade-in-bottom"
              style={{ animationDelay: "0.4s" }}
            >
              <Home className="w-4 h-4" />
              Accueil
            </Button>
          </div>

          <div className="mb-8 animate-fade-in-bottom" style={{ animationDelay: "0.6s" }}>
            <p className="text-sm font-medium mb-3">Suggestions :</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(suggestion.path)}
                  className="hover-lift"
                >
                  {suggestion.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-8 max-w-md mx-auto animate-fade-in-bottom" style={{ animationDelay: "0.8s" }}>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-1 top-1"
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
