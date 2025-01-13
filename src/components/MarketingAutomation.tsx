import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const MarketingAutomation = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer l'URL de votre webhook Zapier",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Déclenchement du webhook Zapier:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      toast({
        title: "Requête envoyée",
        description: "La requête a été envoyée à Zapier. Vérifiez l'historique de votre Zap.",
      });
    } catch (error) {
      console.error("Erreur lors du déclenchement du webhook:", error);
      toast({
        title: "Erreur",
        description: "Échec du déclenchement du webhook Zapier. Vérifiez l'URL et réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Configuration Marketing</h2>
      <form onSubmit={handleTrigger} className="space-y-4">
        <div>
          <label htmlFor="webhook" className="block text-sm font-medium mb-2">
            URL Webhook Zapier
          </label>
          <Input
            id="webhook"
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.zapier.com/..."
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Configuration..." : "Configurer l'automatisation"}
        </Button>
      </form>
    </div>
  );
};