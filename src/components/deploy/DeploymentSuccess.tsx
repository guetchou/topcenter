
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Upload } from "lucide-react";
import { DeploymentSummary } from "./DeploymentSummary";

interface DeploymentSuccessProps {
  packageConfig: {
    agentCount: number[];
  };
  resetForm: () => void;
}

export const DeploymentSuccess: React.FC<DeploymentSuccessProps> = ({
  packageConfig,
  resetForm
}) => {
  return (
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
  );
};
