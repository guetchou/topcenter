
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Menu, 
  Globe, 
  Search, 
  User,
  Bell,
  Sun,
  Moon,
  Settings,
  LayoutDashboard,
  Users,
  Building2,
  ChevronDown,
  Phone,
  Calendar,
  MessageCircle,
  Clock
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { SearchDialog } from "./SearchDialog";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export const DynamicNav = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: headerMenus, isLoading } = useMenus("header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Exemple de notification count
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showNotificationDot, setShowNotificationDot] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  // Fonction pour demander la permission des notifications
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Affiche une notification de bienvenue
        const notification = new Notification('Bienvenue chez TopCenter!', {
          body: 'Vous recevrez désormais nos actualités en temps réel.',
          icon: '/lovable-uploads/logo-topcenter.png'
        });
        
        // Joue un son de notification
        const audio = new Audio('/notification.mp3');
        audio.play();

        toast({
          title: "Notifications activées",
          description: "Vous recevrez nos actualités en temps réel."
        });
        
        // Retire l'indicateur visuel
        setShowNotificationDot(false);
      }
    }
  };

  const serviceItems = [
    { 
      label: "Centre d'appel",
      icon: Phone,
      href: "/services/call-center"
    },
    { 
      label: "Rendez-vous",
      icon: Calendar,
      href: "/devis"
    },
    { 
      label: "Chat en direct",
      icon: MessageCircle,
      href: "/contact"
    },
    { 
      label: "Support 24/7",
      icon: Clock,
      href: "/contact"
    }
  ];

  const adminMenuItems = [
    { 
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin"
    },
    { 
      label: "Gestion des actualités",
      icon: Building2,
      href: "/admin/news"
    },
    { 
      label: "Paramètres",
      icon: Settings,
      href: "/settings"
    }
  ];

  const userMenuItems = [
    { 
      label: "Portail Client",
      icon: Users,
      href: "/client"
    },
    { 
      label: "Paramètres",
      icon: Settings,
      href: "/settings"
    }
  ];

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt!",
    });
    navigate('/');
  };

  const renderAuthButton = () => {
    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              {user.profile?.full_name || user.email}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon espace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {user.role === 'admin' && (
              <>
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Administration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                  <Users className="mr-2 h-4 w-4" />
                  Gestion utilisateurs
                </DropdownMenuItem>
              </>
            )}
            
            {(user.role === 'commercial_agent' || user.role === 'support_agent') && (
              <DropdownMenuItem onClick={() => navigate(`/agent/${user.role === 'commercial_agent' ? 'commercial' : 'support'}`)}>
                <Building2 className="mr-2 h-4 w-4" />
                Espace agent
              </DropdownMenuItem>
            )}
            
            {user.role === 'client' && (
              <DropdownMenuItem onClick={() => navigate('/client')}>
                <User className="mr-2 h-4 w-4" />
                Mon compte
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button variant="default" size="sm" onClick={() => navigate('/login')}>
        <User className="h-4 w-4 mr-2" />
        Connexion
      </Button>
    );
  };

  if (isLoading || !headerMenus) {
    return <div className="h-20 animate-pulse bg-muted"></div>;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo et Marque */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/logo-topcenter.png" 
              alt="TopCenter Logo"
              className="h-12 w-auto"
            />
            <span className="font-bold text-xl text-primary hidden sm:inline-block">
              TopCenter
            </span>
          </Link>
        </div>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Accueil
          </Link>

          {/* Services Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                Services
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Nos Services</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {serviceItems.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="cursor-pointer"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/devis"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/devis") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Devis
          </Link>

          <Link
            to="/contact"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/contact") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Contact
          </Link>
        </div>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center space-x-2">
          {renderAuthButton()}

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" onClick={requestNotificationPermission}>
                <Bell className="h-5 w-5" />
                {showNotificationDot && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-primary-foreground">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="cursor-default">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Nouvelle mise à jour</span>
                    <span className="text-xs text-muted-foreground">Notre plateforme a été mise à jour avec de nouvelles fonctionnalités</span>
                    <span className="text-xs text-muted-foreground">Il y a 2 heures</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Nouveau message</span>
                    <span className="text-xs text-muted-foreground">Vous avez reçu un nouveau message de support</span>
                    <span className="text-xs text-muted-foreground">Il y a 1 jour</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Rappel rendez-vous</span>
                    <span className="text-xs text-muted-foreground">Rappel pour votre rendez-vous demain à 14h00</span>
                    <span className="text-xs text-muted-foreground">Il y a 2 jours</span>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[
                { code: 'fr', label: 'Français' },
                { code: 'en', label: 'English' }
              ].map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => {
                    document.documentElement.lang = lang.code;
                  }}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Mobile */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Notification Bell for Mobile */}
          <Button variant="ghost" size="icon" className="relative" onClick={requestNotificationPermission}>
            <Bell className="h-5 w-5" />
            {showNotificationDot && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-primary-foreground">
                {notificationCount}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Services Section Mobile */}
                <div className="space-y-2">
                  <h3 className="font-semibold mb-2">Nos Services</h3>
                  {serviceItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="outline"
                      className="w-full justify-start"
                      size="lg"
                      onClick={() => {
                        navigate(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </Button>
                  ))}
                </div>

                {/* Main Navigation Mobile */}
                <div className="space-y-2">
                  <Link 
                    to="/devis"
                    className="flex items-center p-2 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>Devis</span>
                  </Link>
                  
                  <Link 
                    to="/contact"
                    className="flex items-center p-2 hover:bg-muted rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    <span>Contact</span>
                  </Link>
                </div>

                {/* Admin & User Sections Mobile - Only if authenticated */}
                {isAuthenticated && (
                  <div className="pt-6 border-t space-y-4">
                    {user.role === 'admin' && (
                      <div className="space-y-2">
                        <h3 className="font-semibold mb-2">Administration</h3>
                        {[
                          { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
                          { label: "Gestion des actualités", icon: Building2, href: "/admin/news" },
                          { label: "Paramètres", icon: Settings, href: "/settings" }
                        ].map((item) => (
                          <Button
                            key={item.href}
                            variant="outline"
                            className="w-full justify-start"
                            size="lg"
                            onClick={() => {
                              navigate(item.href);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <item.icon className="mr-2 h-5 w-5" />
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="font-semibold mb-2">Mon espace</h3>
                      {[
                        { label: "Portail Client", icon: Users, href: "/client" },
                        { label: "Paramètres", icon: Settings, href: "/settings" }
                      ].map((item) => (
                        <Button
                          key={item.href}
                          variant="outline"
                          className="w-full justify-start"
                          size="lg"
                          onClick={() => {
                            navigate(item.href);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <item.icon className="mr-2 h-5 w-5" />
                          {item.label}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-500"
                      size="lg"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Déconnexion
                    </Button>
                  </div>
                )}

                {/* Theme and Language Section - Mobile */}
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Globe className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {[
                        { code: 'fr', label: 'Français' },
                        { code: 'en', label: 'English' }
                      ].map((lang) => (
                        <DropdownMenuItem
                          key={lang.code}
                          onClick={() => {
                            document.documentElement.lang = lang.code;
                          }}
                        >
                          {lang.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Dialogue de recherche */}
      <SearchDialog 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen}
      />
    </nav>
  );
};
