
import { Link } from "react-router-dom";
import { AnimationSequence } from "../AnimationWrapper";

export function NavLinks() {
  return (
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
  );
}
