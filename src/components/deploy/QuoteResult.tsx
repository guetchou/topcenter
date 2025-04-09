
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, ArrowRight, DownloadCloud, CheckCircle2, AlertTriangle } from "lucide-react";

interface QuoteResultProps {
  quoteResult: {
    basePrice: number;
    setup: number;
    additionalFeatures: number;
    total: number;
  };
  packageConfig: {
    agentCount: number[];
    servicePeriod: string;
    callVolume: string;
    includeSupport: boolean;
    includeCRM: boolean;
    multilingual: boolean;
  };
  downloadQuote: () => void;
  setActiveTab: (tab: string) => void;
}

export const QuoteResult: React.FC<QuoteResultProps> = ({
  quoteResult,
  packageConfig,
  downloadQuote,
  setActiveTab
}) => {
  if (!quoteResult) return null;

  return (
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
        <Button className="gap-2" onClick={() => setActiveTab("deployment")}>
          Lancer le déploiement
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
