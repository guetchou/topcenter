
import React from 'react';

interface CarouselIndicatorsProps {
  totalItems: number;
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const CarouselIndicators = ({ totalItems, currentIndex, onSelect }: CarouselIndicatorsProps) => {
  if (totalItems <= 0) return null;
  
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === currentIndex ? 'bg-primary w-6' : 'bg-primary/30'
          }`}
          aria-label={`Voir le membre d'équipe ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselIndicators;
