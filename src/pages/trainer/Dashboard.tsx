import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Calendar, BookOpen, PlusCircle, Upload, Pencil, Trash2 } from "lucide-react";
import type { TrainingSession, TrainingMaterial } from "@/types/training";

const TrainerDashboard = () => {
  const { toast } = useToast();
  const [showNewSession, setShowNewSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<TrainingMaterial | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    contentType: "document",
    contentUrl: ""
  });
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    maxParticipants: ""
  });
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);

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
        .eq('trainer_id', agent.id)
        .order('start_date', { ascending: false });

      if (error) throw error;

      return (data as any[]).map(session => ({
        ...session,
        _count: {
          enrollments: session.enrollments?.length || 0
        }
      })) as TrainingSession[];
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

  const handleAddMaterial = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('training_materials')
        .insert({
          session_id: sessionId,
          title: newMaterial.title,
          description: newMaterial.description,
          content_type: newMaterial.contentType,
          content_url: newMaterial.contentUrl,
          order_index: 0
        });

      if (error) throw error;

      toast({
        title: "Support ajouté",
        description: "Le support de cours a été ajouté avec succès"
      });

      setSelectedSession(null);
      setNewMaterial({
        title: "",
        description: "",
        contentType: "document",
        contentUrl: ""
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le support",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMaterial = async (material: TrainingMaterial) => {
    try {
      const { error } = await supabase
        .from('training_materials')
        .update({
          title: newMaterial.title,
          description: newMaterial.description,
          content_url: newMaterial.contentUrl
        })
        .eq('id', material.id);

      if (error) throw error;

      toast({
        title: "Support modifié",
        description: "Le support de cours a été modifié avec succès"
      });

      setEditingMaterial(null);
      setNewMaterial({
        title: "",
        description: "",
        contentType: "document",
        contentUrl: ""
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le support",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce support de cours ?")) return;

    try {
      const { error } = await supabase
        .from('training_materials')
        .delete()
        .eq('id', materialId);

      if (error) throw error;

      toast({
        title: "Support supprimé",
        description: "Le support de cours a été supprimé avec succès"
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le support",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!editingSession) return;

      const { error } = await supabase
        .from('training_sessions')
        .update({
          title: newSession.title,
          description: newSession.description,
          start_date: newSession.startDate,
          end_date: newSession.endDate,
          max_participants: parseInt(newSession.maxParticipants)
        })
        .eq('id', editingSession.id);

      if (error) throw error;

      toast({
        title: "Session modifiée",
        description: "La session de formation a été modifiée avec succès"
      });

      setEditingSession(null);
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
        description: "Impossible de modifier la session",
        variant: "destructive"
      });
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette session ?")) return;

    try {
      const { error } = await supabase
        .from('training_sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Session annulée",
        description: "La session a été annulée avec succès"
      });

      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la session",
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
          <Card key={session.id}>
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
                      {session.training_materials?.length || 0} supports de cours
                    </span>
                  </div>
                </div>
                
                {selectedSession === session.id && !editingMaterial ? (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="materialTitle">Titre du support</Label>
                      <Input
                        id="materialTitle"
                        value={newMaterial.title}
                        onChange={e => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Introduction à la formation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="materialDescription">Description</Label>
                      <Input
                        id="materialDescription"
                        value={newMaterial.description}
                        onChange={e => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description du contenu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentUrl">URL du contenu</Label>
                      <Input
                        id="contentUrl"
                        value={newMaterial.contentUrl}
                        onChange={e => setNewMaterial(prev => ({ ...prev, contentUrl: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAddMaterial(session.id)}
                        className="flex-1"
                      >
                        Ajouter
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedSession(null)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : editingMaterial ? (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="editMaterialTitle">Titre du support</Label>
                      <Input
                        id="editMaterialTitle"
                        value={newMaterial.title}
                        onChange={e => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editMaterialDescription">Description</Label>
                      <Input
                        id="editMaterialDescription"
                        value={newMaterial.description}
                        onChange={e => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editContentUrl">URL du contenu</Label>
                      <Input
                        id="editContentUrl"
                        value={newMaterial.contentUrl}
                        onChange={e => setNewMaterial(prev => ({ ...prev, contentUrl: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleUpdateMaterial(editingMaterial)}
                        className="flex-1"
                      >
                        Enregistrer
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingMaterial(null);
                          setNewMaterial({
                            title: "",
                            description: "",
                            contentType: "document",
                            contentUrl: ""
                          });
                        }}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedSession(session.id)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Ajouter un support
                    </Button>
                  </div>
                )}

                {session.training_materials && session.training_materials.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Supports de cours</h3>
                    <div className="space-y-2">
                      {session.training_materials.map((material) => (
                        <div 
                          key={material.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg"
                        >
                          <span>{material.title}</span>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setEditingMaterial(material);
                                setNewMaterial({
                                  title: material.title,
                                  description: material.description || "",
                                  contentType: material.content_type,
                                  contentUrl: material.content_url
                                });
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteMaterial(material.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(material.content_url, '_blank')}
                            >
                              Voir
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingSession(session);
                    setNewSession({
                      title: session.title,
                      description: session.description || "",
                      startDate: session.start_date,
                      endDate: session.end_date,
                      maxParticipants: session.max_participants?.toString() || ""
                    });
                  }}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                {session.status === 'scheduled' && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelSession(session.id)}
                  >
                    Annuler la session
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainerDashboard;
