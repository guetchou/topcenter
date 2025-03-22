
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ChatBotSettings {
  id: string;
  name: string;
  enabled: boolean;
  script_id: string;
  embed_id: string;
}

export const ChatPalScripts = () => {
  const [isLoaded, setIsLoaded] = useState<Record<string, boolean>>({});

  const { data: chatbots } = useQuery({
    queryKey: ["chatbots-settings"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("chatbots_settings")
          .select("*")
          .eq("enabled", true);
          
        if (error) throw error;
        return data as ChatBotSettings[];
      } catch (error) {
        console.error("Erreur lors du chargement des chatbots:", error);
        // Retourner les valeurs par défaut en cas d'erreur
        return [
          {
            id: "1",
            name: "ChatPal Default",
            enabled: true,
            script_id: "v8HfNRZjDyZ3",
            embed_id: "v8HfNRZjDyZ3"
          }
        ];
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  useEffect(() => {
    // Nettoyer les instances précédentes
    if (window.chatPal) {
      try {
        if (typeof window.chatPal.destroy === 'function') {
          window.chatPal.destroy();
        }
      } catch (err) {
        console.log("Erreur lors de la destruction des instances ChatPal:", err);
      }
    }

    // Un tableau pour suivre toutes les instances créées
    const instances: any[] = [];
    
    // Initialiser chaque chatbot activé
    chatbots?.forEach(chatbot => {
      if (chatbot.enabled && !isLoaded[chatbot.id]) {
        try {
          const instance = new window.ChatPal({
            embedId: chatbot.embed_id,
            remoteBaseUrl: 'https://chatappdemo.com/',
            version: '8.3'
          });
          
          instances.push(instance);
          setIsLoaded(prev => ({ ...prev, [chatbot.id]: true }));
        } catch (error) {
          console.error(`Erreur lors de l'initialisation du chatbot ${chatbot.name}:`, error);
        }
      }
    });

    // Nettoyer toutes les instances lors du démontage du composant
    return () => {
      instances.forEach(instance => {
        try {
          if (instance && typeof instance.destroy === 'function') {
            instance.destroy();
          }
        } catch (err) {
          console.log("Erreur lors du nettoyage des instances ChatPal:", err);
        }
      });
    };
  }, [chatbots, isLoaded]);

  return null; // Composant invisible qui gère juste les scripts
};
