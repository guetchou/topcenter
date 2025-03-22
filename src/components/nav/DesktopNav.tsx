
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface NavItem {
  title: string;
  path: string;
  children?: {
    title: string;
    path: string;
  }[];
}

interface DesktopNavProps {
  items: NavItem[];
}

export function DesktopNav({ items }: DesktopNavProps) {
  return (
    <nav className="flex items-center space-x-4">
      {items.map((item) => {
        // Déterminer si l'élément a des enfants
        const hasChildren = item.children && item.children.length > 0;

        // Si pas d'enfants, afficher un lien simple
        if (!hasChildren) {
          return (
            <Link
              key={item.title}
              to={item.path}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground px-2 py-1 rounded-md hover:bg-accent/40"
            >
              {item.title}
            </Link>
          );
        }

        // Si l'élément a des enfants, afficher un menu déroulant
        return (
          <div key={item.title} className="relative group">
            <Link
              to={item.path}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-accent/40"
            >
              {item.title}
              <ChevronDown 
                size={14} 
                className="transition-transform duration-200 group-hover:rotate-180" 
              />
            </Link>
            
            {/* Menu déroulant */}
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-md bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 backdrop-blur-sm border border-border/10">
              <div className="py-1 rounded-md bg-background/90">
                {item.children?.map((child) => (
                  <Link
                    key={child.title}
                    to={child.path}
                    className="block px-4 py-2 text-sm text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
