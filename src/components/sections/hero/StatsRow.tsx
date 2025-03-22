
import React from "react";
import { PhoneCall, Award, Users, TrendingUp } from "lucide-react";

export interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatItem = ({ icon, value, label }: StatItemProps) => (
  <div className="flex items-start gap-3 group transition-all duration-300 hover:transform hover:scale-105">
    <div className="w-10 h-10 flex items-center justify-center text-secondary bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  </div>
);

export const StatsRow = () => {
  const stats = [
    { icon: <PhoneCall className="w-5 h-5" />, value: "2500+", label: "Appels par jour" },
    { icon: <Award className="w-5 h-5" />, value: "350+", label: "Clients satisfaits" },
    { icon: <Users className="w-5 h-5" />, value: "120+", label: "Agents formés" },
    { icon: <TrendingUp className="w-5 h-5" />, value: "98%", label: "Taux de satisfaction" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-6 border-t border-white/20">
      {stats.map((stat, index) => (
        <StatItem 
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
};
