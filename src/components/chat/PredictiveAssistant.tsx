
import { useState, useEffect } from "react";
import { MessageSquare, Sparkles, Brain, Send, LightbulbIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { predictNextInteraction } from "@/utils/predictiveAnalysis";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const PredictiveAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [predictedTopics, setPredictedTopics] = useState<string[]>([]);
  const [suggestedResponses, setSuggestedResponses] = useState<string[]>([]);
  const [userIntent, setUserIntent] = useState<{type: string, confidence: number}>({ type: 'information', confidence: 0.5 });
  const [predictionConfidence, setPredictionConfidence] = useState(0.5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Message de bienvenue initial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        text: "Bonjour ! Je suis l'assistant prédictif de TopCenter. Comment puis-je vous aider aujourd'hui ?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      // Prédiction initiale
      const initialPrediction = predictNextInteraction([welcomeMessage]);
      setPredictedTopics(initialPrediction.nextTopics);
      setSuggestedResponses(initialPrediction.suggestedResponses);
      setPredictionConfidence(initialPrediction.confidence);
      setUserIntent(initialPrediction.userIntent);
    }
  }, [isOpen, messages.length]);

  // Mettre à jour les prédictions lorsque les messages changent
  useEffect(() => {
    if (messages.length > 0) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const prediction = predictNextInteraction(messages);
        setPredictedTopics(prediction.nextTopics);
        setSuggestedResponses(prediction.suggestedResponses);
        setPredictionConfidence(prediction.confidence);
        setUserIntent(prediction.userIntent);
        setIsAnalyzing(false);
      }, 500);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simuler une réponse de l'assistant après un délai
    setTimeout(() => {
      // Générer une réponse basée sur les suggestions
      const responseOptions = suggestedResponses.length > 0 
        ? suggestedResponses 
        : ["Je comprends votre demande. Comment puis-je vous aider davantage?"];
      
      const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedTopicClick = (topic: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + topic);
  };

  const handleSuggestedResponseClick = (response: string) => {
    setMessage(response);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-lg shadow-lg w-[450px] max-h-[600px] flex flex-col animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-primary/90 to-primary rounded-t-lg text-primary-foreground">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Assistant Prédictif</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="ml-2 bg-primary-foreground/20 hover:bg-primary-foreground/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {Math.round(predictionConfidence * 100)}% IA
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Niveau de confiance de la prédiction IA</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {!msg.isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div 
                  className={`rounded-lg px-3 py-2 max-w-[75%] ${
                    msg.isUser 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                
                {msg.isUser && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3 ml-2 animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Predicted Topics & Intent */}
          <div className="px-4 py-2 border-t border-b bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Analyse prédictive</span>
              </div>
              <Badge variant="outline" className="text-xs">
                <span className="capitalize">{userIntent.type}</span> 
                <span className="ml-1 opacity-70">{Math.round(userIntent.confidence * 100)}%</span>
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {isAnalyzing ? (
                <div className="w-full flex justify-center py-1">
                  <div className="animate-pulse flex gap-1 items-center">
                    <Brain className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Analyse en cours...</span>
                  </div>
                </div>
              ) : (
                predictedTopics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleSuggestedTopicClick(topic)}
                  >
                    {topic}
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Suggested Responses */}
          <div className="px-4 py-2 border-b">
            <div className="flex items-center gap-1 mb-2">
              <LightbulbIcon className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium">Réponses suggérées</span>
            </div>
            <div className="flex flex-col gap-1">
              {suggestedResponses.slice(0, 2).map((response, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start h-auto py-1 px-2 text-xs text-left"
                  onClick={() => handleSuggestedResponseClick(response)}
                >
                  {response.length > 60 ? response.substring(0, 57) + '...' : response}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isTyping || !message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-12 h-12 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary"
        >
          <Brain className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
