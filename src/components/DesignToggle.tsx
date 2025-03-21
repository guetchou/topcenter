
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  designConfig, 
  enableNewDesignGlobally, 
  disableNewDesignGlobally,
  enableNewDesign,
  disableNewDesign
} from "@/lib/designUtils";

export function DesignToggle() {
  // State pour suivre l'état actuel des toggles
  const [isGlobalEnabled, setIsGlobalEnabled] = React.useState(designConfig.useNewDesign);
  const [componentToggles, setComponentToggles] = React.useState({
    navigation: designConfig.components.navigation,
    hero: designConfig.components.hero,
    services: designConfig.components.services,
    testimonials: designConfig.components.testimonials,
    footer: designConfig.components.footer,
  });

  // Gestionnaire pour le toggle global
  const handleGlobalToggle = (checked: boolean) => {
    setIsGlobalEnabled(checked);
    if (checked) {
      enableNewDesignGlobally();
    } else {
      disableNewDesignGlobally();
    }
    // Recharger la page pour appliquer les changements
    window.location.reload();
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
    } else {
      disableNewDesign(component);
    }
    // Recharger la page pour appliquer les changements
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-background border border-border rounded-lg shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="font-medium mb-2">Options de Design</div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="design-toggle-global" 
            checked={isGlobalEnabled}
            onCheckedChange={handleGlobalToggle}
          />
          <Label htmlFor="design-toggle-global">Nouveau design (global)</Label>
        </div>
        
        <div className="border-t my-2"></div>
        
        <div className="text-sm font-medium mb-1">Composants spécifiques</div>
        
        {Object.entries(componentToggles).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <Switch 
              id={`design-toggle-${key}`} 
              checked={value}
              onCheckedChange={(checked) => 
                handleComponentToggle(key as keyof typeof designConfig.components, checked)
              }
            />
            <Label htmlFor={`design-toggle-${key}`}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
