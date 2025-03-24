
import { useEffect, useState } from 'react';
import { Command, ChevronDown, Search, Settings, HelpCircle, User, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Shortcut {
  keys: string[];
  description: string;
  category: 'navigation' | 'actions' | 'ui' | 'admin';
}

const defaultShortcuts: Shortcut[] = [
  { keys: ['?'], description: 'Afficher les raccourcis clavier', category: 'ui' },
  { keys: ['Command', 'K'], description: 'Ouvrir la recherche', category: 'navigation' },
  { keys: ['Command', '/'], description: 'Ouvrir la barre de commande', category: 'navigation' },
  { keys: ['Command', '.'], description: 'Ouvrir les paramètres', category: 'navigation' },
  { keys: ['Command', 'B'], description: 'Activer/Désactiver la barre latérale', category: 'ui' },
  { keys: ['Command', 'D'], description: 'Changer de thème', category: 'ui' },
  { keys: ['Command', 'H'], description: 'Retour à l\'accueil', category: 'navigation' },
  { keys: ['Command', 'L'], description: 'Se connecter/déconnecter', category: 'actions' },
  { keys: ['Command', 'A'], description: 'Panneau d\'administration', category: 'admin' },
  { keys: ['Command', 'S'], description: 'Sauvegarder', category: 'actions' },
  { keys: ['Command', 'Z'], description: 'Annuler', category: 'actions' },
  { keys: ['Escape'], description: 'Fermer le dialogue actif', category: 'ui' },
];

interface KeyboardShortcutsProps {
  shortcuts?: Shortcut[];
  isAdmin?: boolean;
}

export function KeyboardShortcuts({ shortcuts = defaultShortcuts, isAdmin = false }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredShortcuts = shortcuts.filter(shortcut => 
    (filterCategory === null || shortcut.category === filterCategory) &&
    (shortcut.category !== 'admin' || isAdmin)
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts dialog when '?' is pressed
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setIsOpen(true);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCategoryChange = (category: string | null) => {
    setFilterCategory(category === filterCategory ? null : category);
  };

  const getKeyIcon = (key: string) => {
    switch (key) {
      case 'Command':
        return <Command className="h-3 w-3 mr-1" />;
      case 'Search':
        return <Search className="h-3 w-3 mr-1" />;
      case 'Settings':
        return <Settings className="h-3 w-3 mr-1" />;
      case 'Help':
        return <HelpCircle className="h-3 w-3 mr-1" />;
      case 'User':
        return <User className="h-3 w-3 mr-1" />;
      case 'Logout':
        return <LogOut className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        aria-label="Raccourcis clavier"
      >
        <span className="hidden md:inline-block mr-2">Raccourcis clavier</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ?
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Raccourcis clavier</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-wrap gap-2 my-4">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                filterCategory === null 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => handleCategoryChange('navigation')}
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                filterCategory === 'navigation' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              Navigation
            </button>
            <button
              onClick={() => handleCategoryChange('actions')}
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                filterCategory === 'actions' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              Actions
            </button>
            <button
              onClick={() => handleCategoryChange('ui')}
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                filterCategory === 'ui' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              Interface
            </button>
            {isAdmin && (
              <button
                onClick={() => handleCategoryChange('admin')}
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  filterCategory === 'admin' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                Admin
              </button>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Touches</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShortcuts.map((shortcut, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          {keyIndex > 0 && <span className="mx-1">+</span>}
                          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground">
                            {getKeyIcon(key)}{key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{shortcut.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <p className="text-sm text-muted-foreground mt-4">
            Appuyez sur <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">?</kbd> à tout moment pour afficher cette aide.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default KeyboardShortcuts;
