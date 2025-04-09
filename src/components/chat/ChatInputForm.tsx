import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickReplies } from "./QuickReplies";
import { ContextualSuggestions } from "./ContextualSuggestions";
import { VoiceInput } from "./VoiceInput";
import { SentimentIndicator } from "./SentimentIndicator";
import { MessageType } from "@/types/chat";
import { analyzeSentiment, SentimentResult } from "@/utils/sentimentAnalyzer";

interface ChatInputFormProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  transferring: boolean;
  messages: MessageType[];
}

const commonQuestions = [
  "Quels sont vos services ?",
  "Comment obtenir un devis ?",
  "Horaires d'ouverture",
  "Tarifs centre d'appels"
];

export const ChatInputForm = ({ 
  message, 
  setMessage, 
  onSubmit, 
  isLoading, 
  transferring,
  messages
}: ChatInputFormProps) => {
  const [currentSentiment, setCurrentSentiment] = useState<SentimentResult | null>(null);

  const handleSuggestionSelect = (suggestion: string) => {
    setMessage(suggestion);
    // Analyser le sentiment lorsqu'une suggestion est sélectionnée
    const sentiment = analyzeSentiment(suggestion);
    setCurrentSentiment(sentiment);
  };

  const handleVoiceInput = (text: string) => {
    setMessage(text);
    // Analyser le sentiment de l'entrée vocale
    const sentiment = analyzeSentiment(text);
    setCurrentSentiment(sentiment);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setMessage(newText);
    
    // Analyser le sentiment seulement si le texte a une certaine longueur
    if (newText.length > 3) {
      const sentiment = analyzeSentiment(newText);
      setCurrentSentiment(sentiment);
    } else if (newText.length === 0) {
      setCurrentSentiment(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <QuickReplies 
        suggestions={commonQuestions}
        onSelect={handleSuggestionSelect}
        className="mb-2"
      />
      
      <ContextualSuggestions
        currentMessage={message}
        messages={messages}
        onSelect={handleSuggestionSelect}
        className="mb-2"
      />
      
      <form onSubmit={onSubmit} className="flex gap-2 relative">
        <Input
          value={message}
          onChange={handleTextInput}
          placeholder="Écrivez votre message..."
          className="flex-1"
          disabled={transferring}
        />
        
        {currentSentiment && (
          <SentimentIndicator 
            sentiment={currentSentiment}
            className="absolute -top-10 left-2"
          />
        )}
        
        <VoiceInput 
          onVoiceInput={handleVoiceInput}
          isDisabled={transferring}
        />
        
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || transferring || !message.trim()}
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
