import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { LogOut, User, Calendar, MessageSquare } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <img
                  src={profile?.avatar_url || "/placeholder.svg"}
                  alt={profile?.full_name || "Avatar"}
                  className="object-cover"
                />
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{profile?.full_name || "Utilisateur"}</h2>
                <p className="text-muted-foreground">{profile?.username || "Sans nom d'utilisateur"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Rendez-vous</h3>
                  <p className="text-muted-foreground">Prochains rendez-vous</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/appointments")}>
                Voir
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <MessageSquare className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Témoignages</h3>
                  <p className="text-muted-foreground">Gérer vos témoignages</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/testimonials")}>
                Voir
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;