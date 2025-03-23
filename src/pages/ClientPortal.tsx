
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { LayoutGrid, FileText, FileStack, Calendar } from "lucide-react";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { ClientRequests } from "@/components/client/ClientRequests";
import { ClientDocuments } from "@/components/client/ClientDocuments";
import { ClientEvents } from "@/components/client/ClientEvents";

const ClientPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

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

        <TabsContent value="dashboard">
          <ClientDashboard />
        </TabsContent>

        <TabsContent value="requests">
          <ClientRequests />
        </TabsContent>

        <TabsContent value="documents">
          <ClientDocuments />
        </TabsContent>

        <TabsContent value="events">
          <ClientEvents />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;
