
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Calendar, Clock, Download, MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Devis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "call-center",
    agentCount: [10],
    hours: [40],
    additionalServices: false,
    additionalLanguages: false,
    crm: false,
    priority: "standard"
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<null | {
    basePrice: number;
    additionalServices: number;
    additionalLanguages: number;
    crmIntegration: number;
    prioritySupport: number;
    total: number;
  }>(null);

  // Prix estimatifs par services
  const PRICING = {
    "call-center": {
      basePrice: 40, // Prix par agent par heure
      additionalServices: 500, // Prix mensuel
      additionalLanguages: 300, // Prix mensuel
      crmIntegration: 750, // Prix unique de mise en place
      prioritySupport: {
        standard: 0,
        premium: 250,
        enterprise: 500
      }
    },
    "appointment-scheduling": {
      basePrice: 30, // Prix par agent par heure
      additionalServices: 300, // Prix mensuel
      additionalLanguages: 200, // Prix mensuel
      crmIntegration: 500, // Prix unique de mise en place
      prioritySupport: {
        standard: 0,
        premium: 150,
        enterprise: 350
      }
    },
    "live-chat": {
      basePrice: 35, // Prix par agent par heure
      additionalServices: 400, // Prix mensuel
      additionalLanguages: 250, // Prix mensuel
      crmIntegration: 600, // Prix unique de mise en place
      prioritySupport: {
        standard: 0,
        premium: 200,
        enterprise: 450
      }
    },
    "support-24-7": {
      basePrice: 50, // Prix par agent par heure
      additionalServices: 700, // Prix mensuel
      additionalLanguages: 400, // Prix mensuel
      crmIntegration: 900, // Prix unique de mise en place
      prioritySupport: {
        standard: 0,
        premium: 350,
        enterprise: 750
      }
    }
  };

  const calculateQuote = () => {
    const service = PRICING[formData.service];
    const basePrice = service.basePrice * formData.agentCount[0] * formData.hours[0] * 4; // 4 semaines/mois
    const additionalServices = formData.additionalServices ? service.additionalServices : 0;
    const additionalLanguages = formData.additionalLanguages ? service.additionalLanguages : 0;
    const crmIntegration = formData.crm ? service.crmIntegration : 0;
    const prioritySupport = service.prioritySupport[formData.priority];
    
    const total = basePrice + additionalServices + additionalLanguages + crmIntegration + prioritySupport;
    
    return {
      basePrice,
      additionalServices,
      additionalLanguages,
      crmIntegration,
      prioritySupport,
      total
    };
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs obligatoires.",
          variant: "destructive"
        });
        return;
      }
    }

    if (step === 3) {
      // Calculer le devis
      const calculatedQuote = calculateQuote();
      setQuote(calculatedQuote);
    }

    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSliderChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSwitchChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enregistrer les informations de contact
      const { error: contactError } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Demande de devis - ${formData.service}`,
          service: formData.service,
          status: 'nouveau'
        }]);

      if (contactError) throw contactError;

      // Enregistrer les détails du devis
      const { error: quoteError } = await supabase
        .from('quotes')
        .insert([{
          contact_email: formData.email,
          service_type: formData.service,
          agent_count: formData.agentCount[0],
          hours_per_week: formData.hours[0],
          additional_services: formData.additionalServices,
          additional_languages: formData.additionalLanguages,
          crm_integration: formData.crm,
          priority_level: formData.priority,
          quote_amount: quote.total,
          status: 'pending'
        }]);

      if (quoteError) throw quoteError;

      toast({
        title: "Demande envoyée !",
        description: "Votre demande de devis a été envoyée avec succès. Un conseiller vous contactera prochainement."
      });

      // Attendre 2 secondes puis rediriger vers la page d'accueil
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du devis :", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    { value: "call-center", label: "Centre d'appels", icon: Phone },
    { value: "appointment-scheduling", label: "Prise de rendez-vous", icon: Calendar },
    { value: "live-chat", label: "Chat en direct", icon: MessageCircle },
    { value: "support-24-7", label: "Support 24/7", icon: Clock }
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Votre nom" 
                value={formData.name} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel *</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="votre.email@entreprise.com" 
                value={formData.email} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input 
                id="phone" 
                name="phone" 
                placeholder="Votre numéro de téléphone" 
                value={formData.phone} 
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise (optionnel)</Label>
              <Input 
                id="company" 
                name="company" 
                placeholder="Nom de votre entreprise" 
                value={formData.company} 
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Service principal</Label>
              <Select 
                name="service" 
                value={formData.service} 
                onValueChange={(value) => handleSelectChange("service", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un service" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <option.icon className="mr-2 h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Nombre d'agents: {formData.agentCount[0]}</Label>
              <Slider 
                value={formData.agentCount} 
                min={1} 
                max={50} 
                step={1} 
                onValueChange={(value) => handleSliderChange("agentCount", value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Heures par semaine: {formData.hours[0]}</Label>
              <Slider 
                value={formData.hours} 
                min={10} 
                max={168} 
                step={5} 
                onValueChange={(value) => handleSliderChange("hours", value)} 
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Services additionnels</Label>
                <p className="text-sm text-muted-foreground">
                  Support multicanal, enquêtes de satisfaction, rapports personnalisés
                </p>
              </div>
              <Switch 
                checked={formData.additionalServices} 
                onCheckedChange={(checked) => handleSwitchChange("additionalServices", checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Support multilingue</Label>
                <p className="text-sm text-muted-foreground">
                  Anglais, espagnol, arabe et autres langues
                </p>
              </div>
              <Switch 
                checked={formData.additionalLanguages} 
                onCheckedChange={(checked) => handleSwitchChange("additionalLanguages", checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Intégration CRM</Label>
                <p className="text-sm text-muted-foreground">
                  Integration avec votre système de gestion client existant
                </p>
              </div>
              <Switch 
                checked={formData.crm} 
                onCheckedChange={(checked) => handleSwitchChange("crm", checked)} 
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <Label>Niveau de priorité</Label>
              <Select 
                name="priority" 
                value={formData.priority} 
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calculator className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-1">Votre devis estimatif</h3>
              <p className="text-muted-foreground mb-6">
                Ce devis est une estimation basée sur les informations fournies.
              </p>
            </div>
            
            {quote && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Service de base:</span>
                    <span className="font-medium">{quote.basePrice.toLocaleString()} €</span>
                  </div>
                  
                  {quote.additionalServices > 0 && (
                    <div className="flex justify-between">
                      <span>Services additionnels:</span>
                      <span className="font-medium">{quote.additionalServices.toLocaleString()} €</span>
                    </div>
                  )}
                  
                  {quote.additionalLanguages > 0 && (
                    <div className="flex justify-between">
                      <span>Support multilingue:</span>
                      <span className="font-medium">{quote.additionalLanguages.toLocaleString()} €</span>
                    </div>
                  )}
                  
                  {quote.crmIntegration > 0 && (
                    <div className="flex justify-between">
                      <span>Intégration CRM:</span>
                      <span className="font-medium">{quote.crmIntegration.toLocaleString()} €</span>
                    </div>
                  )}
                  
                  {quote.prioritySupport > 0 && (
                    <div className="flex justify-between">
                      <span>Support prioritaire:</span>
                      <span className="font-medium">{quote.prioritySupport.toLocaleString()} €</span>
                    </div>
                  )}
                  
                  <div className="border-t my-2 pt-2 flex justify-between font-bold">
                    <span>Total mensuel estimé:</span>
                    <span className="text-primary">{quote.total.toLocaleString()} €</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  * Les prix sont hors taxes. Un conseiller vous contactera pour établir un devis personnalisé précis.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="py-12 container max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Demande de devis</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Obtenez une estimation personnalisée pour vos besoins en relation client
        </p>
      </div>

      <div className="flex mb-8">
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <Tabs defaultValue="formulaire" className="mb-8">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="formulaire">Formulaire</TabsTrigger>
          <TabsTrigger value="services">Nos services</TabsTrigger>
        </TabsList>
        <TabsContent value="formulaire">
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Vos coordonnées"}
                {step === 2 && "Vos besoins principaux"}
                {step === 3 && "Options supplémentaires"}
                {step === 4 && "Votre devis"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Renseignez vos informations de contact"}
                {step === 2 && "Dites-nous ce dont vous avez besoin"}
                {step === 3 && "Personnalisez votre offre"}
                {step === 4 && "Récapitulatif de votre demande"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={previousStep}>
                  Précédent
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < 4 ? (
                <Button onClick={nextStep}>
                  Continuer
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Envoi en cours..." : "Envoyer ma demande"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <div className="grid md:grid-cols-2 gap-6">
            {serviceOptions.map((service) => (
              <Card key={service.value} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <service.icon className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>{service.label}</CardTitle>
                  <CardDescription>
                    {service.value === "call-center" && "Gestion professionnelle de vos appels clients"}
                    {service.value === "appointment-scheduling" && "Organisation efficace des rendez-vous"}
                    {service.value === "live-chat" && "Support instantané en ligne"}
                    {service.value === "support-24-7" && "Assistance complète 24h/24 et 7j/7"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    {service.value === "call-center" && "Notre service de centre d'appel comprend des équipes formées pour représenter votre marque et gérer tous les types d'appels entrants et sortants."}
                    {service.value === "appointment-scheduling" && "Notre service de prise de rendez-vous vous permet d'optimiser votre agenda et de réduire les absences grâce à nos systèmes de confirmation et de rappel."}
                    {service.value === "live-chat" && "Notre service de chat en direct offre à vos clients une assistance immédiate sur votre site web, augmentant ainsi les taux de conversion et la satisfaction client."}
                    {service.value === "support-24-7" && "Notre service de support 24/7 garantit une présence constante pour vos clients, quelle que soit l'heure, assurant une expérience client optimale."}
                  </p>
                  <div className="font-medium">À partir de {PRICING[service.value].basePrice}€ / heure / agent</div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setFormData({...formData, service: service.value});
                      setStep(1);
                    }}
                  >
                    Choisir ce service
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-8">
        <p className="text-muted-foreground">
          Besoin d'une solution sur mesure ? <a href="/contact" className="font-medium text-primary hover:underline">Contactez-nous directement</a>
        </p>
      </div>
    </div>
  );
};

export default Devis;
