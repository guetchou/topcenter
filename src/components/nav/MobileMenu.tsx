
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  const location = useLocation();

  return (
    <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link
          to="/services/call-center"
          className={cn(
            "block px-3 py-2 rounded-md text-base font-medium transition-colors",
            location.pathname === "/services/call-center" ? "text-primary" : "hover:text-primary"
          )}
        >
          Centre d'Appels
        </Link>
        <Link
          to="/services/online-sales"
          className={cn(
            "block px-3 py-2 rounded-md text-base font-medium transition-colors",
            location.pathname === "/services/online-sales" ? "text-primary" : "hover:text-primary"
          )}
        >
          Vente en Ligne
        </Link>
        <Link
          to="/services/telephony-system"
          className={cn(
            "block px-3 py-2 rounded-md text-base font-medium transition-colors",
            location.pathname === "/services/telephony-system" ? "text-primary" : "hover:text-primary"
          )}
        >
          Téléphonie
        </Link>
        <Link
          to="/blog"
          className={cn(
            "block px-3 py-2 rounded-md text-base font-medium transition-colors",
            location.pathname === "/blog" ? "text-primary" : "hover:text-primary"
          )}
        >
          Blog
        </Link>
        <Link
          to="/recruitment"
          className={cn(
            "block px-3 py-2 rounded-md text-base font-medium transition-colors",
            location.pathname === "/recruitment" ? "text-primary" : "hover:text-primary"
          )}
        >
          Recrutement
        </Link>
        <Link
          to="/contact"
          className={cn(
            "block px-3 py-2 rounded-md text-base font-medium transition-colors",
            location.pathname === "/contact" ? "text-primary" : "hover:text-primary"
          )}
        >
          Contact
        </Link>
      </div>
    </div>
  );
};
