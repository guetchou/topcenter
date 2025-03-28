
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimationWrapper } from "../AnimationWrapper";
import { useSearch } from "@/contexts/SearchContext";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { GlobalSearch } from "../GlobalSearch";
import { NavLinks } from "./NavLinks";
import { MobileNavMenu } from "./MobileNavMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";

export function NewDesignNav() {
  const { openSearch } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, impersonatedUser } = useAuth();
  
  const activeUser = impersonatedUser || user;
  
  // Handle keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      
      // Toggle menu with Alt + M
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        setIsMenuOpen(prev => !prev);
      }
      
      // Close menu with Escape
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, isMenuOpen]);
  
  return (
    <div className="container mx-auto">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <AnimationWrapper type="fade-in" duration={300}>
            <Link 
              to="/" 
              className="mr-6 flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
              aria-label="Retour à l'accueil"
            >
              <img src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" className="h-8 w-auto" />
            </Link>
          </AnimationWrapper>
          
          <NavLinks />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center text-muted-foreground"
            onClick={openSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Rechercher...</span>
            <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          
          <LanguageSwitcher />
          <ThemeToggle />
          
          {!activeUser && (
            <Button 
              variant="default" 
              size="sm"
              asChild
              className="hidden md:flex items-center gap-1"
            >
              <Link to="/login">
                Connexion
              </Link>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </Button>
          
          <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} openSearch={openSearch} />
          
          <GlobalSearch />
        </div>
      </div>
    </div>
  );
}
