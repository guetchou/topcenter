
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const SocialMediaSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Suivez-nous</h2>
          <p className="text-muted-foreground mt-2">
            Restez connecté avec nous sur les réseaux sociaux
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* WhatsApp */}
          <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 hover:bg-green-500 hover:text-white transition-colors"
              asChild
            >
              <a
                href="https://wa.me/242055344253"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                Contactez-nous sur WhatsApp
              </a>
            </Button>
          </div>

          {/* Facebook */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Facebook className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Facebook</h3>
              </div>
              {isClient && (
                <iframe
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ftopcenter.cg&tabs=timeline"
                  width="100%"
                  height="500"
                  style={{ border: "none", overflow: "hidden" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="rounded-md"
                />
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                <h3 className="font-semibold">LinkedIn</h3>
              </div>
              {isClient && (
                <iframe
                  src="https://www.linkedin.com/embed/feed/update/urn:li:organization:top-center-cg"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-md"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
