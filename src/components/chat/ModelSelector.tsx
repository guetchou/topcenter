
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-24 h-8">
        <SelectValue placeholder="Modèle" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="perplexity">Perplexity</SelectItem>
        <SelectItem value="llama2">Llama 2</SelectItem>
        <SelectItem value="mistral">Mistral 7B</SelectItem>
      </SelectContent>
    </Select>
  );
};
