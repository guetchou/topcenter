
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/hooks/useMenus";

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: MenuItem[];
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const MobileMenu = ({ 
  open, 
  onOpenChange, 
  items, 
  isAuthenticated,
  onLogout 
}: MobileMenuProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex flex-col pt-16">
        <div className="flex flex-col space-y-4">
          {items.map((item) => {
            // Si l'élément a des enfants, créer un sous-menu
            if (item.children && item.children.length > 0) {
              return (
                <div key={item.title} className="space-y-2">
                  <div className="font-medium">{item.title}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      to={child.path}
                      className="block pl-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => onOpenChange(false)}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              );
            }
            
            // Sinon, afficher un lien simple
            return (
              <Link
                key={item.title}
                to={item.path}
                className="py-2 font-medium transition-colors hover:text-primary"
                onClick={() => onOpenChange(false)}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-auto pt-4 border-t">
          {isAuthenticated && (
            <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
