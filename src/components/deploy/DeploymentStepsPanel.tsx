
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  logs: any[];
  startTime?: Date;
  endTime?: Date;
}

interface DeploymentStepsPanelProps {
  steps: Step[];
}

export const DeploymentStepsPanel: React.FC<DeploymentStepsPanelProps> = ({ steps }) => {
  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'in-progress':
        return (
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        );
      case 'pending':
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStepClass = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'failed':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'in-progress':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'pending':
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const getDuration = (startTime?: Date, endTime?: Date) => {
    if (!startTime) return null;
    
    const end = endTime || new Date();
    const durationMs = end.getTime() - startTime.getTime();
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    }
    
    return `${Math.round(durationMs / 1000)}s`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Étapes du déploiement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-4 border-l-4 rounded ${getStepClass(step.status)}`}
            >
              <div className="flex items-start">
                <div className="mr-3">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{step.title}</h3>
                    {step.startTime && (
                      <span className="text-sm text-gray-500">
                        {getDuration(step.startTime, step.endTime)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                  
                  {step.logs.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded max-h-24 overflow-y-auto">
                        {step.logs.map((log, i) => (
                          <div key={i} className="whitespace-pre-wrap">
                            {log.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center my-2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </div>
          ))}
          
          {steps.length === 0 && (
            <div className="text-center p-6 text-gray-500">
              Aucune étape de déploiement n'a été démarrée.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
