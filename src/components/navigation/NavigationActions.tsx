
import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from '@/components/IntlProvider';
import { Button } from '@/components/ui/button';
import { Search, LogIn } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useSearch } from '@/contexts/SearchContext';
import { useAuth } from '@/hooks/useAuth';

export const NavigationActions: React.FC = () => {
  const { openSearch } = useSearch();
  const { user, impersonatedUser } = useAuth();
  
  const activeUser = impersonatedUser || user;

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Recherche */}
      <Button
        variant="ghost"
        size="icon"
        onClick={openSearch}
        aria-label="Rechercher"
        className="text-foreground/70 hover:text-foreground hover:bg-accent/50"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Rechercher</span>
      </Button>

      {/* Sélecteur de langue */}
      <LanguageSwitcher />
      
      {/* Bascule mode sombre/clair */}
      <ThemeToggle />
      
      {/* Bouton de connexion - Plus visible maintenant */}
      {!activeUser && (
        <Button 
          variant="default" 
          size="sm"
          asChild
          className="flex gap-1"
        >
          <Link to="/login">
            <LogIn className="h-4 w-4 mr-1" />
            <FormattedMessage id="nav.login" defaultMessage="Connexion" />
          </Link>
        </Button>
      )}
    </div>
  );
};
