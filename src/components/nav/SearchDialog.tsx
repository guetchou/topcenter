
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = [
    { title: "Centre d'appel", href: "/services/call-center" },
    { title: "Rendez-vous", href: "/devis" },
    { title: "Chat en direct", href: "/contact" },
    { title: "Support 24/7", href: "/contact" },
  ].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Rechercher</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput 
            placeholder="Rechercher un service..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup heading="Services">
              {searchResults.map((result) => (
                <CommandItem
                  key={result.href}
                  onSelect={() => {
                    navigate(result.href);
                    onOpenChange(false);
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {result.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
