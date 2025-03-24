
import { useState, useEffect } from 'react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { X, CheckCircle, Settings, Shield } from 'lucide-react';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Switch } from './switch';

interface ConsentOption {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface ConsentManagerProps {
  appName?: string;
  privacyPolicyUrl?: string;
  position?: 'bottom' | 'bottom-left' | 'bottom-right';
  options?: ConsentOption[];
}

const defaultOptions: ConsentOption[] = [
  {
    id: 'necessary',
    name: 'Strictement nécessaires',
    description: 'Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.',
    required: true,
  },
  {
    id: 'preferences',
    name: 'Préférences',
    description: 'Ces cookies permettent de se souvenir de vos préférences comme le thème choisi ou la langue.',
    required: false,
  },
  {
    id: 'analytics',
    name: 'Statistiques',
    description: 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Ces cookies sont utilisés pour suivre les visiteurs sur les sites Web afin d\'afficher des publicités pertinentes.',
    required: false,
  },
];

export function ConsentManager({
  appName = 'TopCenter',
  privacyPolicyUrl = '/privacy-policy',
  position = 'bottom',
  options = defaultOptions,
}: ConsentManagerProps) {
  const [consentGiven, setConsentGiven] = usePersistentState<boolean>('cookie-consent-given', false);
  const [consentOptions, setConsentOptions] = usePersistentState<Record<string, boolean>>('cookie-consent-options', {});
  const [showDetails, setShowDetails] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Initialize consent options if they don't exist
  useEffect(() => {
    if (!consentGiven) {
      const initialOptions: Record<string, boolean> = {};
      options.forEach(option => {
        initialOptions[option.id] = option.required;
      });
      setConsentOptions(initialOptions);
    }
    
    // Show banner after a small delay to avoid flash on page load
    const timer = setTimeout(() => {
      setIsVisible(!consentGiven);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [consentGiven, options, setConsentOptions]);

  const handleAcceptAll = () => {
    const acceptedOptions: Record<string, boolean> = {};
    options.forEach(option => {
      acceptedOptions[option.id] = true;
    });
    setConsentOptions(acceptedOptions);
    setConsentGiven(true);
  };

  const handleAcceptSelected = () => {
    setConsentGiven(true);
  };

  const handleRejectAll = () => {
    const rejectedOptions: Record<string, boolean> = {};
    options.forEach(option => {
      rejectedOptions[option.id] = option.required;
    });
    setConsentOptions(rejectedOptions);
    setConsentGiven(true);
  };

  const handleToggleOption = (id: string, value: boolean) => {
    if (options.find(option => option.id === id)?.required) return;
    
    setConsentOptions(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleShowPreferences = () => {
    setShowDetails(true);
  };

  const positionClasses = {
    'bottom': 'bottom-0 left-0 right-0',
    'bottom-left': 'bottom-4 left-4 max-w-md',
    'bottom-right': 'bottom-4 right-4 max-w-md',
  };

  return isVisible ? (
    <div className={`fixed z-50 ${positionClasses[position]} shadow-lg bg-background border rounded-lg transition-all duration-300 ease-in-out`}>
      <div className="p-4 md:p-6">
        {!showDetails ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Paramètres de confidentialité</h2>
              </div>
              <button 
                onClick={() => setIsVisible(false)} 
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre expérience sur {appName}. 
              Vous pouvez choisir quels cookies vous acceptez et modifier vos préférences à tout moment.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleShowPreferences}>
                <Settings className="h-4 w-4 mr-2" />
                Personnaliser
              </Button>
              <Button size="sm" variant="outline" onClick={handleRejectAll}>
                Refuser
              </Button>
              <Button size="sm" variant="default" onClick={handleAcceptAll}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Tout accepter
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              En cliquant sur "Accepter tout", vous consentez à l'utilisation de tous les cookies. Pour plus d'informations, veuillez consulter notre{' '}
              <a href={privacyPolicyUrl} className="underline hover:text-primary">
                politique de confidentialité
              </a>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">Préférences de cookies</h2>
              <button 
                onClick={() => setShowDetails(false)} 
                className="text-muted-foreground hover:text-foreground"
                aria-label="Retour"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <Tabs defaultValue="preferences" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
                <TabsTrigger value="about">À propos des cookies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preferences" className="space-y-4 pt-4">
                {options.map(option => (
                  <div key={option.id} className="flex items-start justify-between space-x-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium">{option.name}</h3>
                        {option.required && (
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    <Switch
                      checked={consentOptions[option.id] || false}
                      onCheckedChange={checked => handleToggleOption(option.id, checked)}
                      disabled={option.required}
                    />
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="about" className="space-y-4 pt-4">
                <div className="text-sm space-y-4">
                  <p>
                    Les cookies sont de petits fichiers texte placés sur votre appareil lors de la navigation sur les sites Web. 
                    Ils sont largement utilisés pour faire fonctionner les sites Web ou pour fonctionner plus efficacement, 
                    ainsi que pour fournir des informations aux propriétaires du site.
                  </p>
                  <h3 className="font-medium">Comment utilisons-nous les cookies ?</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Cookies strictement nécessaires : essentiels au fonctionnement du site.</li>
                    <li>Cookies de préférences : permettent de mémoriser vos choix et préférences.</li>
                    <li>Cookies statistiques : nous aident à comprendre comment vous utilisez notre site.</li>
                    <li>Cookies marketing : utilisés pour afficher des publicités pertinentes.</li>
                  </ul>
                  <p>
                    Pour plus d'informations, veuillez consulter notre{' '}
                    <a href={privacyPolicyUrl} className="underline hover:text-primary">
                      politique de confidentialité
                    </a>.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={handleRejectAll}>
                Tout refuser
              </Button>
              <Button size="sm" variant="outline" onClick={handleAcceptSelected}>
                Enregistrer les préférences
              </Button>
              <Button size="sm" variant="default" onClick={handleAcceptAll}>
                Tout accepter
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default ConsentManager;
