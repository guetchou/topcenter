
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrainingSession {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  max_participants: number | null;
  status: string;
  materials_url: string[] | null;
  trainer: {
    full_name: string;
    avatar_url: string | null;
  };
  _count: {
    enrollments: number;
  };
}

const Training = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEnrollments, setUserEnrollments] = useState<Set<string>>(new Set());

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['training-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
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
          trainer:agents(full_name, avatar_url),
          _count { enrollments:training_enrollments_count }
        `)
        .eq('status', 'scheduled')
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Transform the data to match the expected type
      return (data as any[]).map(session => ({
        ...session,
        _count: {
          enrollments: session._count?.enrollments || 0
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

  const handleEnroll = async (sessionId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!agent) {
      toast({
        title: "Erreur",
        description: "Agent non trouvé",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('training_enrollments')
      .insert({
        session_id: sessionId,
        agent_id: agent.id
      });

    if (!error) {
      setUserEnrollments(prev => new Set([...prev, sessionId]));
      toast({
        title: "Succès",
        description: "Inscription à la formation réussie",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire à la formation",
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
      <h1 className="text-3xl font-bold mb-8">Formation</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions?.map((session) => (
          <Card key={session.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{session.title}</CardTitle>
                <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
                  {session.status === 'scheduled' ? 'Programmée' : 'Terminée'}
                </Badge>
              </div>
              <CardDescription>{session.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {format(new Date(session.start_date), "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {session._count.enrollments}/{session.max_participants || '∞'} participants
                  </span>
                </div>

                {session.materials_url && session.materials_url.length > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <span>{session.materials_url.length} ressources disponibles</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Button 
                className="w-full"
                variant={userEnrollments.has(session.id) ? "secondary" : "default"}
                disabled={userEnrollments.has(session.id)}
                onClick={() => handleEnroll(session.id)}
              >
                {userEnrollments.has(session.id) ? 'Déjà inscrit' : "S'inscrire"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Training;
