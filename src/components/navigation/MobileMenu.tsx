
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { LogIn, Search } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { openSearch } = useSearch();
  const { user, impersonatedUser } = useAuth();
  
  const activeUser = impersonatedUser || user;

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[85vw] sm:w-[350px]">
        <nav className="flex flex-col gap-4 mt-8" aria-label="Navigation mobile">
          <Link 
            to="/" 
            className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
            onClick={onClose}
          >
            <FormattedMessage id="nav.home" defaultMessage="Accueil" />
          </Link>
          <Link 
            to="/services" 
            className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
            onClick={onClose}
          >
            <FormattedMessage id="nav.services" defaultMessage="Services" />
          </Link>
          <Link 
            to="/news" 
            className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
            onClick={onClose}
          >
            <FormattedMessage id="nav.news" defaultMessage="Actualités" />
          </Link>
          <Link 
            to="/blog" 
            className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
            onClick={onClose}
          >
            <FormattedMessage id="nav.blog" defaultMessage="Blog" />
          </Link>
          <Link 
            to="/about" 
            className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
            onClick={onClose}
          >
            <FormattedMessage id="nav.about" defaultMessage="À propos" />
          </Link>
          <Link 
            to="/contact" 
            className="text-lg font-medium py-2 border-b border-border/50 hover:bg-accent/50 px-2 rounded-md transition-colors"
            onClick={onClose}
          >
            <FormattedMessage id="nav.contact" defaultMessage="Contact" />
          </Link>

          {!activeUser && (
            <Button
              variant="default"
              className="mt-4"
              asChild
            >
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                <FormattedMessage id="nav.login" defaultMessage="Connexion" />
              </Link>
            </Button>
          )}

          <Button
            variant="outline"
            className="mt-2"
            onClick={() => {
              openSearch();
              onClose();
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            <FormattedMessage id="nav.search" defaultMessage="Rechercher" />
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
