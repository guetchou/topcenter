
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { NavbarContent } from './navigation/NavbarContent';
import { MobileMenu } from './navigation/MobileMenu';
import { NavigationActions } from './navigation/NavigationActions';

const ResponsiveNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Fermer le menu lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Détecter le scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur shadow-sm' 
          : 'bg-background/50 backdrop-blur-sm'
      }`}
      role="banner"
      aria-label="En-tête du site"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo - Maintenu à gauche */}
        <Link 
          to="/" 
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-label="Retour à l'accueil"
        >
          <img src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center justify-end flex-1">
          {/* Navigation desktop - Positionnée à droite */}
          <NavbarContent />

          {/* Actions */}
          <NavigationActions />

          {/* Menu mobile burger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="text-foreground/70 hover:text-foreground hover:bg-accent/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </header>
  );
};

export default ResponsiveNavigation;
