
import { Card, CardContent } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MapLocation = () => {
  return (
    <div className="mb-16 space-y-6">
      <h3 className="text-2xl font-bold text-center mb-8">Localisation & Contact</h3>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Carte Google Maps */}
          <div className="w-full h-[400px] rounded-lg shadow-lg overflow-hidden relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3978.7452630686616!2d15.276011375048!3d-4.269680096165313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1stopcenter!5e0!3m2!1sfr!2scg!4v1743583739088!5m2!1sfr!2scg" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="TopCenter Location on Google Maps"
              className="w-full h-full"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <Card className="h-full">
            <CardContent className="p-6 space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                <LazyImage 
                  src="/lovable-uploads/staff-tce.jpg"
                  alt="Nos bureaux"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold">TopCenter Congo</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-primary h-5 w-5" />
                    <p>P7GG+QX, Brazzaville, République du Congo</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="text-primary h-5 w-5" />
                    <p>+242 05 500 0000</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="text-primary h-5 w-5" />
                    <p>contact@topcenter.cg</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => window.open('https://maps.google.com?q=-4.2674,15.2772', '_blank')}
                  >
                    Itinéraire vers nos bureaux
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
