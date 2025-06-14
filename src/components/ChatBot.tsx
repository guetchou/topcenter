
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Paperclip, 
  Mic,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  type?: 'text' | 'file' | 'image';
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

interface ChatBotProps {
  onTransferToHuman?: () => void;
  showControls?: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ 
  onTransferToHuman,
  showControls = true 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis l\'assistant virtuel de TopCenter. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Réponses contextuelles pour TopCenter
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût')) {
      return 'Nos tarifs dépendent de vos besoins spécifiques. Nous proposons plusieurs formules : Basique (à partir de 500 000 FCFA/mois), Business (1 500 000 FCFA/mois) et Enterprise (3 500 000 FCFA/mois). Souhaitez-vous que je vous mette en contact avec notre équipe commerciale pour un devis personnalisé ?';
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('que faites')) {
      return 'TopCenter propose des services de centre d\'appels, service client multicanal, prise de rendez-vous et support technique. Nous traitons plus de 2500 appels quotidiens avec 90% des appels répondus en moins de 20 secondes. Sur quel service souhaitez-vous plus d\'informations ?';
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('téléphone') || lowerMessage.includes('adresse')) {
      return 'Vous pouvez nous contacter au +242 06 449 5353 ou +242 05 319 6105. Notre bureau est situé au 28 rue Docteur Cureux, Centre-Ville, Brazzaville. Vous pouvez aussi nous écrire à contact@topcenter.cg. Préférez-vous que je vous transfère vers un agent ?';
    }
    
    if (lowerMessage.includes('horaire') || lowerMessage.includes('ouvert')) {
      return 'Nos horaires standard sont du lundi au vendredi de 8h à 17h, et le samedi de 8h à 19h selon les formules. Pour nos clients Enterprise, nous pouvons proposer un service 24/7. Avez-vous des besoins spécifiques en termes d\'horaires ?';
    }
    
    if (lowerMessage.includes('agent') || lowerMessage.includes('humain') || lowerMessage.includes('personne')) {
      return 'Je peux vous mettre en contact avec l\'un de nos agents humains. Ils pourront vous fournir une assistance personnalisée. Souhaitez-vous que je vous transfère maintenant ?';
    }
    
    // Réponses par défaut
    const defaultResponses = [
      'C\'est une excellente question ! Pour vous donner la meilleure réponse, puis-je vous demander plus de détails ?',
      'Je comprends votre demande. Permettez-moi de vous orienter vers la bonne information.',
      'Merci pour votre question. Je vais faire de mon mieux pour vous aider.',
      'Intéressant ! Pouvez-vous me donner plus de contexte pour que je puisse mieux vous assister ?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simuler le délai de réponse du bot
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        content: generateBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const message: Message = {
        id: `file-${Date.now()}-${Math.random()}`,
        content: `Fichier partagé: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'file',
        attachments: [{
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type
        }]
      };

      setMessages(prev => [...prev, message]);
    });

    // Réponse automatique du bot pour les fichiers
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot-file-${Date.now()}`,
        content: 'J\'ai bien reçu votre fichier. Un agent va l\'examiner et vous répondre rapidement. Avez-vous d\'autres questions en attendant ?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleTransferToHuman = () => {
    if (onTransferToHuman) {
      onTransferToHuman();
    }
    
    const transferMessage: Message = {
      id: `transfer-${Date.now()}`,
      content: 'Un agent humain va prendre le relais de cette conversation. Merci de patienter un instant.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, transferMessage]);
    toast.success('Transfert vers un agent humain en cours...');
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/lovable-uploads/logo-topcenter.png" />
              <AvatarFallback>
                <Bot className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Assistant TopCenter</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                {isConnected ? 'En ligne' : 'Hors ligne'}
              </CardDescription>
            </div>
          </div>
          
          {showControls && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleTransferToHuman}>
                <Phone className="w-4 h-4 mr-1" />
                Agent
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-8 h-8">
                {message.sender === 'user' ? (
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div className={`flex flex-col max-w-[70%] ${
                message.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                <div className={`rounded-lg px-3 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {message.attachments && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-background/50 rounded">
                          <Paperclip className="w-3 h-3" />
                          <span className="text-xs">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <span className="text-xs text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input zone */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatBot;
