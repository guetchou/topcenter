
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { serverIsAvailable, testServerAvailability } from '@/services/api/serverStatus';
import { Server, WifiOff, Wifi, AlarmClock, Activity } from "lucide-react";
import axios from 'axios';

export const ServerStatusMonitor: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isChecking, setIsChecking] = useState(false);
  const [uptime, setUptime] = useState<string>('');

  const checkServerStatus = async () => {
    try {
      setIsChecking(true);
      // Simuler une vérification
      await new Promise(r => setTimeout(r, 800));
      const available = serverIsAvailable();
      setIsAvailable(available);
      setLastChecked(new Date());
      
      // Générer un temps d'activité aléatoire pour la démo
      const days = Math.floor(Math.random() * 30) + 1;
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      setUptime(`${days}j ${hours}h ${minutes}m`);
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    
    // Vérifier le statut toutes les 30 secondes
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer
              ${isAvailable ? 'bg-green-50 text-green-700' : isAvailable === false ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'}
              border transition-colors duration-200
              ${isAvailable ? 'border-green-200' : isAvailable === false ? 'border-red-200' : 'border-gray-200'}
            `}
            onClick={checkServerStatus}
          >
            <Server className="h-4 w-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Serveur</span>
              {isChecking ? (
                <Activity className="h-3 w-3 animate-pulse" />
              ) : isAvailable ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="p-3 max-w-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Statut:</span>
              <Badge 
                variant={isAvailable ? "success" : "destructive"} 
                className="ml-2"
              >
                {isAvailable ? 'En ligne' : 'Hors ligne'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Dernier contrôle:</span>
              <span className="text-sm font-medium flex items-center">
                <AlarmClock className="h-3 w-3 mr-1" />
                {formatTime(lastChecked)}
              </span>
            </div>
            {isAvailable && uptime && (
              <div className="flex justify-between">
                <span className="text-sm">Temps d'activité:</span>
                <span className="text-sm font-medium">{uptime}</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
