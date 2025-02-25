
import { Button } from "@/components/ui/button";
import { Gift, Share2, Trophy, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const LoyaltySection = () => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "TopCenter - Programme de parrainage",
        text: "Rejoignez TopCenter et bénéficiez de services exclusifs ! Utilisez mon code de parrainage.",
        url: window.location.href,
      });
      
      toast({
        title: "Partage réussi!",
        description: "Merci de partager notre programme avec vos amis.",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Programme de fidélité</h2>
          <p className="text-lg text-muted-foreground">
            Gagnez des points et accédez à des avantages exclusifs en parrainant vos amis.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Gagnez des points</h3>
              <p className="text-muted-foreground">
                Cumulez des points à chaque interaction et échangez-les contre des récompenses.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Parrainez vos amis</h3>
              <p className="text-muted-foreground">
                Invitez vos amis et recevez des points bonus pour chaque parrainage.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl">Avantages VIP</h3>
              <p className="text-muted-foreground">
                Débloquez des avantages exclusifs en montant de niveau.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <Button
              size="lg"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-5 w-5" />
              Partager avec vos amis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
