
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIntl } from '@/components/IntlProvider';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, X, LogIn, Sun, Moon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useSearch } from '@/contexts/SearchContext';
import { AnimationWrapper } from '@/components/AnimationWrapper';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';

const ResponsiveNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { openSearch } = useSearch();
  const isMobile = useIsMobile();
  const { user, impersonatedUser } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const activeUser = impersonatedUser || user;

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
          {/* Navigation desktop - Repositionnée à droite */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 mr-4" aria-label="Navigation principale">
            <AnimationWrapper type="fade-in" duration={300}>
              <Link 
                to="/" 
                className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <FormattedMessage id="nav.home" defaultMessage="Accueil" />
              </Link>
              <Link 
                to="/services" 
                className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <FormattedMessage id="nav.services" defaultMessage="Services" />
              </Link>
              <Link 
                to="/news" 
                className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <FormattedMessage id="nav.news" defaultMessage="Actualités" />
              </Link>
              <Link 
                to="/blog" 
                className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <FormattedMessage id="nav.blog" defaultMessage="Blog" />
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <FormattedMessage id="nav.about" defaultMessage="À propos" />
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium text-muted-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
              >
                <FormattedMessage id="nav.contact" defaultMessage="Contact" />
              </Link>
            </AnimationWrapper>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Recherche */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Rechercher"
              className="text-foreground/70 hover:text-foreground hover:bg-accent/50"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>

            {/* Sélecteur de langue */}
            <LanguageSwitcher />
            
            {/* Bascule mode sombre/clair */}
            <ThemeToggle />
            
            {/* Bouton de connexion - Plus visible maintenant */}
            {!activeUser && (
              <Button 
                variant="default" 
                size="sm"
                asChild
                className="flex gap-1"
              >
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1" />
                  <FormattedMessage id="nav.login" defaultMessage="Connexion" />
                </Link>
              </Button>
            )}

            {/* Menu mobile burger */}
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    className="text-foreground/70 hover:text-foreground hover:bg-accent/50"
                  >
                    {isMenuOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
                  <nav className="flex flex-col gap-4 mt-8" aria-label="Navigation mobile">
                    <Link 
                      to="/" 
                      className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FormattedMessage id="nav.home" defaultMessage="Accueil" />
                    </Link>
                    <Link 
                      to="/services" 
                      className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FormattedMessage id="nav.services" defaultMessage="Services" />
                    </Link>
                    <Link 
                      to="/news" 
                      className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FormattedMessage id="nav.news" defaultMessage="Actualités" />
                    </Link>
                    <Link 
                      to="/blog" 
                      className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FormattedMessage id="nav.blog" defaultMessage="Blog" />
                    </Link>
                    <Link 
                      to="/about" 
                      className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FormattedMessage id="nav.about" defaultMessage="À propos" />
                    </Link>
                    <Link 
                      to="/contact" 
                      className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FormattedMessage id="nav.contact" defaultMessage="Contact" />
                    </Link>

                    {!activeUser && (
                      <Button
                        variant="default"
                        className="mt-4"
                        asChild
                      >
                        <Link to="/login">
                          <LogIn className="h-4 w-4 mr-2" />
                          <FormattedMessage id="nav.login" defaultMessage="Connexion" />
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        openSearch();
                        setIsMenuOpen(false);
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      <FormattedMessage id="nav.search" defaultMessage="Rechercher" />
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ResponsiveNavigation;
