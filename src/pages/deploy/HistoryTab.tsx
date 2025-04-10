
import React from "react";
import { DeploymentHistory } from "@/components/deploy/DeploymentHistory";

const HistoryTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <DeploymentHistory />
    </div>
  );
};

export default HistoryTab;
