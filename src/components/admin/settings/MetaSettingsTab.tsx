
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MetaSettingsProps {
  metaSettings: {
    title_suffix: string;
    default_meta_description: string;
    google_analytics_id?: string;
  };
  updateMetaSettings: (key: string, value: string) => void;
}

export const MetaSettingsTab: React.FC<MetaSettingsProps> = ({ 
  metaSettings, 
  updateMetaSettings 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO & Métadonnées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title_suffix">Suffixe du titre</Label>
          <Input
            id="title_suffix"
            value={metaSettings.title_suffix}
            onChange={(e) => updateMetaSettings('title_suffix', e.target.value)}
            placeholder="ex: | Mon Site"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="default_meta_description">Description meta par défaut</Label>
          <Textarea
            id="default_meta_description"
            value={metaSettings.default_meta_description}
            onChange={(e) => updateMetaSettings('default_meta_description', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="google_analytics_id">ID Google Analytics</Label>
          <Input
            id="google_analytics_id"
            value={metaSettings.google_analytics_id || ""}
            onChange={(e) => updateMetaSettings('google_analytics_id', e.target.value)}
            placeholder="ex: G-XXXXXXXXXX"
          />
        </div>
      </CardContent>
    </Card>
  );
};
