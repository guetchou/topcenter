
import { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ChatterPalInterfaceProps {
  onLoad: () => void;
}

export const ChatterPalInterface = ({ onLoad }: ChatterPalInterfaceProps) => {
  const chatterpalContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Réinitialiser l'instance si elle existe
      if (window.chatPal) {
        try {
          window.chatPal.destroy();
        } catch (e) {
          console.log("Pas d'instance précédente à détruire");
        }
      }
      
      // Configurer la nouvelle instance
      window.chatPal = new window.ChatPal({
        embedId: 'v8HfNRZjDyZ3',
        remoteBaseUrl: 'https://chatappdemo.com/',
        version: '8.3',
        containerSelector: '#chatterpal-container',
        position: 'internal',
        width: '100%',
        height: '100%'
      });
      
      setLoading(false);
      onLoad();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de ChatterPal:", error);
      setLoading(false);
    }
  }, [onLoad]);

  return (
    <div id="chatterpal-container" ref={chatterpalContainerRef} className="flex-1 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Chargement de l'agent ChatterPal...</span>
        </div>
      )}
    </div>
  );
};
