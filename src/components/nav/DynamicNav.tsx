
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchDialog } from "./SearchDialog";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";
import { LogIn, Menu, Search } from "lucide-react";
import { useMenus, MenuItem } from "@/hooks/useMenus";
import { UserProfileMenu } from "./UserProfileMenu";
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";
import { DesignToggle } from "../DesignToggle";
import { useApiError } from "@/hooks/useApiError";
import { ApiErrorBoundary } from "@/components/ApiErrorBoundary";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { UserWithProfile } from "@/types/auth";

export function DynamicNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { primaryMenuItems, isLoading: menusLoading, error: menusError, refetch: refetchMenus } = useMenus();
  const location = useLocation();
  const { user, impersonatedUser, logout, stopImpersonation } = useAuth();
  const { isServerUnavailable } = useApiError();
  
  // Modification ici : on s'assure que activeUser a le bon typage
  const activeUser = impersonatedUser || user;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (impersonatedUser) {
      stopImpersonation();
    } else {
      await logout();
    }
  };

  // Fallback menu items quand l'API est inaccessible - adapté à l'interface MenuItem
  const fallbackMenuItems: MenuItem[] = [
    { title: "Accueil", path: "/" },
    { title: "À propos", path: "/about" },
    { title: "Services", path: "/services" },
    { title: "Actualités", path: "/news" },
    { title: "FAQ", path: "/faq" },
    { title: "Contact", path: "/contact" },
  ];

  const menuItemsToUse = isServerUnavailable || menusError ? fallbackMenuItems : primaryMenuItems;

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur shadow-sm' 
        : 'bg-background/50 backdrop-blur-sm'
    }`}>
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo on the left */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/logo-topcenter.png"
              alt="TopCenter Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation and actions on the right */}
        <div className="flex items-center space-x-1">
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <ApiErrorBoundary 
              error={menusError} 
              isLoading={menusLoading}
              retryFunction={refetchMenus}
              fallback={<DesktopNav items={fallbackMenuItems} />}
            >
              <DesktopNav items={menuItemsToUse} />
            </ApiErrorBoundary>
          </div>

          {/* Actions: Search, Language, Theme, and Login */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Rechercher"
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground/70 hover:text-foreground hover:bg-accent/50 w-8 h-8"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Rechercher</span>
            </Button>
            
            <SearchDialog
              open={isSearchOpen}
              onOpenChange={setIsSearchOpen}
            />

            <LanguageSwitcher />

            <ThemeToggle />
            
            {/* Only show design toggle in development mode */}
            {process.env.NODE_ENV !== 'production' && <DesignToggle />}

            {!activeUser && (
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="ml-2"
              >
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  <span>Connexion</span>
                </Link>
              </Button>
            )}

            {activeUser && (
              <UserProfileMenu 
                activeUser={activeUser}
                handleLogout={handleLogout}
              />
            )}

            <Button
              variant="ghost"
              size="icon"
              aria-label="Menu"
              className="md:hidden text-foreground/70 hover:text-foreground hover:bg-accent/50 ml-1"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu
        open={isMenuOpen}
        setOpen={setIsMenuOpen}
        items={menuItemsToUse}
        isAuthenticated={!!activeUser}
        onLogout={handleLogout}
      />
    </header>
  );
}

export default DynamicNav;
