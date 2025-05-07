
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Globe } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  const { footerMenuItems } = useMenus();
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Information */}
          <div className="space-y-6">
            <div>
              <Logo className="h-10 mb-4" size="lg" />
              <p className="text-slate-400 text-sm leading-relaxed">
                TopCenter est un centre d'appels professionnel proposant des services 
                de qualité pour améliorer votre relation client et développer votre activité.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Website">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-medium text-lg">Liens Rapides</h3>
            <ul className="space-y-3">
              {footerMenuItems.map((item) => (
                <li key={item.title}>
                  <Link to={item.path} className="text-slate-400 hover:text-white transition-colors flex items-center group">
                    <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-white font-medium text-lg">Nos Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services/call-center" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Centre d'appels
                </Link>
              </li>
              <li>
                <Link to="/services/online-sales" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Vente en ligne
                </Link>
              </li>
              <li>
                <Link to="/services/telephony-system" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Systèmes de téléphonie
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white transition-colors flex items-center group">
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  Tous nos services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-white font-medium text-lg">Contact</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>contact@topcenter.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>+242 06 123 45 67</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>P7GG+QX, Brazzaville, République du Congo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="border-t border-slate-800">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              &copy; {currentYear} TopCenter. Tous droits réservés.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-slate-500 hover:text-white text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-slate-500 hover:text-white text-sm transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
