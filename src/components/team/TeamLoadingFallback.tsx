
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export const TeamLoadingFallback = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="shadow-lg animate-pulse">
          <CardContent className="p-6">
            <div className="aspect-square mb-4 rounded-full bg-muted"></div>
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-6 bg-muted rounded w-20"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamLoadingFallback;
