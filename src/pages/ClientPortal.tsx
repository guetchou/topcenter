
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, FileText, BarChart3, MessageSquare, Mail, Phone, LayoutGrid, FileStack, BellRing } from "lucide-react";

const ClientPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Données simulées pour le portail client
  const clientData = {
    id: "client-001",
    pendingRequests: 2,
    completedRequests: 8,
    upcomingEvents: [
      { id: 1, title: "Réunion conseil", date: "2023-10-15", time: "14:00" },
      { id: 2, title: "Entretien téléphonique", date: "2023-10-18", time: "10:30" }
    ],
    statistics: {
      calls: { total: 42, success: 38 },
      messages: { total: 76, answered: 65 },
      invoices: { total: 12, paid: 10 }
    },
    documents: [
      { id: 101, name: "Contrat de service", date: "2023-09-01", type: "pdf" },
      { id: 102, name: "Facture #F20230915", date: "2023-09-15", type: "pdf" },
      { id: 103, name: "Rapport mensuel", date: "2023-09-30", type: "xlsx" }
    ]
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Portail Client</h1>
        <p className="text-muted-foreground">
          Bienvenue {user?.email || 'Cher client'}, accédez à vos services et informations
        </p>
      </div>

      <Tabs defaultValue="dashboard" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Tableau de bord
          </TabsTrigger>
          <TabsTrigger value="requests">
            <FileText className="h-4 w-4 mr-2" />
            Demandes
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileStack className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Événements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Appels
                </CardTitle>
                <CardDescription>Résumé de vos appels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{clientData.statistics.calls.success}/{clientData.statistics.calls.total}</div>
                <Progress value={(clientData.statistics.calls.success / clientData.statistics.calls.total) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">Taux de résolution: {Math.round((clientData.statistics.calls.success / clientData.statistics.calls.total) * 100)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Messages
                </CardTitle>
                <CardDescription>Suivi de vos messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{clientData.statistics.messages.answered}/{clientData.statistics.messages.total}</div>
                <Progress value={(clientData.statistics.messages.answered / clientData.statistics.messages.total) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">Taux de réponse: {Math.round((clientData.statistics.messages.answered / clientData.statistics.messages.total) * 100)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Factures
                </CardTitle>
                <CardDescription>Statut de facturation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{clientData.statistics.invoices.paid}/{clientData.statistics.invoices.total}</div>
                <Progress value={(clientData.statistics.invoices.paid / clientData.statistics.invoices.total) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">Taux de paiement: {Math.round((clientData.statistics.invoices.paid / clientData.statistics.invoices.total) * 100)}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Autres composants du tableau de bord */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demandes en cours */}
            <Card>
              <CardHeader>
                <CardTitle>Demandes en cours</CardTitle>
                <CardDescription>Vous avez {clientData.pendingRequests} demande(s) en attente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <BellRing className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Demande de support #ST-2023-42</div>
                        <div className="text-sm text-muted-foreground">Ouvert le 12/10/2023</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">En attente</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Demande d'information #INF-2023-15</div>
                        <div className="text-sm text-muted-foreground">Ouvert le 14/10/2023</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">En traitement</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Événements à venir */}
            <Card>
              <CardHeader>
                <CardTitle>Événements à venir</CardTitle>
                <CardDescription>Vos prochains rendez-vous</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientData.upcomingEvents.map(event => (
                    <div key={event.id} className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">{event.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {event.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des demandes</CardTitle>
              <CardDescription>Suivez l'avancement de vos demandes de service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p className="text-muted-foreground">Contenu des demandes en développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Accédez à vos documents importants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p className="text-muted-foreground">Liste des documents en développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des événements</CardTitle>
              <CardDescription>Consultez vos rendez-vous et événements à venir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-10">
                <p className="text-muted-foreground">Calendrier des événements en développement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;
