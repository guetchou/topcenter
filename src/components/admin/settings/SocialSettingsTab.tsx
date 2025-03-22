
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SocialSettingsProps {
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  updateSocialMedia: (key: string, value: string) => void;
}

export const SocialSettingsTab: React.FC<SocialSettingsProps> = ({ 
  socialMedia, 
  updateSocialMedia 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Réseaux sociaux</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={socialMedia.facebook || ""}
            onChange={(e) => updateSocialMedia('facebook', e.target.value)}
            placeholder="URL de votre page Facebook"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            value={socialMedia.twitter || ""}
            onChange={(e) => updateSocialMedia('twitter', e.target.value)}
            placeholder="URL de votre compte Twitter"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={socialMedia.instagram || ""}
            onChange={(e) => updateSocialMedia('instagram', e.target.value)}
            placeholder="URL de votre compte Instagram"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={socialMedia.linkedin || ""}
            onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
            placeholder="URL de votre page LinkedIn"
          />
        </div>
      </CardContent>
    </Card>
  );
};
