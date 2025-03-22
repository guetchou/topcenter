
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontBold, FontSize, MousePointer2, Contrast, Eye, Type, Bot, Check } from "lucide-react";
import { toast } from "sonner";

const Accessibility = () => {
  // Accessibility preferences state
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState("normal");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [increasedSpacing, setIncreasedSpacing] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [cursorSize, setCursorSize] = useState("normal");
  const [textToSpeech, setTextToSpeech] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFontSize(settings.fontSize || 100);
      setContrast(settings.contrast || "normal");
      setReduceMotion(settings.reduceMotion || false);
      setIncreasedSpacing(settings.increasedSpacing || false);
      setDyslexicFont(settings.dyslexicFont || false);
      setHighContrast(settings.highContrast || false);
      setCursorSize(settings.cursorSize || "normal");
      setTextToSpeech(settings.textToSpeech || false);
      
      // Apply settings
      applySettings(settings);
    }
  }, []);

  // Save settings to localStorage and apply them
  const saveSettings = () => {
    const settings = {
      fontSize,
      contrast,
      reduceMotion,
      increasedSpacing,
      dyslexicFont,
      highContrast,
      cursorSize,
      textToSpeech
    };
    
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    applySettings(settings);
    
    toast.success("Paramètres d'accessibilité sauvegardés", {
      description: "Vos préférences ont été enregistrées."
    });
  };

  // Reset settings to defaults
  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 100,
      contrast: "normal",
      reduceMotion: false,
      increasedSpacing: false,
      dyslexicFont: false,
      highContrast: false,
      cursorSize: "normal",
      textToSpeech: false
    };
    
    // Update state
    setFontSize(defaultSettings.fontSize);
    setContrast(defaultSettings.contrast);
    setReduceMotion(defaultSettings.reduceMotion);
    setIncreasedSpacing(defaultSettings.increasedSpacing);
    setDyslexicFont(defaultSettings.dyslexicFont);
    setHighContrast(defaultSettings.highContrast);
    setCursorSize(defaultSettings.cursorSize);
    setTextToSpeech(defaultSettings.textToSpeech);
    
    // Save and apply
    localStorage.setItem("accessibility-settings", JSON.stringify(defaultSettings));
    applySettings(defaultSettings);
    
    toast.info("Paramètres d'accessibilité réinitialisés", {
      description: "Les paramètres par défaut ont été restaurés."
    });
  };

  // Apply settings to DOM
  const applySettings = (settings: any) => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty("--font-size-multiplier", `${settings.fontSize / 100}`);
    
    // Contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
    
    // Reduce motion
    if (settings.reduceMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }
    
    // Spacing
    if (settings.increasedSpacing) {
      root.classList.add("increased-spacing");
    } else {
      root.classList.remove("increased-spacing");
    }
    
    // Dyslexic font
    if (settings.dyslexicFont) {
      root.classList.add("dyslexic-font");
    } else {
      root.classList.remove("dyslexic-font");
    }
    
    // Cursor size
    root.classList.remove("cursor-large", "cursor-x-large");
    if (settings.cursorSize === "large") {
      root.classList.add("cursor-large");
    } else if (settings.cursorSize === "x-large") {
      root.classList.add("cursor-x-large");
    }
  };

  return (
    <div className="container py-10">
      <Helmet>
        <title>Accessibilité - TopCenter</title>
        <meta 
          name="description" 
          content="Paramètres d'accessibilité pour TopCenter - Adaptez notre site à vos besoins spécifiques."
        />
      </Helmet>
      
      <Breadcrumbs />
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Accessibilité</h1>
        
        <p className="mb-8 text-muted-foreground">
          Adaptez votre expérience sur TopCenter.cg en fonction de vos besoins et préférences. 
          Ces paramètres seront enregistrés pour vos prochaines visites.
        </p>
        
        <Tabs defaultValue="visual">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Affichage</span>
            </TabsTrigger>
            <TabsTrigger value="reading" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>Lecture</span>
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <MousePointer2 className="h-4 w-4" />
              <span>Navigation</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FontSize className="h-5 w-5 text-primary" />
                    Taille du texte
                  </CardTitle>
                  <CardDescription>
                    Ajustez la taille du texte pour une meilleure lisibilité.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">A</span>
                      <Slider 
                        value={[fontSize]}
                        onValueChange={(values) => setFontSize(values[0])}
                        min={75}
                        max={200}
                        step={5}
                        className="w-2/3 mx-4"
                      />
                      <span className="text-xl font-bold">A</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Taille actuelle: {fontSize}%
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Contrast className="h-5 w-5 text-primary" />
                    Contraste
                  </CardTitle>
                  <CardDescription>
                    Modifiez le contraste pour améliorer la visibilité.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="high-contrast"
                        checked={highContrast}
                        onCheckedChange={setHighContrast}
                      />
                      <Label htmlFor="high-contrast">Mode contraste élevé</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Augmente le contraste entre le texte et l'arrière-plan pour une meilleure lisibilité.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Animations
                  </CardTitle>
                  <CardDescription>
                    Contrôlez les animations et les effets visuels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="reduce-motion"
                        checked={reduceMotion}
                        onCheckedChange={setReduceMotion}
                      />
                      <Label htmlFor="reduce-motion">Réduire les animations</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Désactive ou réduit les animations et transitions pour limiter les distractions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reading">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FontBold className="h-5 w-5 text-primary" />
                    Police de caractères
                  </CardTitle>
                  <CardDescription>
                    Personnalisez la police pour faciliter la lecture.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="dyslexic-font"
                        checked={dyslexicFont}
                        onCheckedChange={setDyslexicFont}
                      />
                      <Label htmlFor="dyslexic-font">Police adaptée à la dyslexie</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Utilise une police spécialement conçue pour faciliter la lecture des personnes dyslexiques.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary" />
                    Espacement du texte
                  </CardTitle>
                  <CardDescription>
                    Ajustez l'espacement pour améliorer la lisibilité.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="increased-spacing"
                        checked={increasedSpacing}
                        onCheckedChange={setIncreasedSpacing}
                      />
                      <Label htmlFor="increased-spacing">Augmenter l'espacement</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Augmente l'espacement entre les lettres, les mots et les lignes pour faciliter la lecture.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Lecture vocale
                  </CardTitle>
                  <CardDescription>
                    Options de lecture vocale du contenu.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="text-to-speech"
                        checked={textToSpeech}
                        onCheckedChange={setTextToSpeech}
                      />
                      <Label htmlFor="text-to-speech">Activer la lecture vocale</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Permet la lecture vocale du contenu sélectionné (nécessite un navigateur compatible).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="navigation">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer2 className="h-5 w-5 text-primary" />
                    Curseur
                  </CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence du curseur.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select
                      value={cursorSize}
                      onValueChange={(value) => setCursorSize(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Taille du curseur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="large">Grand</SelectItem>
                        <SelectItem value="x-large">Très grand</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Modifie la taille du curseur pour faciliter la navigation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={resetSettings}>
            Réinitialiser les paramètres
          </Button>
          <Button onClick={saveSettings} className="gap-2">
            <Check className="h-4 w-4" />
            Enregistrer les paramètres
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
