
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";

export function Footer() {
  const { footerMenuItems } = useMenus();

  return (
    <footer role="contentinfo" className="bg-muted py-12 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* À propos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">À propos</h3>
            <p className="text-muted-foreground mb-4">
              TopCenter est un centre d'appels professionnel proposant des services 
              de qualité pour améliorer votre relation client et développer votre activité.
            </p>
            <img
              src="/lovable-uploads/logo-topcenter.png"
              alt="TopCenter Logo"
              className="h-10 w-auto"
            />
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Nos services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/call-center" className="text-muted-foreground hover:text-foreground transition-colors">
                  Centre d'appels
                </Link>
              </li>
              <li>
                <Link to="/services/online-sales" className="text-muted-foreground hover:text-foreground transition-colors">
                  Vente en ligne
                </Link>
              </li>
              <li>
                <Link to="/services/telephony-system" className="text-muted-foreground hover:text-foreground transition-colors">
                  Systèmes de téléphonie
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              {footerMenuItems.map((item) => (
                <li key={item.title}>
                  <Link to={item.path} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Email: contact@topcenter.com</li>
              <li>Téléphone: +242 06 123 45 67</li>
              <li>Adresse: Brazzaville, République du Congo</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} TopCenter. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
