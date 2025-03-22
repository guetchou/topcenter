
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FormattedMessage } from "react-intl";
import { AnimationSequence } from "../AnimationWrapper";

// Modern interface for navigation links
interface NavItem {
  id: string;
  defaultMessage: string;
  href: string;
}

export function NavLinks() {
  const location = useLocation();
  
  // Navigation links data
  const navItems: NavItem[] = [
    { id: "nav.home", defaultMessage: "Accueil", href: "/" },
    { id: "nav.services", defaultMessage: "Services", href: "/services" },
    { id: "nav.news", defaultMessage: "Actualités", href: "/news" },
    { id: "nav.blog", defaultMessage: "Blog", href: "/blog" },
    { id: "nav.about", defaultMessage: "À propos", href: "/about" },
    { id: "nav.contact", defaultMessage: "Contact", href: "/contact" }
  ];
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      <AnimationSequence
        type="slide-in-right"
        delayBetween={70}
        duration={400}
      >
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className={cn(
              "nav-item px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent/50",
              location.pathname === item.href
                ? "text-foreground bg-accent/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FormattedMessage
              id={item.id}
              defaultMessage={item.defaultMessage}
            />
          </Link>
        ))}
      </AnimationSequence>
    </nav>
  );
}
