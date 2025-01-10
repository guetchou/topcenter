import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const NewsSearch = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <Input
        type="text"
        placeholder="Rechercher dans les actualités..."
        className="pl-10 pr-4"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    </div>
  );
};