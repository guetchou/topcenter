
import React from "react";

export const StatsRow = () => {
  const stats = [
    { value: "250+", label: "Projets réalisés" },
    { value: "98%", label: "Satisfaction client" },
    { value: "15+", label: "Années d'expérience" }
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="text-center animate-pop-in" 
          style={{ animationDelay: `${0.8 + (index * 0.2)}s` }}
        >
          <div className="text-3xl font-bold">{stat.value}</div>
          <div className="text-sm text-white/80">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
