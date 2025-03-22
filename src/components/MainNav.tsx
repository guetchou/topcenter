
import { DynamicNav } from "./nav/DynamicNav";
import { Link } from "react-router-dom";
import { AnimationWrapper, AnimationSequence } from "./AnimationWrapper";
import { GlobalSearch } from "./GlobalSearch";

/**
 * MainNav est un composant wrapper autour de DynamicNav pour garder la compatibilité
 * et permettre une intégration progressive du nouveau design
 */
export function MainNav({ useNewDesign = false }) {
  // Option pour basculer entre l'ancien et le nouveau design
  // Par défaut, utilise l'ancien design pour maintenir la compatibilité
  
  if (useNewDesign) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <AnimationWrapper type="fade-in" duration={300}>
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <img src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" className="h-8 w-auto" />
              </Link>
            </AnimationWrapper>
            
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <AnimationSequence 
                type="fade-in-top" 
                delayBetween={50} 
                duration={400}
              >
                <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                  Accueil
                </Link>
                <Link to="/services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Services
                </Link>
                <Link to="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Blog
                </Link>
                <Link to="/faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  FAQ
                </Link>
                <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  À propos
                </Link>
                <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  Contact
                </Link>
              </AnimationSequence>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            <GlobalSearch />
          </div>
        </div>
      </header>
    );
  }
  
  // Version par défaut - ancien design
  return <DynamicNav />;
}
