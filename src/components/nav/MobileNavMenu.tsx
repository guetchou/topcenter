
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../ui/button";

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  openSearch: () => void;
}

export function MobileNavMenu({ isOpen, onClose, openSearch }: MobileNavMenuProps) {
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-16 left-0 right-0 bg-background border-b border-border/40 md:hidden z-50">
      <nav className="container py-4" aria-label="Navigation mobile">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/" 
              className="block p-2 hover:bg-accent rounded-md"
              onClick={onClose}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link 
              to="/services" 
              className="block p-2 hover:bg-accent rounded-md"
              onClick={onClose}
            >
              Services
            </Link>
          </li>
          <li>
            <Link 
              to="/blog" 
              className="block p-2 hover:bg-accent rounded-md"
              onClick={onClose}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link 
              to="/faq" 
              className="block p-2 hover:bg-accent rounded-md"
              onClick={onClose}
            >
              FAQ
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className="block p-2 hover:bg-accent rounded-md"
              onClick={onClose}
            >
              À propos
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className="block p-2 hover:bg-accent rounded-md"
              onClick={onClose}
            >
              Contact
            </Link>
          </li>
          <li>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                openSearch();
                onClose();
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
