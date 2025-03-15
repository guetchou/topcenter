
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const { footerMenuItems } = useMenus();

  return (
    <footer role="contentinfo" className="bg-gradient-to-b from-orange-50 to-orange-100 border-t border-orange-200 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* À propos */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-orange-700">À propos</h3>
            <p className="text-muted-foreground mb-4">
              TopCenter est un centre d'appels professionnel proposant des services 
              de qualité pour améliorer votre relation client et développer votre activité.
            </p>
            <Logo className="h-10" size="lg" />
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-orange-700">Nos services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/call-center" className="text-muted-foreground hover:text-orange-600 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  Centre d'appels
                </Link>
              </li>
              <li>
                <Link to="/services/online-sales" className="text-muted-foreground hover:text-orange-600 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  Vente en ligne
                </Link>
              </li>
              <li>
                <Link to="/services/telephony-system" className="text-muted-foreground hover:text-orange-600 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  Systèmes de téléphonie
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-orange-700">Liens utiles</h3>
            <ul className="space-y-2">
              {footerMenuItems.map((item) => (
                <li key={item.title}>
                  <Link to={item.path} className="text-muted-foreground hover:text-orange-600 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-orange-700">Contact</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                Email: contact@topcenter.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                Téléphone: +242 06 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Adresse: Brazzaville, République du Congo
              </li>
            </ul>
            <div className="mt-4 flex space-x-3">
              <a href="#" className="text-orange-600 hover:text-orange-700" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-orange-600 hover:text-orange-700" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-orange-600 hover:text-orange-700" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-orange-600 hover:text-orange-700" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-orange-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} TopCenter. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-orange-600 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-orange-600 transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
