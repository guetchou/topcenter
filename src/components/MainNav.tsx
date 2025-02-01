import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Top Center Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Top Center
            </span>
          </Link>

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

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div
          className={cn(
            "md:hidden",
            isOpen ? "block" : "hidden"
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/services/call-center"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === "/services/call-center" ? "text-primary" : "hover:text-primary"
              )}
            >
              Centre d'Appels
            </Link>
            <Link
              to="/services/online-sales"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === "/services/online-sales" ? "text-primary" : "hover:text-primary"
              )}
            >
              Vente en Ligne
            </Link>
            <Link
              to="/services/telephony-system"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === "/services/telephony-system" ? "text-primary" : "hover:text-primary"
              )}
            >
              Téléphonie
            </Link>
            <Link
              to="/blog"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === "/blog" ? "text-primary" : "hover:text-primary"
              )}
            >
              Blog
            </Link>
            <Link
              to="/recruitment"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === "/recruitment" ? "text-primary" : "hover:text-primary"
              )}
            >
              Recrutement
            </Link>
            <Link
              to="/contact"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                location.pathname === "/contact" ? "text-primary" : "hover:text-primary"
              )}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};