import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export const ARServicePreview = () => {
  // Component is disabled, but we'll keep the structure
  const [isActive, setIsActive] = useState(false);

  // Return an empty div instead of the actual component
  return <div className="hidden"></div>;
};
