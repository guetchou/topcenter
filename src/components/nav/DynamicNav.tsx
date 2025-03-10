
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { SearchDialog } from "./SearchDialog";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  LogOut,
  Menu,
  Search,
  Shield,
  Bell,
} from "lucide-react";
import { useMenus } from "@/hooks/useMenus";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne supporte pas les notifications.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        
        // Affiche une notification de test
        new Notification('Bienvenue chez TopCenter!', {
          body: 'Vous recevrez désormais nos actualités en temps réel.',
          icon: '/lovable-uploads/logo-topcenter.png'
        });

        toast({
          title: "Notifications activées",
          description: "Vous recevrez nos actualités en temps réel.",
        });
      } else {
        toast({
          title: "Notifications refusées",
          description: "Vous ne recevrez pas de notifications.",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications.",
        variant: "destructive",
      });
    }
  };

  const getAdminRoute = () => {
    if (!activeUser) return "/login";
    
    if (activeUser.role === "super_admin") {
      return "/super-admin/users";
    } else if (activeUser.role === "admin") {
      return "/admin";
    } else if (activeUser.role?.includes("agent")) {
      return "/agent";
    } else {
      return "/client";
    }
  };

  const getProfileRoute = () => {
    if (!activeUser) return "/login";
    
    if (activeUser.role === "super_admin" || activeUser.role === "admin") {
      return "/admin/settings";
    } else if (activeUser.role?.includes("agent")) {
      return "/agent/settings";
    } else {
      return "/client/settings";
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

          <Button
            variant="ghost"
            size="icon"
            aria-label={notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
            onClick={handleNotificationToggle}
            className="mr-1 relative"
          >
            <Bell className="h-5 w-5" />
            {notificationsEnabled && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
            <span className="sr-only">
              {notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
            </span>
          </Button>

          <ThemeToggle />

          {activeUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="Menu utilisateur"
                >
                  {activeUser.role === "super_admin" && !impersonatedUser ? (
                    <Shield className="h-5 w-5 text-destructive" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  {impersonatedUser && (
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {activeUser.profile?.full_name || activeUser.email}
                  {impersonatedUser && (
                    <span className="ml-2 text-xs text-destructive">(Impersonnifié)</span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to={getAdminRoute()}>
                    {activeUser.role === "super_admin" 
                      ? "Panneau Super Admin" 
                      : activeUser.role === "admin" 
                        ? "Panneau Admin" 
                        : activeUser.role?.includes("agent") 
                          ? "Portail Agent" 
                          : "Portail Client"}
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to={getProfileRoute()}>Mon profil</Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {impersonatedUser ? "Arrêter l'impersonnification" : "Déconnexion"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              asChild
            >
              <Link to="/login">Se connecter</Link>
            </Button>
          )}

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
