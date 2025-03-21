
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  designConfig, 
  enableNewDesignGlobally, 
  disableNewDesignGlobally,
  enableNewDesign,
  disableNewDesign,
  resetDesignConfig
} from "@/lib/designUtils";
import { Paintbrush, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function DesignToggle() {
  // State to track current toggle states
  const [isGlobalEnabled, setIsGlobalEnabled] = useState(designConfig.useNewDesign);
  const [componentToggles, setComponentToggles] = useState({
    navigation: designConfig.components.navigation,
    hero: designConfig.components.hero,
    services: designConfig.components.services,
    testimonials: designConfig.components.testimonials,
    footer: designConfig.components.footer,
  });
  const [isOpen, setIsOpen] = useState(false);

  // Sync state with designConfig
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

  // Handler for global toggle
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
    
    // Reload page to apply changes
    setTimeout(() => window.location.reload(), 500);
  };

  // Handler for individual component toggles
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
    
    // Reload page to apply changes
    setTimeout(() => window.location.reload(), 500);
  };

  // Reset all options
  const handleReset = () => {
    resetDesignConfig();
    toast.success("Configuration de design réinitialisée", { duration: 2000 });
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Paintbrush className="h-4 w-4" />
          Design
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <div className="p-3 border-b">
          <h3 className="text-sm font-medium">Options de Design</h3>
        </div>
        
        <div className="p-3">
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
        </div>
        
        <div className="bg-muted/50 p-2 flex justify-center border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs h-8"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Réinitialiser
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
