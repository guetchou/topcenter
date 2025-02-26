
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "./nav/MobileMenu";
import { DesktopNav } from "./nav/DesktopNav";

export const MainNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/logo-topcenter.png"
              alt="Top Center Logo" 
              className="h-12 object-contain"
            />
          </Link>

          <DesktopNav />

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <MobileMenu isOpen={isOpen} />
      </div>
    </nav>
  );
};
