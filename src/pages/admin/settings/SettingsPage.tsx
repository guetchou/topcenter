import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Json } from "@/integrations/supabase/types";

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  social_media: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  meta_settings: {
    title_suffix: string;
    default_meta_description: string;
    google_analytics_id?: string;
  };
}

export const SettingsPage = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: "",
    site_description: "",
    contact_email: "",
    social_media: {},
    meta_settings: {
      title_suffix: "",
      default_meta_description: "",
    }
  });

  const { data: existingSettings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_key', 'site_settings')
        .single();

      if (error) throw error;
      return data?.content as unknown as SiteSettings;
    }
  });

  useEffect(() => {
    if (existingSettings) {
      setSettings(existingSettings);
    }
  }, [existingSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('page_contents')
        .upsert({
          page_key: 'site_settings',
          title: 'Site Settings',
          content: settings as unknown as Json,
        });

      if (error) throw error;
      toast.success("Paramètres mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Une erreur est survenue");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <Button onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" />
          Enregistrer
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="meta">SEO & Métadonnées</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Nom du site</Label>
                <Input 
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    site_name: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Description du site</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    site_description: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email de contact</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    contact_email: e.target.value
                  }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_suffix">Suffixe du titre</Label>
                <Input
                  id="title_suffix"
                  value={settings.meta_settings.title_suffix}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    meta_settings: {
                      ...prev.meta_settings,
                      title_suffix: e.target.value
                    }
                  }))}
                  placeholder="ex: | Mon Site"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default_meta_description">Description meta par défaut</Label>
                <Textarea
                  id="default_meta_description"
                  value={settings.meta_settings.default_meta_description}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    meta_settings: {
                      ...prev.meta_settings,
                      default_meta_description: e.target.value
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google_analytics_id">ID Google Analytics</Label>
                <Input
                  id="google_analytics_id"
                  value={settings.meta_settings.google_analytics_id || ""}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    meta_settings: {
                      ...prev.meta_settings,
                      google_analytics_id: e.target.value
                    }
                  }))}
                  placeholder="ex: G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Réseaux sociaux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.social_media.facebook || ""}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social_media: {
                      ...prev.social_media,
                      facebook: e.target.value
                    }
                  }))}
                  placeholder="URL de votre page Facebook"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.social_media.twitter || ""}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social_media: {
                      ...prev.social_media,
                      twitter: e.target.value
                    }
                  }))}
                  placeholder="URL de votre compte Twitter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.social_media.instagram || ""}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social_media: {
                      ...prev.social_media,
                      instagram: e.target.value
                    }
                  }))}
                  placeholder="URL de votre compte Instagram"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={settings.social_media.linkedin || ""}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    social_media: {
                      ...prev.social_media,
                      linkedin: e.target.value
                    }
                  }))}
                  placeholder="URL de votre page LinkedIn"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
