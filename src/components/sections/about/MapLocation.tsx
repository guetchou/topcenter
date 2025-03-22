
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';

export const MapLocation = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialisation de la carte
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1iYW5ndWUtZ2VuIiwiYSI6ImNtOGFzdHRhNTBzeTcyaXFhajhuZjUyb3YifQ.7Q7th2FU4FmPRfJCzPnuMw';
    
    if (map.current) return; // Éviter la réinitialisation

    const brazzavilleCoordinates = [15.2772, -4.2674]; // Coordonnées précises de Brazzaville

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Style plus détaillé
      center: brazzavilleCoordinates,
      zoom: 14,
      pitch: 40, // Angle d'inclinaison pour un rendu 3D
      bearing: 20, // Légère rotation
      attributionControl: false // Masquer les attributions par défaut
    });

    // Ajouter un marker personnalisé
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `
      <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
        <div class="w-4 h-4 bg-white rounded-full"></div>
      </div>
    `;

    new mapboxgl.Marker(markerElement)
      .setLngLat(brazzavilleCoordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3 class="text-base font-bold">TopCenter</h3><p>Centre d\'Appels Professionnels</p>')
      )
      .addTo(map.current);

    // Ajouter des contrôles de navigation améliorés
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'top-right');
    
    // Activer le terrain 3D si disponible
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2
      });
      
      setLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="mb-16 space-y-6">
      <h3 className="text-2xl font-bold text-center mb-8">Localisation & Contact</h3>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {/* Carte interactive */}
          <div 
            className="w-full h-[400px] rounded-lg shadow-lg overflow-hidden relative"
          >
            <div ref={mapContainer} className="w-full h-full" />
            
            {/* Overlay de chargement */}
            {!loaded && (
              <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
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
      
      {/* Fallback Google Maps pour les navigateurs plus anciens */}
      <div className="w-full h-[400px] rounded-lg shadow-lg overflow-hidden mt-8 md:hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3978.745263068652!2d15.276011375048!3d-4.269680096165313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1stopcenter%20!5e0!3m2!1sfr!2scg!4v1740498139400!5m2!1sfr!2scg" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }}
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
