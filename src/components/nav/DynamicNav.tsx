
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { SearchDialog } from "./SearchDialog";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { Menu, Search } from "lucide-react";
import { useMenus } from "@/hooks/useMenus";
import { NotificationButton } from "./NotificationButton";
import { UserProfileMenu } from "./UserProfileMenu";

export function DynamicNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { primaryMenuItems } = useMenus();
  const location = useLocation();
  const { user, impersonatedUser, logout, stopImpersonation } = useAuth();
  
  const activeUser = impersonatedUser || user;

  useEffect(() => {
    setIsMenuOpen(false);
    // Vérifier si les notifications sont déjà activées
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    if (impersonatedUser) {
      stopImpersonation();
    } else {
      await logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="hidden items-center space-x-2 md:flex">
            <img
              src="/lovable-uploads/logo-topcenter.png"
              alt="TopCenter Logo"
              className="h-8 w-auto"
            />
          </Link>
          <DesktopNav items={primaryMenuItems} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Rechercher"
            onClick={() => setIsSearchOpen(true)}
            className="mr-1"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Rechercher</span>
          </Button>
          <SearchDialog
            open={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          />

          <NotificationButton 
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
          />

          <ThemeToggle />

          <UserProfileMenu 
            activeUser={activeUser}
            handleLogout={handleLogout}
          />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            className="md:hidden"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      <MobileMenu
        open={isMenuOpen}
        setOpen={setIsMenuOpen}
        items={primaryMenuItems}
        isAuthenticated={!!activeUser}
        onLogout={handleLogout}
      />
    </header>
  );
}
