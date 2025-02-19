import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SessionCard } from "@/components/training/SessionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import type { TrainingSession, TrainingStatistics } from "@/types/training";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userEnrollments, setUserEnrollments] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['training-sessions', statusFilter],
    queryFn: async () => {
      const baseQuery = supabase
        .from('training_sessions')
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          max_participants,
          status,
          materials_url,
          trainer_id,
          created_at,
          updated_at,
          trainer:agents(full_name, avatar_url),
          training_materials!left(
            id,
            session_id,
            title,
            description,
            content_type,
            content_url,
            order_index,
            created_at,
            updated_at
          ),
          enrollments:training_enrollments(id)
        `)
        .order('start_date', { ascending: true });

      if (statusFilter !== "all") {
        baseQuery.eq('status', statusFilter);
      }

      const { data, error } = await baseQuery;

      if (error) throw error;

      return (data as any[]).map(session => ({
        ...session,
        _count: {
          enrollments: session.enrollments?.length || 0
        }
      })) as TrainingSession[];
    }
  });

  useEffect(() => {
    const fetchUserEnrollments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) return;

      const { data: enrollments } = await supabase
        .from('training_enrollments')
        .select('session_id')
        .eq('agent_id', agent.id);

      if (enrollments) {
        setUserEnrollments(new Set(enrollments.map(e => e.session_id)));
      }
    };

    fetchUserEnrollments();
  }, []);

  const handleStartMaterial = async (materialId: string) => {
    toast({
      title: "Contenu en cours de chargement",
      description: "Vous allez être redirigé vers le contenu de formation",
    });
    navigate(`/training/content/${materialId}`);
  };

  const filteredSessions = sessions?.filter(session => {
    if (searchQuery && !session.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (dateFilter === "upcoming") {
      return new Date(session.start_date) > new Date();
    } else if (dateFilter === "past") {
      return new Date(session.end_date) < new Date();
    }

    return true;
  });

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
      <h1 className="text-3xl font-bold mb-8">Formation</h1>
      
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sessions totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{statistics.totalSessions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sessions terminées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{statistics.completedSessions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progression moyenne</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={statistics.averageProgress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {Math.round(statistics.averageProgress)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{statistics.totalEnrollments}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Label htmlFor="search">Rechercher</Label>
          <Input
            id="search"
            placeholder="Rechercher une session..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <option value="all">Tous</option>
            <option value="scheduled">Programmées</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="date">Période</Label>
          <Select
            value={dateFilter}
            onValueChange={setDateFilter}
          >
            <option value="all">Toutes</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passées</option>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredSessions?.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isEnrolled={userEnrollments.has(session.id)}
            onEnrollmentSuccess={(sessionId) => {
              setUserEnrollments(prev => new Set([...prev, sessionId]));
            }}
            onStartMaterial={handleStartMaterial}
          />
        ))}
      </div>
    </div>
  );
};

export default Training;
