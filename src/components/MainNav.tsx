
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { MobileMenu } from "./nav/MobileMenu";
import { DesktopNav } from "./nav/DesktopNav";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Menu, Bell } from "lucide-react";
import { Logo } from "./Logo";
import { NotificationButton } from "./nav/NotificationButton";

export function MainNav() {
  const { primaryMenuItems } = useMenus();
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Logo className="mr-6" size="md" />
        </div>

        <DesktopNav items={primaryMenuItems} />

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <NotificationButton 
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
            />
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="default" asChild className="px-4 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="default" asChild className="px-4 bg-primary text-primary-foreground hover:bg-primary/90">
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
