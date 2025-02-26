import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#403E43] to-[#1A1F2C] text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* À propos */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">À propos</h4>
            <p className="text-sm text-gray-300">
              Top Center est le leader des centres d'appels omnicanaux au Congo,
              offrant des solutions innovantes pour la gestion de la relation client.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Brazzaville, Congo</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+242 06 449 5353</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@topcenter.cg</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Centre d'Appels</li>
              <li>Support Client</li>
              <li>Solutions IT</li>
              <li>Formation</li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Suivez-nous</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 text-sm text-center border-t border-gray-700">
          <p>&copy; 2024 Top Center. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
