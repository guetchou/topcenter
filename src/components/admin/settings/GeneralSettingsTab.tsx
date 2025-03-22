
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface GeneralSettingsProps {
  settings: {
    site_name: string;
    site_description: string;
    contact_email: string;
  };
  updateSettings: (key: string, value: string) => void;
}

export const GeneralSettingsTab: React.FC<GeneralSettingsProps> = ({ 
  settings, 
  updateSettings 
}) => {
  return (
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
            onChange={(e) => updateSettings('site_name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="site_description">Description du site</Label>
          <Textarea
            id="site_description"
            value={settings.site_description}
            onChange={(e) => updateSettings('site_description', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_email">Email de contact</Label>
          <Input
            id="contact_email"
            type="email"
            value={settings.contact_email}
            onChange={(e) => updateSettings('contact_email', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
