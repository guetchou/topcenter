
import React from "react";
import { PhoneCall, Award } from "lucide-react";

export const StatsRow = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-white/20">
      <div className="flex items-start gap-3">
        <PhoneCall className="w-8 h-8 text-secondary p-1.5 bg-white/10 rounded-lg" />
        <div>
          <div className="text-2xl font-bold">2500+</div>
          <div className="text-sm text-white/70">Appels par jour</div>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Award className="w-8 h-8 text-secondary p-1.5 bg-white/10 rounded-lg" />
        <div>
          <div className="text-2xl font-bold">350+</div>
          <div className="text-sm text-white/70">Clients satisfaits</div>
        </div>
      </div>
    </div>
  );
};
