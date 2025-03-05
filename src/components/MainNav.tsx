
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { MobileMenu } from "./nav/MobileMenu";
import { DesktopNav } from "./nav/DesktopNav";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";

export function MainNav() {
  const { primaryMenuItems } = useMenus();
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">TopCenter</span>
          </Link>
        </div>

        <DesktopNav items={primaryMenuItems} />

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="link" asChild className="px-2">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="link" asChild className="px-2">
                <Link to="/login">Se connecter</Link>
              </Button>
            )}
          </nav>
          <Button
            variant="ghost"
            className="md:hidden"
            size="icon"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>
      <MobileMenu open={open} setOpen={setOpen} items={primaryMenuItems} />
    </header>
  );
}
