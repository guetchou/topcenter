
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Globe, 
  Search, 
  User,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useTheme } from "next-themes";

export const DynamicNav = () => {
  const { data: headerMenus, isLoading } = useMenus("header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  if (isLoading || !headerMenus) {
    return <div className="h-20 animate-pulse bg-muted"></div>;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo et Marque */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/94200422-356e-4b69-8e4c-c385cc1eb543.png" 
              alt="TopCenter Logo"
              className="h-10 w-auto"
            />
            <span className="font-bold text-xl text-primary hidden sm:inline-block">
              TopCenter
            </span>
          </Link>
        </div>

        {/* Navigation Desktop */}
        <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
          {headerMenus.map((menu) => (
            <div key={menu.id} className="flex items-center space-x-6">
              {menu.items.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-primary-foreground">
              3
            </span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Mobile */}
        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon">
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
                {headerMenus.map((menu) => (
                  <div key={menu.id} className="flex flex-col space-y-4">
                    {menu.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.url}
                        className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
                <div className="pt-6 border-t space-y-4">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Bell className="mr-2 h-5 w-5" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <User className="mr-2 h-5 w-5" />
                    Mon compte
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Globe className="mr-2 h-5 w-5" />
                    Langue
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
