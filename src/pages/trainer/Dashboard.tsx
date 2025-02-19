
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, BookOpen, PlusCircle } from "lucide-react";
import type { TrainingSession } from "@/types/training";

const TrainerDashboard = () => {
  const { toast } = useToast();
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    maxParticipants: ""
  });

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ['trainer-sessions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) throw new Error("Agent non trouvé");

      const { data, error } = await supabase
        .from('training_sessions')
        .select(`
          *,
          _count {
            enrollments: training_enrollments(count)
          }
        `)
        .eq('trainer_id', agent.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as TrainingSession[];
    }
  });

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) throw new Error("Agent non trouvé");

      const { error } = await supabase
        .from('training_sessions')
        .insert({
          title: newSession.title,
          description: newSession.description,
          start_date: newSession.startDate,
          end_date: newSession.endDate,
          max_participants: parseInt(newSession.maxParticipants),
          trainer_id: agent.id,
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Session créée",
        description: "La session de formation a été créée avec succès"
      });

      setShowNewSession(false);
      setNewSession({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        maxParticipants: ""
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la session",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord formateur</h1>
        <Button onClick={() => setShowNewSession(!showNewSession)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Nouvelle session
        </Button>
      </div>

      {showNewSession && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Créer une nouvelle session</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={newSession.title}
                    onChange={e => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newSession.description}
                    onChange={e => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={newSession.startDate}
                      onChange={e => setNewSession(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={newSession.endDate}
                      onChange={e => setNewSession(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Nombre maximum de participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newSession.maxParticipants}
                    onChange={e => setNewSession(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Créer la session</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions?.map((session) => (
          <Card key={session.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{session.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {session.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(session.start_date).toLocaleDateString()} - {new Date(session.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {session._count.enrollments} / {session.max_participants || "∞"} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {session.materials_url?.length || 0} supports de cours
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Gérer la session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainerDashboard;
