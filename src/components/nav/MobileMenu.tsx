
import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuItem } from "@/hooks/useMenus";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  items: MenuItem[];
  isAuthenticated?: boolean;
  onLogout?: () => Promise<void>;
}

export function MobileMenu({ open, setOpen, items, isAuthenticated, onLogout }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          {items.map((item) => {
            // If the item has children, render with a dropdown
            if (item.children && item.children.length > 0) {
              return (
                <div key={item.title} className="flex flex-col gap-2">
                  <Link
                    to={item.path}
                    className="font-medium text-lg"
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                  <div className="pl-4 flex flex-col gap-2 border-l">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        to={child.path}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            // If no children, render a simple link
            return (
              <Link
                key={item.title}
                to={item.path}
                className="font-medium text-lg"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            );
          })}
          
          {isAuthenticated && onLogout && (
            <Button 
              variant="ghost" 
              className="justify-start mt-4 text-destructive" 
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
