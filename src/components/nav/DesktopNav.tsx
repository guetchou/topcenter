
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const DesktopNav = () => {
  const location = useLocation();

  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Services</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/services/call-center"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        location.pathname === "/services/call-center" && "bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">Centre d'Appels</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Service client professionnel 24/7
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/services/online-sales"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        location.pathname === "/services/online-sales" && "bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">Vente en Ligne</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Solutions de commerce électronique
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/services/telephony-system"
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        location.pathname === "/services/telephony-system" && "bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">Téléphonie</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Solutions de communication professionnelle
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/blog" 
              className={cn(
                "px-4 py-2 transition-colors",
                location.pathname === "/blog" ? "text-primary" : "hover:text-primary"
              )}
            >
              Blog
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/recruitment" 
              className={cn(
                "px-4 py-2 transition-colors",
                location.pathname === "/recruitment" ? "text-primary" : "hover:text-primary"
              )}
            >
              Recrutement
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link 
              to="/contact" 
              className={cn(
                "px-4 py-2 transition-colors",
                location.pathname === "/contact" ? "text-primary" : "hover:text-primary"
              )}
            >
              Contact
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
