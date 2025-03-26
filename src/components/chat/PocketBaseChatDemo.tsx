
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Bot, Send, Loader2 } from "lucide-react";
import { useNotifications } from '@/components/notifications/NotificationsProvider';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import PocketBase from 'pocketbase';

// ChatMessage interface
interface ChatMessage {
  id?: string;  // Made optional to fix the error
  content: string;
  sender: 'user' | 'assistant';
  created: string;
  collectionId?: string;
  collectionName?: string;
}

export const PocketBaseChatDemo = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pb = useRef<PocketBase | null>(null);
  const { addNotification } = useNotifications();
  
  // Initialize PocketBase connection
  useEffect(() => {
    const initPocketBase = async () => {
      try {
        setIsLoading(true);
        
        // Create PocketBase client
        pb.current = new PocketBase('https://pocketbase-demo.fly.dev');
        
        // Check connection by getting record count
        try {
          const count = await pb.current.collection('chat_messages').getList(1, 1);
          console.log('PocketBase connected', count);
          setIsConnected(true);
          
          // Load initial messages
          await loadMessages();
          
          addNotification(
            "Connexion établie", 
            "Vous êtes maintenant connecté à PocketBase", 
            "success"
          );
        } catch (err) {
          console.error('PocketBase connection failed', err);
          addNotification(
            "Erreur de connexion", 
            "Impossible de se connecter à PocketBase", 
            "error"
          );
        }
      } catch (error) {
        console.error('Error initializing PocketBase', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initPocketBase();
    
    // Cleanup
    return () => {
      if (pb.current) {
        // Unsubscribe if needed
      }
    };
  }, [addNotification]);
  
  // Load message history
  const loadMessages = async () => {
    if (!pb.current) return;
    
    try {
      setIsLoading(true);
      const records = await pb.current.collection('chat_messages').getList(1, 50, {
        sort: 'created',
      });
      
      setMessages(records.items as unknown as ChatMessage[]);
    } catch (error) {
      console.error('Error loading messages', error);
      addNotification(
        "Erreur de chargement", 
        "Impossible de charger les messages", 
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send message
  const sendMessage = async () => {
    if (!message.trim() || !pb.current || !isConnected) return;
    
    const userMessage: ChatMessage = {
      content: message,
      sender: 'user',
      created: new Date().toISOString(),
    };
    
    // Add message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
    
    try {
      // Save message to PocketBase
      await pb.current.collection('chat_messages').create(userMessage);
      
      // Simulate assistant response
      setTimeout(async () => {
        const assistantMessage: ChatMessage = {
          content: `Merci pour votre message. Je suis l'assistant de démonstration PocketBase.`,
          sender: 'assistant',
          created: new Date().toISOString(),
        };
        
        // Save assistant message to PocketBase
        const record = await pb.current.collection('chat_messages').create(assistantMessage);
        
        // Add to messages with ID
        setMessages(prev => [...prev, {
          ...assistantMessage,
          id: record.id
        }]);
        
        // Scroll again
        setTimeout(() => {
          if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
              scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
          }
        }, 100);
      }, 1000);
    } catch (error) {
      console.error('Error sending message', error);
      addNotification(
        "Erreur d'envoi", 
        "Impossible d'envoyer le message", 
        "error"
      );
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          PocketBase Chat Demo
        </CardTitle>
        <CardDescription>
          Démonstration d'intégration avec PocketBase
        </CardDescription>
        <Separator />
      </CardHeader>
      <CardContent ref={scrollAreaRef}>
        <ScrollArea className="h-[300px] pr-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bot className="w-10 h-10 mb-2 opacity-20" />
              <p>Aucun message pour le moment</p>
              <p className="text-sm">Envoyez un message pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      flex items-start gap-2 max-w-[80%] 
                      ${msg.sender === 'user' 
                        ? 'flex-row-reverse' 
                        : 'flex-row'}
                    `}
                  >
                    <div 
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'}
                      `}
                    >
                      {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div 
                      className={`
                        rounded-lg px-3 py-2 
                        ${msg.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'}
                      `}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatDistanceToNow(new Date(msg.created), { 
                          addSuffix: true,
                          locale: fr 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form 
          className="flex w-full items-center space-x-2" 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Input
            placeholder="Entrez votre message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected || isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!isConnected || isLoading || !message.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PocketBaseChatDemo;
