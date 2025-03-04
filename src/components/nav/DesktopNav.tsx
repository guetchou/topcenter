
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    <nav className="hidden md:flex gap-6 ml-6">
      {items.map((item) => {
        // Déterminer si l'élément a des enfants
        const hasChildren = item.children && item.children.length > 0;

        // Si pas d'enfants, afficher un lien simple
        if (!hasChildren) {
          return (
            <Link
              key={item.title}
              to={item.path}
              className="text-sm font-medium transition-colors hover:text-primary"
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
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              {item.title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:rotate-180"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Link>
            
            {/* Menu déroulant */}
            <div className="absolute left-0 z-10 mt-2 w-48 rounded-md bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="py-1 rounded-md bg-background border border-border">
                {item.children?.map((child) => (
                  <Link
                    key={child.title}
                    to={child.path}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
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
