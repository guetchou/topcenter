
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, MessageCircle, PhoneCall } from "lucide-react";
import { useEffect, useState, Suspense, memo } from "react";

// Composant de secours pour les iframes optimisé
const IframeFallback = memo(() => (
  <div className="flex items-center justify-center w-full h-[400px] bg-gray-100 rounded-md animate-pulse">
    <div className="text-gray-500">Chargement...</div>
  </div>
));
IframeFallback.displayName = 'IframeFallback';

// Composant d'iframe optimisé avec chargement différé
const LazyIframe = memo(({ src, title, className = "" }: { src: string; title: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <>
      {!isLoaded && <IframeFallback />}
      <iframe
        title={title}
        src={src}
        width="100%"
        height="400"
        style={{ 
          border: "none", 
          overflow: "hidden", 
          display: isLoaded ? 'block' : 'none' 
        }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        className={className}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  );
});
LazyIframe.displayName = 'LazyIframe';

// Carte de media social optimisée
const SocialCard = memo(({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  children: React.ReactNode 
}) => {
  return (
    <div className="rounded-lg border bg-white text-gray-900 shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Icon className="h-8 w-8 text-blue-600" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600 text-center mb-4">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
});
SocialCard.displayName = 'SocialCard';

export const SocialMediaSection = () => {
  const [isClient, setIsClient] = useState(false);
  const [iframesEnabled, setIframesEnabled] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Retarder le chargement des iframes pour améliorer les performances
    const timer = setTimeout(() => {
      setIframesEnabled(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Suivez-nous</h2>
          <p className="text-gray-600 mt-2 text-lg">
            Restez connecté avec nous sur les réseaux sociaux
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WhatsApp */}
          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border bg-white text-gray-900 shadow-lg">
            <div>
              <MessageCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold">WhatsApp</h3>
            <p className="text-gray-600 text-center">
              Contactez-nous directement sur WhatsApp pour toute question.
            </p>
            <div>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                asChild
                aria-label="Contactez-nous sur WhatsApp"
              >
                <a href="https://wa.me/242055344253" target="_blank" rel="noopener noreferrer">
                  <PhoneCall className="h-5 w-5" />
                  Envoyer un message
                </a>
              </Button>
            </div>
          </div>

          {/* Facebook */}
          <SocialCard 
            icon={Facebook} 
            title="Facebook" 
            description="Suivez nos actualités et interagissez avec nous sur Facebook."
          >
            {isClient && iframesEnabled && (
              <Suspense fallback={<IframeFallback />}>
                <LazyIframe
                  title="Facebook Timeline"
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftopcenter.cg&tabs=timeline"
                  className="rounded-md"
                />
              </Suspense>
            )}
            {(!isClient || !iframesEnabled) && <IframeFallback />}
          </SocialCard>

          {/* LinkedIn */}
          <SocialCard 
            icon={Linkedin} 
            title="LinkedIn" 
            description="Découvrez nos opportunités et nos activités sur LinkedIn."
          >
            {isClient && iframesEnabled && (
              <Suspense fallback={<IframeFallback />}>
                <LazyIframe
                  title="LinkedIn Feed"
                  src="https://www.linkedin.com/embed/feed/update/urn:li:organization:top-center-cg"
                  className="rounded-md"
                />
              </Suspense>
            )}
            {(!isClient || !iframesEnabled) && <IframeFallback />}
          </SocialCard>
        </div>
      </div>
    </section>
  );
};
