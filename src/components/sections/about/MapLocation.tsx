
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

export const MapLocation = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialisation de la carte
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW1iYW5ndWUtZ2VuIiwiYSI6ImNtOGFzdHRhNTBzeTcyaXFhajhuZjUyb3YifQ.7Q7th2FU4FmPRfJCzPnuMw';
    
    if (map.current) return; // Éviter la réinitialisation

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [15.2837, -4.2634], // Coordonnées de Brazzaville
      zoom: 13
    });

    // Ajouter un marqueur
    new mapboxgl.Marker()
      .setLngLat([15.2837, -4.2634])
      .addTo(map.current);

    // Ajouter des contrôles de navigation
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold mb-4">Localisation & Contact</h3>
      <div className="flex items-center justify-center gap-2 text-lg mb-6">
        <MapPin className="text-primary" />
        <p>P7GG+QX, Brazzaville, République du Congo</p>
      </div>
      
      {/* Conteneur de la carte avec une hauteur fixe pour s'assurer qu'elle s'affiche correctement */}
      <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden mb-8" ref={mapContainer}></div>
      
      {/* Carte Google Maps comme solution de secours */}
      <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden mt-8">
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
