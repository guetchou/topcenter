
import { DynamicNav } from "./nav/DynamicNav";
import { Link } from "react-router-dom";
import { AnimationWrapper, AnimationSequence } from "./AnimationWrapper";
import { GlobalSearch } from "./GlobalSearch";
import { useState, useEffect } from "react";
import { useSearch } from "@/contexts/SearchContext";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";

/**
 * MainNav est un composant wrapper autour de DynamicNav pour garder la compatibilité
 * et permettre une intégration progressive du nouveau design
 */
export function MainNav({ useNewDesign = false }) {
  const { openSearch } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
  
  // Option to toggle between old and new design
  // By default, use the old design for backward compatibility
  
  if (useNewDesign) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container flex h-16 items-center justify-between">
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
            
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6" aria-label="Navigation principale">
              <AnimationSequence 
                type="fade-in-top" 
                delayBetween={50} 
                duration={400}
              >
                <Link 
                  to="/" 
                  className="text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
                >
                  Accueil
                </Link>
                <Link 
                  to="/services" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
                >
                  Services
                </Link>
                <Link 
                  to="/blog" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
                >
                  Blog
                </Link>
                <Link 
                  to="/faq" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
                >
                  FAQ
                </Link>
                <Link 
                  to="/about" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
                >
                  À propos
                </Link>
                <Link 
                  to="/contact" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1"
                >
                  Contact
                </Link>
              </AnimationSequence>
            </nav>
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
            
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-background border-b border-border/40 md:hidden z-50">
                <nav className="container py-4" aria-label="Navigation mobile">
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        to="/" 
                        className="block p-2 hover:bg-accent rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Accueil
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/services" 
                        className="block p-2 hover:bg-accent rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/blog" 
                        className="block p-2 hover:bg-accent rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/faq" 
                        className="block p-2 hover:bg-accent rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/about" 
                        className="block p-2 hover:bg-accent rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        À propos
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/contact" 
                        className="block p-2 hover:bg-accent rounded-md"
                        onClick={() => setIsMenuOpen(false)}
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
                          setIsMenuOpen(false);
                        }}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Rechercher
                      </Button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
            
            <GlobalSearch />
          </div>
        </div>
      </header>
    );
  }
  
  // Default version - old design
  return <DynamicNav />;
}
