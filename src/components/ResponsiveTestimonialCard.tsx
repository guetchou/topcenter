
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TestimonialCardProps {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

export const ResponsiveTestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  content,
  rating,
  avatarUrl,
}) => {
  const isMobile = useIsMobile();
  const maxContentLength = isMobile ? 150 : 250;
  
  // Tronquer le contenu pour les appareils mobiles
  const truncatedContent = content.length > maxContentLength 
    ? `${content.substring(0, maxContentLength)}...` 
    : content;

  return (
    <Card className="h-full flex flex-col hover-lift transition-all duration-300">
      <CardContent className="flex flex-col pt-6 px-5 flex-grow">
        <div className="flex items-start gap-4 mb-4">
          {avatarUrl && (
            <LazyImage
              src={avatarUrl}
              alt={name}
              className="rounded-full h-16 w-16 object-cover flex-shrink-0"
              width={64}
              height={64}
              loading="lazy"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {role}{company ? `, ${company}` : ''}
            </p>
            <div className="flex mt-1" aria-label={`Note: ${rating} sur 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed flex-grow">
          {truncatedContent}
        </p>
      </CardContent>
      
      <CardFooter className="pt-0 px-5 pb-5 flex flex-col items-start">
        <div className="mt-2 text-xs text-muted-foreground">
          {company && <span className="block md:inline">Client {company}</span>}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResponsiveTestimonialCard;
