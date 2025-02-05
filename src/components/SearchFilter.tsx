import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
}

export const SearchFilter = ({ onSearch, onFilter }: SearchFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Rechercher..."
          className="pl-10"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex gap-2">
        <Select onValueChange={onFilter}>
          <option value="">Toutes catégories</option>
          <option value="call-center">Centre d'appels</option>
          <option value="online-sales">Vente en ligne</option>
          <option value="telephony">Téléphonie</option>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};