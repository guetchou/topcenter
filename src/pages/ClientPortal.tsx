
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  LineChart, 
  BarChart, 
  ClipboardList, 
  Settings, 
  FileText, 
  Phone, 
  Calendar, 
  Bell, 
  Clock
} from "lucide-react";
import { progress } from "@/components/ui/progress";

// Mock data - In a real app, this would come from your backend
const mockServiceStats = [
  { name: "Appels", value: 128, change: "+12%", icon: Phone },
  { name: "Tickets", value: 45, change: "-5%", icon: ClipboardList },
  { name: "Rendez-vous", value: 23, change: "+8%", icon: Calendar },
];

const mockRecentRequests = [
  { id: "REQ-2023-123", title: "Support technique", status: "En cours", date: "2023-10-15", priority: "Haute" },
  { id: "REQ-2023-122", title: "Question facturation", status: "Résolu", date: "2023-10-12", priority: "Normale" },
  { id: "REQ-2023-121", title: "Mise à jour service", status: "En attente", date: "2023-10-10", priority: "Basse" },
];

const mockUpcomingEvents = [
  { id: 1, title: "Maintenance planifiée", date: "2023-10-25", time: "14:00" },
  { id: 2, title: "Webinaire: Nouvelles fonctionnalités", date: "2023-10-30", time: "10:00" },
];

const ClientPortal = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNewRequest = () => {
    toast({
      title: "Nouvelle demande",
      description: "Votre demande a été créée avec succès.",
    });
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portail Client</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.user_metadata?.name || "Client"} - Accédez à vos services et gérez vos demandes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleNewRequest}>
            Nouvelle demande
          </Button>
          <Button variant="default" size="sm">
            Contacter support
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto gap-1">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LineChart className="h-4 w-4 mr-2" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="services">
            <BarChart className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <ClipboardList className="h-4 w-4 mr-2" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Service Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockServiceStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center">
                  <div className="p-2 rounded-full bg-primary/10 mr-4">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <div className="flex items-baseline mt-1">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <span className={`text-xs ml-2 ${
                        stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5" />
                Demandes récentes
              </CardTitle>
              <CardDescription>
                Suivi de vos demandes et tickets récents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-muted-foreground">
                      <th className="text-left p-2">Référence</th>
                      <th className="text-left p-2">Titre</th>
                      <th className="text-left p-2">Statut</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Priorité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRecentRequests.map((request, index) => (
                      <tr key={index} className="border-t hover:bg-muted/50 transition-colors">
                        <td className="p-2 text-sm font-medium">{request.id}</td>
                        <td className="p-2 text-sm">{request.title}</td>
                        <td className="p-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            request.status === 'Résolu' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : request.status === 'En cours'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="p-2 text-sm">{request.date}</td>
                        <td className="p-2">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            request.priority === 'Haute' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                              : request.priority === 'Normale'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {request.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="pt-0 justify-center border-t">
              <Button variant="link" size="sm">Voir toutes les demandes</Button>
            </CardFooter>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Événements à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockUpcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start p-2 hover:bg-muted/50 rounded-md transition-colors">
                    <div className="p-2 rounded-full bg-primary/10 mr-4">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} à {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Vos Services</CardTitle>
              <CardDescription>
                Consultez et gérez tous les services auxquels vous êtes abonné
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Fonctionnalité en cours de développement
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardHeader>
              <CardTitle>Tickets & Demandes</CardTitle>
              <CardDescription>
                Gérez toutes vos demandes d'assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Fonctionnalité en cours de développement
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Accédez à vos factures et documents importants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Fonctionnalité en cours de développement
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
              <CardDescription>
                Gérez vos préférences et informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Fonctionnalité en cours de développement
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;
