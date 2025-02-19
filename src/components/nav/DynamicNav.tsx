
import { Link } from "react-router-dom";
import { useMenus } from "@/hooks/useMenus";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export const DynamicNav = () => {
  const { data: headerMenus, isLoading } = useMenus("header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading || !headerMenus) {
    return <div className="h-16 animate-pulse bg-muted"></div>;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-8 font-bold text-xl">
          TopCenter
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 flex-1">
          {headerMenus.map((menu) => (
            <div key={menu.id} className="flex items-center space-x-4">
              {menu.items.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-1 justify-end">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {headerMenus.map((menu) => (
                  <div key={menu.id} className="flex flex-col space-y-4">
                    {menu.items.map((item) => (
                      <Link
                        key={item.id}
                        to={item.url}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
