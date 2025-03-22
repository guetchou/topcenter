
import React from 'react';
import { StatCard } from './StatCard';
import { Grid, Users, PhoneCall, Clock } from 'lucide-react';

export const RealTimeDashboard: React.FC = () => {
  // Mock data for the dashboard
  const todayStats = {
    activeCalls: 14,
    activeCallsChange: '+8% vs. hier',
    activeAgents: 12,
    activeAgentsChange: '+2 vs. hier',
    avgWaitTime: 45,
    avgWaitTimeChange: '-12% vs. hier',
    avgCallDuration: 4.5,
    avgCallDurationChange: '+5% vs. hier'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        icon={<PhoneCall className="h-5 w-5 text-primary" />}
        title="Appels en cours"
        value={todayStats.activeCalls}
        change={todayStats.activeCallsChange}
        isPositive={true}
      />
      
      <StatCard 
        icon={<Users className="h-5 w-5 text-primary" />}
        title="Agents actifs"
        value={todayStats.activeAgents}
        change={todayStats.activeAgentsChange}
        isPositive={true}
      />
      
      <StatCard 
        icon={<Clock className="h-5 w-5 text-primary" />}
        title="Temps d'attente moyen"
        value={todayStats.avgWaitTime}
        unit="sec"
        change={todayStats.avgWaitTimeChange}
        isPositive={true}
      />
      
      <StatCard 
        icon={<Grid className="h-5 w-5 text-primary" />}
        title="Durée moyenne d'appel"
        value={todayStats.avgCallDuration}
        unit="min"
        change={todayStats.avgCallDurationChange}
        isPositive={false}
      />
    </div>
  );
};
