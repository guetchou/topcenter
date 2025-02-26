import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, MessageCircle, PhoneCall } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

export const SocialMediaSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
            <MessageCircle className="h-10 w-10 text-green-500" />
            <h3 className="text-xl font-semibold">WhatsApp</h3>
            <p className="text-gray-600 text-center">
              Contactez-nous directement sur WhatsApp pour toute question.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
              asChild
              aria-label="Contactez-nous sur WhatsApp"
            >
              <a
                href="https://wa.me/242055344253"
                target="_blank"
                rel="noopener noreferrer"
              >
                <PhoneCall className="h-5 w-5" />
                Envoyer un message
              </a>
            </Button>
          </div>

          {/* Facebook */}
          <div className="rounded-lg border bg-white text-gray-900 shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Facebook className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-semibold">Facebook</h3>
              </div>
              <p className="text-gray-600 text-center mb-4">
                Suivez nos actualités et interagissez avec nous sur Facebook.
              </p>
              {isClient && (
                <Suspense fallback={<p>Chargement du flux Facebook...</p>}>
                  <iframe
                    title="Facebook Timeline"
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftopcenter.cg&tabs=timeline"
                    width="100%"
                    height="400"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="rounded-md"
                  />
                </Suspense>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div className="rounded-lg border bg-white text-gray-900 shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Linkedin className="h-8 w-8 text-[#0A66C2]" />
                <h3 className="text-xl font-semibold">LinkedIn</h3>
              </div>
              <p className="text-gray-600 text-center mb-4">
                Découvrez nos opportunités et nos activités sur LinkedIn.
              </p>
              {isClient && (
                <Suspense fallback={<p>Chargement du flux LinkedIn...</p>}>
                  <iframe
                    title="LinkedIn Feed"
                    src="https://www.linkedin.com/embed/feed/update/urn:li:organization:top-center-cg"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    allowFullScreen
                    className="rounded-md"
                  />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
