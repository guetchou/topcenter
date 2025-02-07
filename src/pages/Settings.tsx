
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun, Globe, Bell } from "lucide-react";

interface UserPreferences {
  theme: string;
  language: string;
  notifications_enabled: boolean;
  auto_translate: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    language: 'fr',
    notifications_enabled: true,
    auto_translate: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setPreferences(data);
      }
      setLoading(false);
    };

    loadPreferences();
  }, [navigate]);

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        [key]: value
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Préférences mises à jour"
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
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thème sombre</Label>
                <div className="text-sm text-muted-foreground">
                  Basculer entre le thème clair et sombre
                </div>
              </div>
              <Switch
                checked={preferences.theme === 'dark'}
                onCheckedChange={(checked) => 
                  updatePreference('theme', checked ? 'dark' : 'light')
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Langue et Traduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Langue de l'interface</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => updatePreference('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Traduction automatique</Label>
                <div className="text-sm text-muted-foreground">
                  Traduire automatiquement les messages des clients
                </div>
              </div>
              <Switch
                checked={preferences.auto_translate}
                onCheckedChange={(checked) => 
                  updatePreference('auto_translate', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activer les notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Recevoir des notifications pour les nouveaux messages et événements
                </div>
              </div>
              <Switch
                checked={preferences.notifications_enabled}
                onCheckedChange={(checked) => 
                  updatePreference('notifications_enabled', checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
