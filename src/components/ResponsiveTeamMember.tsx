
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/lazy-image';
import { Linkedin, Mail } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TeamMemberProps {
  name: string;
  role: string;
  expertise?: string;
  image: string;
  specialties: string[];
  email?: string;
  linkedin?: string;
  bio?: string;
}

export const ResponsiveTeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  expertise,
  image,
  specialties,
  email,
  linkedin,
  bio
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="overflow-hidden h-full hover-lift cursor-pointer transition-all duration-300">
            <div className="aspect-square w-full overflow-hidden">
              <LazyImage
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={300}
                height={300}
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-muted-foreground text-sm">{role}</p>
              {expertise && <p className="text-sm mt-1">{expertise}</p>}
              
              {/* Sur mobile, on n'affiche que 2 spécialités max */}
              <div className="mt-3 flex flex-wrap gap-2">
                {specialties.slice(0, isMobile ? 2 : 3).map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {specialties.length > (isMobile ? 2 : 3) && (
                  <Badge variant="outline" className="text-xs">
                    +{specialties.length - (isMobile ? 2 : 3)}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{role}</DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="md:col-span-1">
              <LazyImage
                src={image}
                alt={name}
                className="w-full aspect-square object-cover rounded-md"
                width={200}
                height={200}
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              {expertise && (
                <div>
                  <h4 className="text-sm font-medium">Expertise</h4>
                  <p className="text-sm text-muted-foreground">{expertise}</p>
                </div>
              )}
              
              {bio && (
                <div>
                  <h4 className="text-sm font-medium">Biographie</h4>
                  <p className="text-sm text-muted-foreground">{bio}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium">Spécialités</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                {email && (
                  <a 
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    aria-label={`Envoyer un email à ${name}`}
                  >
                    <Mail className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">Email</span>
                  </a>
                )}
                
                {linkedin && (
                  <a 
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    aria-label={`Voir le profil LinkedIn de ${name}`}
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only md:not-sr-only">LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResponsiveTeamMember;
