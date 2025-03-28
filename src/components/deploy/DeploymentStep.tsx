
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export type DeploymentStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

interface DeploymentStepProps {
  title: string;
  description: string;
  status: DeploymentStatus;
  time?: string;
  details?: string;
  isCurrentStep?: boolean;
}

export const DeploymentStep: React.FC<DeploymentStepProps> = ({
  title,
  description,
  status,
  time,
  details,
  isCurrentStep = false
}) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: DeploymentStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'in-progress': return 'bg-blue-500 animate-pulse';
      default: return 'bg-gray-300 dark:bg-gray-700';
    }
  };

  const getStatusBorder = (status: DeploymentStatus) => {
    switch (status) {
      case 'completed': return 'border-green-500';
      case 'failed': return 'border-red-500';
      case 'in-progress': return 'border-blue-500';
      default: return 'border-gray-300 dark:border-gray-700';
    }
  };

  const getStatusText = (status: DeploymentStatus) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'failed': return 'Échoué';
      case 'in-progress': return 'En cours';
      default: return 'En attente';
    }
  };

  return (
    <div className={`rounded-lg border ${isCurrentStep ? 'border-blue-500 shadow-blue-100 shadow-md' : 'border-gray-200 dark:border-gray-800'} overflow-hidden`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer bg-white dark:bg-gray-950"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {time && <span className="text-sm text-gray-500">{time}</span>}
          <span className={`text-sm ${
            status === 'completed' ? 'text-green-500' : 
            status === 'failed' ? 'text-red-500' : 
            status === 'in-progress' ? 'text-blue-500' : 
            'text-gray-500'
          }`}>
            {getStatusText(status)}
          </span>
          {details && (
            expanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {expanded && details && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700 dark:text-gray-300">
            {details}
          </pre>
        </div>
      )}
    </div>
  );
};
