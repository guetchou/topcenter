import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Languages, ArrowRight } from "lucide-react";

export const RealTimeTranslation = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");

  const translate = () => {
    // Simulation de traduction
    setTimeout(() => {
      setTranslation("Translated text would appear here");
    }, 500);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Traduction en Temps Réel</h3>
      </div>
      <div className="grid gap-4">
        <div>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entrez votre texte..."
            className="mb-2"
          />
          <div className="flex justify-end">
            <Button onClick={translate} className="group">
              Traduire
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
        {translation && (
          <div className="p-4 border rounded-lg animate-fade-in">
            <p className="text-muted-foreground">{translation}</p>
          </div>
        )}
      </div>
    </div>
  );
};