
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Clock, 
  GitPullRequest, 
  AlertTriangle, 
  CheckCheck, 
  Server,
  Shield,
  Database,
  DownloadCloud,
  Upload,
  Phone,
  Users,
  MessageSquare,
  Mail,
  Globe,
  Building,
  Settings,
  TerminalSquare,
  History,
  Bot,
  ServerCog,
  Network
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DeploymentProgress } from "@/components/deploy/DeploymentProgress";
import { DeploymentStep } from "@/components/deploy/DeploymentStep";
import { DeploymentSummary } from "@/components/deploy/DeploymentSummary";

const DeployDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("quotation");
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Quote simulator state
  const [businessInfo, setBusinessInfo] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    employees: [10], // for slider
    budget: "",
  });
  
  // Service package simulator state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [packageConfig, setPackageConfig] = useState({
    agentCount: [5],
    servicePeriod: "monthly",
    callVolume: "medium",
    includeSupport: true,
    includeCRM: false,
    multilingual: false,
  });
  
  // Quote result
  const [quoteResult, setQuoteResult] = useState<null | {
    basePrice: number;
    setup: number;
    additionalFeatures: number;
    total: number;
  }>(null);
  
  // Pricing model (would come from API in real implementation)
  const pricingModel = {
    baseAgentPrice: 85000, // FCFA per agent per month
    setupFee: 250000, // FCFA
    supportFee: 150000, // FCFA per month
    crmFee: 200000, // FCFA per month
    multilingualFee: 300000, // FCFA per month
    yearlyDiscount: 0.15, // 15% discount for yearly subscription
  };
  
  // Services catalog
  const servicesCatalog = [
    { id: "call-center", name: "Centre d'appels", icon: <Phone className="h-5 w-5" />, basePrice: 85000 },
    { id: "crm", name: "CRM Intégré", icon: <Users className="h-5 w-5" />, basePrice: 200000 },
    { id: "live-chat", name: "Chat en direct", icon: <MessageSquare className="h-5 w-5" />, basePrice: 150000 },
    { id: "email-support", name: "Support email", icon: <Mail className="h-5 w-5" />, basePrice: 100000 },
    { id: "multilingual", name: "Support multilingue", icon: <Globe className="h-5 w-5" />, basePrice: 300000 },
    { id: "24-7-support", name: "Support 24/7", icon: <Clock className="h-5 w-5" />, basePrice: 500000 },
  ];
  
  // Handle simulator changes
  const handleBusinessInfoChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSliderChange = (name, value) => {
    if (name === "agentCount") {
      setPackageConfig(prev => ({
        ...prev,
        agentCount: value
      }));
    } else if (name === "employees") {
      setBusinessInfo(prev => ({
        ...prev,
        employees: value
      }));
    }
  };
  
  const handleSelectChange = (name, value) => {
    setPackageConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name, checked) => {
    setPackageConfig(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };
  
  // Calculate quote
  const calculateQuote = () => {
    // Base calculation
    const agentCount = packageConfig.agentCount[0];
    const monthlyBasePrice = agentCount * pricingModel.baseAgentPrice;
    
    // Additional features
    const supportFee = packageConfig.includeSupport ? pricingModel.supportFee : 0;
    const crmFee = packageConfig.includeCRM ? pricingModel.crmFee : 0;
    const multilingualFee = packageConfig.multilingual ? pricingModel.multilingualFee : 0;
    const additionalFeatures = supportFee + crmFee + multilingualFee;
    
    // Calculate total
    let total = monthlyBasePrice + additionalFeatures;
    if (packageConfig.servicePeriod === "yearly") {
      // Apply yearly discount
      total = total * 12 * (1 - pricingModel.yearlyDiscount);
    } else {
      // Monthly price without discount
      total = total;
    }
    
    // One-time setup fee
    const setupFee = pricingModel.setupFee;
    
    return {
      basePrice: monthlyBasePrice,
      setup: setupFee,
      additionalFeatures,
      total: packageConfig.servicePeriod === "yearly" ? total + setupFee : total + setupFee
    };
  };
  
  // Generate quote
  const generateQuote = () => {
    if (!businessInfo.companyName || !businessInfo.email) {
      toast({
        title: "Information manquante",
        description: "Veuillez remplir les informations de contact requises.",
        variant: "destructive"
      });
      return;
    }
    
    const quote = calculateQuote();
    setQuoteResult(quote);
    
    toast({
      title: "Devis généré",
      description: "Votre devis a été généré avec succès!",
    });
  };
  
  // Simulate deployment
  const startDeployment = () => {
    if (!quoteResult) {
      toast({
        title: "Génération requise",
        description: "Veuillez d'abord générer un devis.",
        variant: "destructive"
      });
      return;
    }
    
    setDeploymentStatus("running");
    setCurrentStep(1);
    setLogs(["Démarrage du déploiement..."]);
    
    // Simulate deployment steps
    const steps = [
      "Vérification des prérequis...",
      "Configuration des services...",
      "Création des utilisateurs...",
      "Configuration de la base de données...",
      "Déploiement des agents virtuels...",
      "Configuration du serveur...",
      "Test des connexions...",
      "Finalisation du déploiement..."
    ];
    
    let stepIndex = 0;
    
    const deployInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLogs(prev => [...prev, steps[stepIndex]]);
        stepIndex++;
        setCurrentStep(stepIndex + 1);
      } else {
        clearInterval(deployInterval);
        setLogs(prev => [...prev, "Déploiement terminé avec succès!"]);
        setDeploymentStatus("success");
      }
    }, 1500);
    
    return () => clearInterval(deployInterval);
  };
  
  // Reset the form
  const resetForm = () => {
    setBusinessInfo({
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      industry: "",
      employees: [10],
      budget: "",
    });
    
    setPackageConfig({
      agentCount: [5],
      servicePeriod: "monthly",
      callVolume: "medium",
      includeSupport: true,
      includeCRM: false,
      multilingual: false,
    });
    
    setSelectedServices([]);
    setQuoteResult(null);
    setDeploymentStatus("idle");
    setCurrentStep(0);
    setLogs([]);
    
    toast({
      title: "Formulaire réinitialisé",
      description: "Vous pouvez maintenant créer un nouveau devis."
    });
  };
  
  // Download quote as PDF
  const downloadQuote = () => {
    toast({
      title: "Téléchargement du devis",
      description: "Le devis sera téléchargé en format PDF."
    });
    
    // In a real implementation, this would generate and download a PDF
    console.log("Download quote for:", businessInfo, packageConfig, quoteResult);
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de Bord de Déploiement</h1>
          <p className="text-muted-foreground">
            Créez un devis automatique et simulez différents packs de services en ligne.
          </p>
        </div>
        
        <Tabs defaultValue="quotation" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="quotation">Simulateur de Devis</TabsTrigger>
            <TabsTrigger value="deployment">Déploiement</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quotation" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    Information Entreprise
                  </CardTitle>
                  <CardDescription>
                    Parlez-nous de votre entreprise et de vos besoins
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                      <Input 
                        id="companyName" 
                        name="companyName" 
                        value={businessInfo.companyName}
                        onChange={handleBusinessInfoChange}
                        placeholder="TopCenter SARL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Nom du contact</Label>
                      <Input 
                        id="contactName" 
                        name="contactName" 
                        value={businessInfo.contactName}
                        onChange={handleBusinessInfoChange}
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={businessInfo.email}
                        onChange={handleBusinessInfoChange}
                        placeholder="contact@entreprise.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={businessInfo.phone}
                        onChange={handleBusinessInfoChange}
                        placeholder="+242 06 XXX XXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Secteur d'activité</Label>
                    <Select 
                      value={businessInfo.industry}
                      onValueChange={(value) => setBusinessInfo(prev => ({...prev, industry: value}))}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telecom">Télécommunications</SelectItem>
                        <SelectItem value="finance">Finance & Banque</SelectItem>
                        <SelectItem value="retail">Commerce de détail</SelectItem>
                        <SelectItem value="healthcare">Santé</SelectItem>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="government">Gouvernement</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Nombre d'employés: {businessInfo.employees[0]}</Label>
                    <Slider 
                      value={businessInfo.employees}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleSliderChange("employees", value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget approximatif (FCFA)</Label>
                    <Input 
                      id="budget" 
                      name="budget" 
                      value={businessInfo.budget}
                      onChange={handleBusinessInfoChange}
                      placeholder="Ex: 1,000,000 FCFA"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Package Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Configuration du Pack
                  </CardTitle>
                  <CardDescription>
                    Personnalisez votre pack de services selon vos besoins
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Nombre d'agents: {packageConfig.agentCount[0]}</Label>
                    <Slider 
                      value={packageConfig.agentCount}
                      min={1}
                      max={50}
                      step={1}
                      onValueChange={(value) => handleSliderChange("agentCount", value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="servicePeriod">Période de service</Label>
                    <Select 
                      value={packageConfig.servicePeriod}
                      onValueChange={(value) => handleSelectChange("servicePeriod", value)}
                    >
                      <SelectTrigger id="servicePeriod">
                        <SelectValue placeholder="Sélectionnez une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="yearly">Annuel (remise de 15%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="callVolume">Volume d'appels prévu</Label>
                    <Select 
                      value={packageConfig.callVolume}
                      onValueChange={(value) => handleSelectChange("callVolume", value)}
                    >
                      <SelectTrigger id="callVolume">
                        <SelectValue placeholder="Sélectionnez un volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible (jusqu'à 500 appels/mois)</SelectItem>
                        <SelectItem value="medium">Moyen (500-2000 appels/mois)</SelectItem>
                        <SelectItem value="high">Élevé (2000+ appels/mois)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Options supplémentaires</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="includeSupport">Support technique 8h-18h</Label>
                        <p className="text-sm text-muted-foreground">Support par email et téléphone</p>
                      </div>
                      <Switch 
                        id="includeSupport"
                        checked={packageConfig.includeSupport}
                        onCheckedChange={(checked) => handleSwitchChange("includeSupport", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="includeCRM">Intégration CRM</Label>
                        <p className="text-sm text-muted-foreground">Connexion à votre système existant</p>
                      </div>
                      <Switch 
                        id="includeCRM"
                        checked={packageConfig.includeCRM}
                        onCheckedChange={(checked) => handleSwitchChange("includeCRM", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="multilingual">Support multilingue</Label>
                        <p className="text-sm text-muted-foreground">Français, Anglais, Lingala, Kituba</p>
                      </div>
                      <Switch 
                        id="multilingual"
                        checked={packageConfig.multilingual}
                        onCheckedChange={(checked) => handleSwitchChange("multilingual", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetForm}>
                    Réinitialiser
                  </Button>
                  <Button onClick={generateQuote}>
                    Générer un devis
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Quote Result */}
            {quoteResult && (
              <Card className="border border-primary/30">
                <CardHeader className="bg-primary/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Devis Estimatif
                      </CardTitle>
                      <CardDescription>
                        Basé sur les informations fournies
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 text-lg font-semibold">
                      {quoteResult.total.toLocaleString()} FCFA
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Détails du devis</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Service de base ({packageConfig.agentCount[0]} agents):</span>
                          <span>{quoteResult.basePrice.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais d'installation:</span>
                          <span>{quoteResult.setup.toLocaleString()} FCFA</span>
                        </div>
                        {quoteResult.additionalFeatures > 0 && (
                          <div className="flex justify-between">
                            <span>Options supplémentaires:</span>
                            <span>{quoteResult.additionalFeatures.toLocaleString()} FCFA</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total ({packageConfig.servicePeriod === 'yearly' ? 'annuel' : 'mensuel'}):</span>
                          <span>{quoteResult.total.toLocaleString()} FCFA</span>
                        </div>
                        {packageConfig.servicePeriod === 'yearly' && (
                          <div className="text-xs text-right text-green-600">
                            Économie de 15% avec l'engagement annuel!
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Configuration</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{packageConfig.agentCount[0]} agents</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Engagement {packageConfig.servicePeriod === 'yearly' ? 'annuel' : 'mensuel'}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Volume d'appels {
                            packageConfig.callVolume === 'low' ? 'faible' :
                            packageConfig.callVolume === 'medium' ? 'moyen' : 'élevé'
                          }</span>
                        </li>
                        {packageConfig.includeSupport && (
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Support technique inclus</span>
                          </li>
                        )}
                        {packageConfig.includeCRM && (
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Intégration CRM</span>
                          </li>
                        )}
                        {packageConfig.multilingual && (
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Support multilingue</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Note importante</AlertTitle>
                    <AlertDescription>
                      Ce devis est une estimation basée sur les informations fournies. Un conseiller TopCenter
                      vous contactera pour finaliser votre offre personnalisée.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="gap-2" onClick={downloadQuote}>
                    <DownloadCloud className="h-4 w-4" />
                    Télécharger PDF
                  </Button>
                  <Button className="gap-2" onClick={() => {
                    setActiveTab("deployment");
                  }}>
                    Lancer le déploiement
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitPullRequest className="h-5 w-5 text-primary" />
                    Déploiement des Services
                  </CardTitle>
                  <CardDescription>
                    Lancer le déploiement automatisé de votre pack de services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeploymentProgress currentStep={currentStep} totalSteps={8} />
                  
                  <div className="mt-8 space-y-6">
                    <DeploymentStep 
                      number={1} 
                      title="Vérification des prérequis" 
                      description="Vérification de la compatibilité et des ressources nécessaires"
                      status={currentStep >= 1 ? "completed" : "pending"}
                      icon={<Shield className="h-5 w-5" />}
                    />
                    
                    <DeploymentStep 
                      number={2} 
                      title="Configuration des services" 
                      description="Mise en place des services selon votre configuration"
                      status={currentStep >= 2 ? "completed" : currentStep === 1 ? "in-progress" : "pending"}
                      icon={<Server className="h-5 w-5" />}
                    />
                    
                    <DeploymentStep 
                      number={3} 
                      title="Création des utilisateurs" 
                      description="Création des comptes pour vos agents"
                      status={currentStep >= 3 ? "completed" : currentStep === 2 ? "in-progress" : "pending"}
                      icon={<Users className="h-5 w-5" />}
                    />
                    
                    <DeploymentStep 
                      number={4} 
                      title="Configuration de la base de données" 
                      description="Préparation de l'infrastructure de données"
                      status={currentStep >= 4 ? "completed" : currentStep === 3 ? "in-progress" : "pending"}
                      icon={<Database className="h-5 w-5" />}
                    />
                    
                    <DeploymentStep 
                      number={5} 
                      title="Déploiement des agents virtuels" 
                      description="Installation des agents virtuels pour le support automatisé"
                      status={currentStep >= 5 ? "completed" : currentStep === 4 ? "in-progress" : "pending"}
                      icon={<Bot className="h-5 w-5" />}
                    />
                    
                    <DeploymentStep 
                      number={6} 
                      title="Configuration du serveur" 
                      description="Optimisation des serveurs pour votre charge de travail"
                      status={currentStep >= 6 ? "completed" : currentStep === 5 ? "in-progress" : "pending"}
                      icon={<ServerCog className="h-5 w-5" />}
                    />
                    
                    <DeploymentStep 
                      number={7} 
                      title="Test des connexions" 
                      description="Vérification des connexions et des intégrations"
                      status={currentStep >= 7 ? "completed" : currentStep === 6 ? "in-progress" : "pending"}
                      icon={<Network className="h-5 w-5" />}
                    />
                    
                    <DeploymentStep 
                      number={8} 
                      title="Finalisation du déploiement" 
                      description="Dernières vérifications et activation des services"
                      status={currentStep >= 8 ? "completed" : currentStep === 7 ? "in-progress" : "pending"}
                      icon={<CheckCheck className="h-5 w-5" />}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("quotation")}
                    disabled={deploymentStatus === "running"}
                  >
                    Retour au devis
                  </Button>
                  <Button 
                    onClick={startDeployment} 
                    disabled={deploymentStatus === "running" || deploymentStatus === "success"}
                  >
                    {deploymentStatus === "idle" && "Lancer le déploiement"}
                    {deploymentStatus === "running" && "Déploiement en cours..."}
                    {deploymentStatus === "success" && "Déploiement terminé"}
                    {deploymentStatus === "failed" && "Réessayer"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TerminalSquare className="h-5 w-5 text-primary" />
                    Logs de déploiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-[400px] overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-gray-500">Les logs de déploiement apparaîtront ici...</p>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className="mb-1">
                          <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                        </div>
                      ))
                    )}
                    {deploymentStatus === "running" && (
                      <div className="animate-pulse">_</div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {deploymentStatus === "success" && (
                <Card className="border-green-500">
                  <CardHeader className="bg-green-50 dark:bg-green-900/20">
                    <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      Déploiement réussi
                    </CardTitle>
                    <CardDescription>
                      Votre pack de services a été déployé avec succès
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <DeploymentSummary 
                      packageType={`Pack ${packageConfig.agentCount[0]} agents`}
                      deploymentDate={new Date().toLocaleDateString()}
                      deploymentId={`DEP-${Math.floor(Math.random() * 100000)}`}
                    />
                    
                    <div className="mt-6 space-y-4">
                      <h3 className="font-medium">Prochaines étapes</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Un conseiller TopCenter vous contactera dans les 24h pour finaliser la configuration.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Vous recevrez vos identifiants d'accès par email.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>Une session de formation sera planifiée pour vos équipes.</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={resetForm}>
                      <Upload className="h-4 w-4" />
                      Commencer un nouveau déploiement
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Historique des déploiements
                </CardTitle>
                <CardDescription>
                  Suivez l'historique de vos déploiements et devis générés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Pack 5 agents</h3>
                        <p className="text-sm text-muted-foreground">
                          Déployé le 09/04/2025
                        </p>
                      </div>
                      <Badge>Actif</Badge>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        <span className="font-medium">Total :</span> 850,000 FCFA
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">ID :</span> DEP-58942
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="p-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">Voir détails</Button>
                    <Button variant="outline" size="sm">Télécharger facture</Button>
                  </div>
                </div>
                
                {/* Placeholder for empty state */}
                <div className="mt-4 p-8 text-center border rounded-md border-dashed">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">Aucun autre déploiement</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Les déploiements futurs apparaîtront ici.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeployDashboard;
