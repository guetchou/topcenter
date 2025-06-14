
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChatBot } from '@/components/ChatBot';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  Phone,
  Monitor,
  Settings,
  BarChart3
} from 'lucide-react';

export default function ChatBotDemo() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const handleTransferToHuman = () => {
    setActiveAgent('Agent Sophie Martin');
  };

  const stats = [
    {
      label: 'Conversations actives',
      value: '23',
      icon: MessageSquare,
      color: 'text-blue-500'
    },
    {
      label: 'Taux de résolution IA',
      value: '78%',
      icon: Bot,
      color: 'text-green-500'
    },
    {
      label: 'Agents disponibles',
      value: '12',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      label: 'Temps de réponse moyen',
      value: '2.3s',
      icon: BarChart3,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Chat Bot & Support Client</h1>
        <p className="text-muted-foreground">
          Démonstration de notre système de chat intelligent avec transfert vers agents humains
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Bot Demo */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat Bot en action
                  </CardTitle>
                  <CardDescription>
                    Testez notre assistant virtuel intelligent
                  </CardDescription>
                </div>
                {activeAgent && (
                  <Badge variant="default" className="bg-green-500">
                    Connecté à {activeAgent}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ChatBot 
                onTransferToHuman={handleTransferToHuman}
                showControls={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Panneau de contrôle */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Panneau de contrôle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Agents en ligne</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Sophie Martin</span>
                    <Badge variant="default" className="bg-green-500">En ligne</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Jean Dupont</span>
                    <Badge variant="default" className="bg-green-500">En ligne</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Marie Claire</span>
                    <Badge variant="secondary">Occupé</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Actions rapides</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler un superviseur
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres du bot
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  IA contextuelle TopCenter
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Transfert automatique vers agents
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Upload de fichiers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Messages vocaux
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Historique des conversations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Réponses en temps réel
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
