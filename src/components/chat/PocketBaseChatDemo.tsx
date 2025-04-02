
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePocketBase } from "@/hooks/usePocketBase";
import { Spinner } from "@/components/ui/spinner";
import { pb } from "@/integrations/pocketbase/client";
import type { RecordModel } from 'pocketbase';

interface ChatMessage extends RecordModel {
  content: string;
  sender: 'user' | 'agent' | 'assistant' | 'system';
  created: string;
}

export function PocketBaseChatDemo() {
  const [newMessage, setNewMessage] = useState('');
  const { 
    records: messages, 
    loading, 
    create: createMessage,
    isAuthenticated,
    login,
    register
  } = usePocketBase<ChatMessage>('chat_messages', {
    sort: 'created',
    autoSubscribe: true
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      await createMessage({
        content: newMessage,
        sender: 'user',
      });
      setNewMessage('');
      
      // Simulate agent response after 1 second
      setTimeout(async () => {
        await createMessage({
          content: `Response to: ${newMessage}`,
          sender: 'agent',
        });
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      if (isRegistering) {
        await register(email, password, password, name);
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto mt-10">
        <Card>
          <CardHeader>
            <CardTitle>{isRegistering ? 'Register' : 'Login'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isRegistering && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginLoading}>
                {loginLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                {isRegistering ? 'Register' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex justify-between">
          <span>PocketBase Chat</span>
          <Button variant="ghost" size="sm" onClick={() => pb.authStore.clear()}>
            Logout
          </Button>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(message.created).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
