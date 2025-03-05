
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12">
      <h1 className="text-9xl font-bold text-muted">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-6">Page non trouvée</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button asChild size="lg">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
