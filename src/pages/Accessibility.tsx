
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Type, Eye, MousePointer, Keyboard, Volume2 } from "lucide-react";

const Accessibility = () => {
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  // Appliquer les changements au document
  const applyAccessibilityChanges = () => {
    // Taille de police
    document.documentElement.style.setProperty('--font-size-multiplier', `${fontSize}%`);
    
    // Contraste
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Police pour dyslexie
    if (dyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
    } else {
      document.documentElement.classList.remove('dyslexic-font');
    }
    
    // Réduction de mouvement
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  // Appliquer les changements lorsque les valeurs changent
  React.useEffect(() => {
    applyAccessibilityChanges();
  }, [fontSize, contrast, reduceMotion, highContrast, dyslexicFont]);

  return (
    <div className="container py-8 mx-auto px-4 md:px-6">
      <Helmet>
        <title>Accessibilité | TopCenter</title>
        <meta name="description" content="Paramètres d'accessibilité pour améliorer votre expérience sur TopCenter" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Paramètres d'accessibilité</h1>
      <p className="text-muted-foreground mb-8">
        Personnalisez l'affichage du site selon vos besoins pour une meilleure expérience de navigation.
      </p>

      <Tabs defaultValue="visual" className="mb-8">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>Affichage</span>
          </TabsTrigger>
          <TabsTrigger value="interaction" className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            <span>Interaction</span>
          </TabsTrigger>
          <TabsTrigger value="keyboard" className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            <span>Clavier</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <span>Audio</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Taille du texte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                  aria-label="Réduire la taille du texte"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <Slider
                  value={[fontSize]}
                  min={80}
                  max={200}
                  step={10}
                  onValueChange={(values) => setFontSize(values[0])}
                  aria-label="Taille de police"
                  className="flex-1"
                />
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                  aria-label="Augmenter la taille du texte"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                <span className="w-12 text-right font-mono">{fontSize}%</span>
              </div>
              
              <div className="mt-4 p-4 border rounded-md">
                <p className="font-medium">Exemple de texte</p>
                <p style={{ fontSize: `${fontSize}%` }}>
                  Ceci est un exemple de texte qui sera affiché selon vos préférences.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres visuels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">Contraste élevé</Label>
                  <p className="text-sm text-muted-foreground">
                    Augmente le contraste des couleurs pour améliorer la lisibilité
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dyslexic-font">Police pour dyslexie</Label>
                  <p className="text-sm text-muted-foreground">
                    Utilise une police adaptée pour faciliter la lecture
                  </p>
                </div>
                <Switch
                  id="dyslexic-font"
                  checked={dyslexicFont}
                  onCheckedChange={setDyslexicFont}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-motion">Réduire les animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Désactive ou réduit les animations et transitions
                  </p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={reduceMotion}
                  onCheckedChange={setReduceMotion}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interaction">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'interaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Délai du clic</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Délai du clic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Court</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Ajuste le délai nécessaire pour qu'un clic soit enregistré
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keyboard">
          <Card>
            <CardHeader>
              <CardTitle>Navigation au clavier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <p className="font-medium">Raccourcis clavier</p>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Alt + M: Ouvrir le menu (mobile)</li>
                    <li>Ctrl/Cmd + K: Ouvrir la recherche</li>
                    <li>Alt + S: Aller au contenu principal</li>
                    <li>Alt + 1 à 9: Accéder aux sections principales</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Utilisez la touche Tab pour naviguer entre les éléments interactifs.
                  Appuyez sur Entrée pour activer un élément sélectionné.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres audio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="screen-reader">Support lecteur d'écran</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimise le site pour les lecteurs d'écran (NVDA, JAWS, VoiceOver)
                    </p>
                  </div>
                  <Switch id="screen-reader" defaultChecked />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>Volume des notifications</Label>
                  <Slider defaultValue={[70]} max={100} step={10} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button 
        onClick={applyAccessibilityChanges}
        className="w-full md:w-auto mt-4"
      >
        Appliquer les paramètres
      </Button>
    </div>
  );
};

export default Accessibility;
