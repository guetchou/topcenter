
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, MessageSquare, BarChart3, BellRing, Mail, Calendar, Clock } from "lucide-react";

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
  }
};

export const ClientDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Appels"
          description="Résumé de vos appels"
          icon={<Phone className="h-5 w-5 text-primary" />}
          value={clientData.statistics.calls.success}
          total={clientData.statistics.calls.total}
          label="Taux de résolution"
        />

        <StatCard 
          title="Messages"
          description="Suivi de vos messages"
          icon={<MessageSquare className="h-5 w-5 text-primary" />}
          value={clientData.statistics.messages.answered}
          total={clientData.statistics.messages.total}
          label="Taux de réponse"
        />

        <StatCard 
          title="Factures"
          description="Statut de facturation"
          icon={<BarChart3 className="h-5 w-5 text-primary" />}
          value={clientData.statistics.invoices.paid}
          total={clientData.statistics.invoices.total}
          label="Taux de paiement"
        />
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
              <RequestItem
                icon={<BellRing className="h-5 w-5 text-primary" />}
                title="Demande de support #ST-2023-42" 
                date="12/10/2023"
                status="En attente"
                statusColor="amber"
              />
              
              <RequestItem
                icon={<Mail className="h-5 w-5 text-primary" />}
                title="Demande d'information #INF-2023-15" 
                date="14/10/2023"
                status="En traitement"
                statusColor="blue"
              />
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
                <EventItem 
                  key={event.id}
                  title={event.title}
                  date={event.date}
                  time={event.time}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: number;
  total: number;
  label: string;
}

const StatCard = ({ title, description, icon, value, total, label }: StatCardProps) => {
  const percentage = Math.round((value / total) * 100);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{value}/{total}</div>
        <Progress value={percentage} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">{label}: {percentage}%</p>
      </CardContent>
    </Card>
  );
};

interface RequestItemProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  status: string;
  statusColor: string;
}

const RequestItem = ({ icon, title, date, status, statusColor }: RequestItemProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">Ouvert le {date}</div>
        </div>
      </div>
      <div className={`px-2 py-1 bg-${statusColor}-100 text-${statusColor}-800 rounded text-xs font-medium`}>
        {status}
      </div>
    </div>
  );
};

interface EventItemProps {
  title: string;
  date: string;
  time: string;
}

const EventItem = ({ title, date, time }: EventItemProps) => {
  return (
    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-primary" />
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{date}</div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        {time}
      </div>
    </div>
  );
};
