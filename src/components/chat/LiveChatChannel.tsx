import { Button } from "@/components/ui/button";
import { Video, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LiveChatChannel = () => {
  const { toast } = useToast();

  const handleVideoCall = () => {
    toast({
      title: "Appel vidéo",
      description: "Préparation de l'appel vidéo en cours...",
    });
  };

  const handleCall = () => {
    toast({
      title: "Appel en cours",
      description: "Un agent va vous contacter dans quelques instants.",
    });
  };

  return (
    <div className="flex-1 p-4">
      <div className="text-center space-y-4">
        <h4 className="font-semibold">Chat en Direct</h4>
        <p className="text-muted-foreground">
          Discutez avec un agent en temps réel
        </p>
        <div className="space-y-2">
          <Button className="w-full" onClick={handleVideoCall}>
            <Video className="w-4 h-4 mr-2" />
            Appel Vidéo
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCall}>
            <Phone className="w-4 h-4 mr-2" />
            Appel Audio
          </Button>
        </div>
      </div>
    </div>
  );
};