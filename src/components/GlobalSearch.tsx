
import React, { useCallback, useRef, useEffect } from 'react';
import { useSearch } from "@/contexts/SearchContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search as SearchIcon, FileText, Home, Users, Phone, BookOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResult {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  category: string;
}

export function GlobalSearch() {
  const { globalSearchTerm, setGlobalSearchTerm, isSearchOpen, openSearch, closeSearch } = useSearch();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock search results (future enhancement: connect to backend)
  const searchResults: SearchResult[] = [
    {
      title: "Accueil",
      description: "Page d'accueil du site",
      url: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      category: "Pages"
    },
    {
      title: "Services",
      description: "Découvrez nos services de centre d'appels",
      url: "/services",
      icon: <Phone className="h-4 w-4 mr-2" />,
      category: "Pages"
    },
    {
      title: "À propos",
      description: "En savoir plus sur TopCenter",
      url: "/about",
      icon: <Users className="h-4 w-4 mr-2" />,
      category: "Pages"
    },
    {
      title: "Blog",
      description: "Articles et actualités",
      url: "/blog",
      icon: <FileText className="h-4 w-4 mr-2" />,
      category: "Pages"
    },
    {
      title: "FAQ",
      description: "Foire aux questions",
      url: "/faq",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      category: "Pages"
    },
    {
      title: "Formation des agents",
      description: "Services de formation pour vos agents",
      url: "/services/formation",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      category: "Services"
    }
  ];

  // Filter search results based on the input
  const filteredResults = searchResults.filter(
    (result) =>
      result.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
      result.description.toLowerCase().includes(globalSearchTerm.toLowerCase())
  );

  // Group results by category
  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Handle selection
  const handleSelect = (url: string) => {
    closeSearch();
    setGlobalSearchTerm("");
    navigate(url);
    toast.success("Navigation vers " + url);
  };

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isSearchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch, closeSearch, isSearchOpen]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={openSearch}
        className="md:hidden"
        aria-label="Rechercher"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
      
      <Dialog open={isSearchOpen} onOpenChange={closeSearch}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="text-center">Recherche Globale</DialogTitle>
          </DialogHeader>
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Rechercher..."
              value={globalSearchTerm}
              onValueChange={setGlobalSearchTerm}
              ref={searchInputRef}
              className="h-12"
              aria-label="Tapez votre recherche"
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <div className="flex flex-col items-center gap-2">
                  <SearchIcon className="h-10 w-10 text-muted-foreground opacity-50" />
                  <p>Aucun résultat trouvé pour "{globalSearchTerm}"</p>
                </div>
              </CommandEmpty>
              
              {Object.entries(groupedResults).map(([category, results]) => (
                <CommandGroup key={category} heading={category}>
                  {results.map((result) => (
                    <CommandItem
                      key={result.url}
                      onSelect={() => handleSelect(result.url)}
                      className="flex items-center py-2 px-2"
                    >
                      {result.icon}
                      <div className="flex flex-col">
                        <span>{result.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {result.description}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <div className="border-t px-3 py-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                  <span>Chercher</span>
                </div>
                <div className="flex gap-2">
                  <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    ↩
                  </kbd>
                  <span>Sélectionner</span>
                </div>
                <div className="flex gap-2">
                  <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    Esc
                  </kbd>
                  <span>Fermer</span>
                </div>
              </div>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
