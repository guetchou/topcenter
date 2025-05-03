
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Détecte si l'application est déjà installée
    const checkIfInstalled = () => {
      // En mode standalone = déjà installé
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Vérifie au chargement
    if (checkIfInstalled()) return;

    // Capture l'événement d'installation avant qu'il ne soit affiché
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Détecte quand l'utilisateur installe la PWA
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast.success("TopCenter a été installé avec succès !");
    };

    // Ajoute les écouteurs d'événements
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Nettoie les écouteurs d'événements
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Affiche l'invite d'installation
    deferredPrompt.prompt();

    // Attend la réponse de l'utilisateur
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === "accepted") {
      toast.success("Merci d'installer TopCenter !");
    } else {
      toast("Vous pourrez installer l'application plus tard", {
        description: "Utilisez le bouton d'installation quand vous serez prêt"
      });
    }
    
    // On ne peut utiliser l'invite qu'une seule fois
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Ne rien afficher si l'app est déjà installée ou n'est pas installable
  if (isInstalled || !isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-lg animate-fade-in">
      <Button 
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
      >
        <Download className="h-4 w-4" />
        <span>Installer l'application</span>
      </Button>
    </div>
  );
};

export default PWAInstallPrompt;
