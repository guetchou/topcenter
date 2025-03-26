
import React from 'react';

interface TeamSectionHeaderProps {
  title: string;
  subtitle: string;
}

export const TeamSectionHeader = ({ title, subtitle }: TeamSectionHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default TeamSectionHeader;
