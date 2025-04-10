
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Phone, Users } from "lucide-react";
import { toast } from "sonner";
import { QuoteForm } from "@/components/deploy/QuoteForm";
import { QuoteResult } from "@/components/deploy/QuoteResult";
import { DeploymentView } from "@/components/deploy/DeploymentView";
import { DeploymentHistory } from "@/components/deploy/DeploymentHistory";
import { DeploymentLogs } from "@/components/deploy/DeploymentLogs";
import { DeploymentControls } from "@/components/deploy/DeploymentControls";
import { defaultPricingModel } from "@/models/pricing";

const DeployDashboard = () => {
  // State for navigation and view control
  const [activeTab, setActiveTab] = useState("quotation");
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "running" | "success" | "failed">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Business information state
  const [businessInfo, setBusinessInfo] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    employees: [10],
    budget: "",
  });
  
  // Package configuration state
  const [packageConfig, setPackageConfig] = useState({
    agentCount: [5],
    servicePeriod: "monthly",
    callVolume: "medium",
    includeSupport: true,
    includeCRM: false,
    multilingual: false,
  });
  
  // Service selection state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Quote result state
  const [quoteResult, setQuoteResult] = useState<null | {
    basePrice: number;
    setup: number;
    additionalFeatures: number;
    total: number;
  }>(null);
  
  // Form handlers
  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSliderChange = (name: string, value: number[]) => {
    if (name === "agentCount") {
      setPackageConfig(prev => ({ ...prev, agentCount: value }));
    } else if (name === "employees") {
      setBusinessInfo(prev => ({ ...prev, employees: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setPackageConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setPackageConfig(prev => ({ ...prev, [name]: checked }));
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
  
  // Quote calculation
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
  
  // Action handlers
  const generateQuote = () => {
    if (!businessInfo.companyName || !businessInfo.email) {
      toast.error("Information manquante", {
        description: "Veuillez remplir les informations de contact requises."
      });
      return;
    }
    
    const quote = calculateQuote();
    setQuoteResult(quote);
    
    toast.success("Devis généré", {
      description: "Votre devis a été généré avec succès!"
    });
  };
  
  const startDeployment = () => {
    if (!quoteResult) {
      toast.error("Génération requise", {
        description: "Veuillez d'abord générer un devis."
      });
      return;
    }
    
    setDeploymentStatus("running");
    setCurrentStep(1);
    setLogs(["Démarrage du déploiement..."]);
    
    // Simulation des étapes de déploiement
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
    
    toast.success("Formulaire réinitialisé", {
      description: "Vous pouvez maintenant créer un nouveau devis."
    });
  };
  
  const downloadQuote = () => {
    toast.success("Téléchargement du devis", {
      description: "Le devis sera téléchargé en format PDF."
    });
    
    // Implémentation future : générer et télécharger un PDF réel
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
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <DeploymentView 
                  currentStep={currentStep}
                  deploymentStatus={deploymentStatus}
                  packageConfig={packageConfig}
                  setActiveTab={setActiveTab}
                />
              </div>
              
              <div className="space-y-8">
                <DeploymentControls 
                  deploymentStatus={deploymentStatus}
                  startDeployment={startDeployment}
                  resetForm={resetForm}
                  setActiveTab={setActiveTab}
                />
                
                <DeploymentLogs 
                  logs={logs}
                  deploymentStatus={deploymentStatus}
                />
              </div>
            </div>
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
