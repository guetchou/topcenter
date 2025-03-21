
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  designConfig, 
  enableNewDesignGlobally, 
  disableNewDesignGlobally,
  enableNewDesign,
  disableNewDesign,
  resetDesignConfig
} from "@/lib/designUtils";
import { X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function DesignToggle() {
  // State pour suivre l'état actuel des toggles
  const [isGlobalEnabled, setIsGlobalEnabled] = useState(designConfig.useNewDesign);
  const [componentToggles, setComponentToggles] = useState({
    navigation: designConfig.components.navigation,
    hero: designConfig.components.hero,
    services: designConfig.components.services,
    testimonials: designConfig.components.testimonials,
    footer: designConfig.components.footer,
  });
  const [isOpen, setIsOpen] = useState(true);

  // Synchroniser l'état avec le designConfig
  useEffect(() => {
    setIsGlobalEnabled(designConfig.useNewDesign);
    setComponentToggles({
      navigation: designConfig.components.navigation,
      hero: designConfig.components.hero,
      services: designConfig.components.services,
      testimonials: designConfig.components.testimonials,
      footer: designConfig.components.footer,
    });
  }, [designConfig.useNewDesign, designConfig.components]);

  // Gestionnaire pour le toggle global
  const handleGlobalToggle = (checked: boolean) => {
    setIsGlobalEnabled(checked);
    if (checked) {
      enableNewDesignGlobally();
    } else {
      disableNewDesignGlobally();
    }
    
    toast.success(
      checked ? "Nouveau design activé globalement" : "Nouveau design désactivé globalement",
      { duration: 2000 }
    );
    
    // Recharger la page pour appliquer les changements
    setTimeout(() => window.location.reload(), 500);
  };

  // Gestionnaire pour les toggles individuels
  const handleComponentToggle = (
    component: keyof typeof designConfig.components, 
    checked: boolean
  ) => {
    setComponentToggles(prev => ({
      ...prev,
      [component]: checked
    }));
    
    if (checked) {
      enableNewDesign(component);
      toast.success(`Nouveau design activé pour: ${String(component)}`, { duration: 2000 });
    } else {
      disableNewDesign(component);
      toast.success(`Design original restauré pour: ${String(component)}`, { duration: 2000 });
    }
    
    // Recharger la page pour appliquer les changements
    setTimeout(() => window.location.reload(), 500);
  };

  // Réinitialiser toutes les options
  const handleReset = () => {
    resetDesignConfig();
    toast.success("Configuration de design réinitialisée", { duration: 2000 });
    setTimeout(() => window.location.reload(), 500);
  };

  if (!isOpen) {
    return (
      <Button 
        className="fixed bottom-4 right-4 z-50" 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        Design Options
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-lg w-72">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Options de Design</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-1 gap-2">
            <Label htmlFor="design-toggle-global" className="text-sm font-medium">
              Nouveau design (global)
            </Label>
            <Switch 
              id="design-toggle-global" 
              checked={isGlobalEnabled}
              onCheckedChange={handleGlobalToggle}
            />
          </div>
          
          <div className="border-t my-2"></div>
          
          <div className="text-xs font-medium mb-1 text-muted-foreground">Composants spécifiques</div>
          
          {Object.entries(componentToggles).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-1 gap-2">
              <Label htmlFor={`design-toggle-${key}`} className="text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <Switch 
                id={`design-toggle-${key}`} 
                checked={value}
                onCheckedChange={(checked) => 
                  handleComponentToggle(key as keyof typeof designConfig.components, checked)
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 py-2 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs h-8"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Réinitialiser
        </Button>
      </CardFooter>
    </Card>
  );
}
