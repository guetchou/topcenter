import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, MessageCircle, PhoneCall } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";

export const SocialMediaSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animation d'apparition avec fade-in
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Animation des icônes (rotation légère au survol)
  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 10, transition: { type: "spring", stiffness: 200, damping: 10 } },
  };

  // Animation du bouton (léger tremblement au clic)
  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95, x: [0, -2, 2, -2, 2, 0], transition: { duration: 0.2 } },
  };

  return (
    <motion.section 
      className="py-16 bg-gray-100"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="container mx-auto px-6">
        <motion.div className="text-center mb-12" variants={fadeIn}>
          <h2 className="text-4xl font-bold text-gray-900">Suivez-nous</h2>
          <p className="text-gray-600 mt-2 text-lg">
            Restez connecté avec nous sur les réseaux sociaux
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WhatsApp */}
          <motion.div
            className="flex flex-col items-center space-y-4 p-6 rounded-lg border bg-white text-gray-900 shadow-lg"
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div variants={iconVariants} initial="initial" whileHover="hover">
              <MessageCircle className="h-10 w-10 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-semibold">WhatsApp</h3>
            <p className="text-gray-600 text-center">
              Contactez-nous directement sur WhatsApp pour toute question.
            </p>
            <motion.div variants={buttonVariants} whileTap="tap">
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
            </motion.div>
          </motion.div>

          {/* Facebook */}
          <motion.div
            className="rounded-lg border bg-white text-gray-900 shadow-lg overflow-hidden"
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-6">
              <motion.div className="flex items-center justify-center gap-2 mb-4" variants={iconVariants} whileHover="hover">
                <Facebook className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-semibold">Facebook</h3>
              </motion.div>
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
          </motion.div>

          {/* LinkedIn */}
          <motion.div
            className="rounded-lg border bg-white text-gray-900 shadow-lg overflow-hidden"
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-6">
              <motion.div className="flex items-center justify-center gap-2 mb-4" variants={iconVariants} whileHover="hover">
                <Linkedin className="h-8 w-8 text-[#0A66C2]" />
                <h3 className="text-xl font-semibold">LinkedIn</h3>
              </motion.div>
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
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
