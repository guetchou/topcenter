import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Brain, TrendingUp } from "lucide-react";

export const AIPrediction = () => {
  const [predictions] = useState([
    { metric: "Volume d'appels", value: "↑ +15%", trend: "positive" },
    { metric: "Satisfaction client", value: "↑ +8%", trend: "positive" },
    { metric: "Temps de réponse", value: "↓ -12%", trend: "positive" },
  ]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-primary animate-pulse-glow" />
        <h3 className="text-xl font-semibold">Prédictions IA</h3>
      </div>
      <div className="grid gap-4">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 transition-all border rounded-lg hover:bg-secondary/5"
          >
            <span className="text-muted-foreground">{prediction.metric}</span>
            <span
              className={`font-semibold ${
                prediction.trend === "positive"
                  ? "text-accent"
                  : "text-destructive"
              }`}
            >
              {prediction.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};