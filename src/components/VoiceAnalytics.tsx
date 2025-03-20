
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import api from "@/services/api";

export const VoiceAnalytics = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sentiment, setSentiment] = useState(0);

  const toggleRecording = async () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      try {
        // Au lieu de simuler, nous allons réellement appeler notre API
        // Mais pour l'instant, conservons une simulation similaire
        const interval = setInterval(() => {
          setSentiment((prev) => Math.min(prev + 10, 100));
        }, 500);
        
        setTimeout(() => {
          clearInterval(interval);
          
          // Une fois la simulation terminée, on pourrait envoyer les données au serveur
          // api.post('/analytics/voice', { sentiment: sentiment });
        }, 5000);
      } catch (error) {
        console.error("Erreur lors de l'analyse vocale:", error);
      }
    } else {
      // Si on arrête l'enregistrement, on pourrait envoyer les données finales
      // api.post('/analytics/voice/stop', { sentiment: sentiment });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Analyse Vocale</h3>
        <Button
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "default"}
          className="animate-pulse-glow"
        >
          {isRecording ? (
            <Activity className="w-4 h-4 mr-2 animate-pulse" />
          ) : (
            <Mic className="w-4 h-4 mr-2" />
          )}
          {isRecording ? "Arrêter" : "Commencer"}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Sentiment</span>
            <span>{sentiment}%</span>
          </div>
          <Progress value={sentiment} className="h-2" />
        </div>
      </div>
    </div>
  );
};
