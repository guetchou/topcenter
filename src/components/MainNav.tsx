
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMenus } from '@/hooks/useMenus';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { LogIn, Menu, Search, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './ui/navigation-menu';

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { primaryMenuItems, isLoading } = useMenus();
  const location = useLocation();
  const { user } = useAuth();

  // Fermer le menu mobile lors du changement de route
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
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur shadow-sm' 
        : 'bg-background/50 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/logo-topcenter.png"
              alt="TopCenter Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {primaryMenuItems.map((item) => 
                item.children && item.children.length > 0 ? (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            to={child.path}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{child.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {child.description || "Découvrez nos services en détail"}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.title}>
                    <Link to={item.path} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-3 py-2">
                      {item.title}
                    </Link>
                  </NavigationMenuItem>
                )
              )}
              <NavigationMenuItem>
                <Link to="/deploy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-3 py-2">
                  Déploiement
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/admin/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-3 py-2">
                  Administration
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {!user && (
            <Button variant="default" size="sm" asChild className="hidden md:flex">
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-1.5" />
                <span>Connexion</span>
              </Link>
            </Button>
          )}
          
          {/* Bouton menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              {primaryMenuItems.map((item) => (
                <div key={item.title}>
                  <Link 
                    to={item.path}
                    className="text-lg font-medium py-2 block hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                  
                  {item.children && item.children.length > 0 && (
                    <div className="pl-4 border-l border-border mt-2 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          to={child.path}
                          className="text-sm text-muted-foreground block py-1 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link 
                to="/deploy"
                className="text-lg font-medium py-2 block hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Déploiement
              </Link>
              <Link 
                to="/admin/dashboard"
                className="text-lg font-medium py-2 block hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Administration
              </Link>
              
              {!user && (
                <Button variant="default" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1.5" />
                    <span>Connexion</span>
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
