
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, FileText, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TrainingMaterial } from "@/types/training";

const TrainingContent = () => {
  const { materialId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: material, isLoading } = useQuery({
    queryKey: ['training-material', materialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_materials')
        .select(`
          *,
          session:training_sessions(
            id,
            title
          )
        `)
        .eq('id', materialId)
        .single();

      if (error) throw error;
      return data as TrainingMaterial & {
        session: { id: string; title: string; }
      };
    },
    enabled: !!materialId
  });

  useEffect(() => {
    const updateProgress = async () => {
      if (!material) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) return;

      const { data: enrollment } = await supabase
        .from('training_enrollments')
        .select('id')
        .eq('session_id', material.session.id)
        .eq('agent_id', agent.id)
        .single();

      if (!enrollment) return;

      const { error } = await supabase
        .from('training_progress')
        .upsert({
          enrollment_id: enrollment.id,
          material_id: material.id,
          completion_status: 'in_progress',
          last_accessed_at: new Date().toISOString()
        }, {
          onConflict: 'enrollment_id,material_id'
        });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la progression",
          variant: "destructive"
        });
      }
    };

    updateProgress();
  }, [material, toast]);

  const handleComplete = async () => {
    if (!material) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!agent) return;

    const { data: enrollment } = await supabase
      .from('training_enrollments')
      .select('id')
      .eq('session_id', material.session.id)
      .eq('agent_id', agent.id)
      .single();

    if (!enrollment) return;

    const { error } = await supabase
      .from('training_progress')
      .upsert({
        enrollment_id: enrollment.id,
        material_id: material.id,
        completion_status: 'completed',
        completed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      }, {
        onConflict: 'enrollment_id,material_id'
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme terminé",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Contenu marqué comme terminé"
      });
      navigate(`/training`);
    }
  };

  const getContentIcon = () => {
    switch (material?.content_type) {
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'document':
        return <FileText className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
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

  if (!material) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">Contenu non trouvé</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/training')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux formations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/training')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux formations
        </Button>
        <h1 className="text-2xl font-semibold">{material.session.title}</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          {getContentIcon()}
          <CardTitle>{material.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {material.description && (
            <p className="text-muted-foreground">{material.description}</p>
          )}

          <div className="aspect-video rounded-lg border bg-muted">
            {material.content_type === 'video' ? (
              <iframe
                src={material.content_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <iframe
                src={material.content_url}
                className="w-full h-full"
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleComplete}>
              Marquer comme terminé
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingContent;
