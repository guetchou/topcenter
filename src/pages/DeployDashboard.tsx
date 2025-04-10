
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Phone, Users, MessageSquare, Mail, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuoteForm } from "@/components/deploy/QuoteForm";
import { QuoteResult } from "@/components/deploy/QuoteResult";
import { DeploymentView } from "@/components/deploy/DeploymentView";
import { DeploymentHistory } from "@/components/deploy/DeploymentHistory";
import { defaultPricingModel } from "@/models/pricing";

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
  
  // Services catalog
  const servicesCatalog = [
    { id: "call-center", name: "Centre d'appels", icon: <Phone className="h-5 w-5" />, basePrice: 85000 },
    { id: "crm", name: "CRM Intégré", icon: <Users className="h-5 w-5" />, basePrice: 200000 },
    { id: "live-chat", name: "Chat en direct", icon: <MessageSquare className="h-5 w-5" />, basePrice: 150000 },
    { id: "email-support", name: "Support email", icon: <Mail className="h-5 w-5" />, basePrice: 100000 },
    { id: "multilingual", name: "Support multilingue", icon: <Globe className="h-5 w-5" />, basePrice: 300000 },
  ];
  
  // Handle simulator changes
  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSliderChange = (name: string, value: number[]) => {
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
  
  const handleSelectChange = (name: string, value: string) => {
    setPackageConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setPackageConfig(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const toggleService = (serviceId: string) => {
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
    const monthlyBasePrice = agentCount * defaultPricingModel.baseAgentPrice;
    
    // Additional features
    const supportFee = packageConfig.includeSupport ? defaultPricingModel.supportFee : 0;
    const crmFee = packageConfig.includeCRM ? defaultPricingModel.crmFee : 0;
    const multilingualFee = packageConfig.multilingual ? defaultPricingModel.multilingualFee : 0;
    const additionalFeatures = supportFee + crmFee + multilingualFee;
    
    // Calculate total
    let total = monthlyBasePrice + additionalFeatures;
    if (packageConfig.servicePeriod === "yearly") {
      // Apply yearly discount
      total = total * 12 * (1 - defaultPricingModel.yearlyDiscount);
    } else {
      // Monthly price without discount
      total = total;
    }
    
    // One-time setup fee
    const setupFee = defaultPricingModel.setupFee;
    
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
            <QuoteForm 
              businessInfo={businessInfo}
              setBusinessInfo={setBusinessInfo}
              packageConfig={packageConfig}
              setPackageConfig={setPackageConfig}
              generateQuote={generateQuote}
              resetForm={resetForm}
              handleBusinessInfoChange={handleBusinessInfoChange}
              handleSliderChange={handleSliderChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
            />
            
            {quoteResult && (
              <QuoteResult 
                quoteResult={quoteResult}
                packageConfig={packageConfig}
                downloadQuote={downloadQuote}
                setActiveTab={setActiveTab}
              />
            )}
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-8">
            <DeploymentView 
              currentStep={currentStep}
              deploymentStatus={deploymentStatus}
              logs={logs}
              startDeployment={startDeployment}
              setActiveTab={setActiveTab}
              packageConfig={packageConfig}
              resetForm={resetForm}
            />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <DeploymentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DeployDashboard;
