
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const TeamViewAllLink = () => {
  return (
    <div className="mt-8 text-center">
      <Button asChild variant="outline" className="group">
        <Link to="/equipe">
          Découvrir toute l'équipe
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
};

export default TeamViewAllLink;
