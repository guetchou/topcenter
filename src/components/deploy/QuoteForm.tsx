
import React from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Building, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessInfo {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  employees: number[];
  budget: string;
}

interface PackageConfig {
  agentCount: number[];
  servicePeriod: string;
  callVolume: string;
  includeSupport: boolean;
  includeCRM: boolean;
  multilingual: boolean;
}

interface QuoteFormProps {
  businessInfo: BusinessInfo;
  setBusinessInfo: React.Dispatch<React.SetStateAction<BusinessInfo>>;
  packageConfig: PackageConfig;
  setPackageConfig: React.Dispatch<React.SetStateAction<PackageConfig>>;
  generateQuote: () => void;
  resetForm: () => void;
  handleBusinessInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (name: string, value: number[]) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  businessInfo,
  setBusinessInfo,
  packageConfig,
  setPackageConfig,
  generateQuote,
  resetForm,
  handleBusinessInfoChange,
  handleSliderChange,
  handleSelectChange,
  handleSwitchChange
}) => {
  return (
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
          
          <div className="h-px bg-border my-4" />
          
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
  );
};
