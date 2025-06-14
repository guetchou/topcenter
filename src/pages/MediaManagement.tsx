
import React from 'react';
import { MediaManager } from '@/components/MediaManager';

export default function MediaManagement() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Gestion des médias</h1>
        <p className="text-muted-foreground">
          Uploadez et gérez tous vos fichiers, images, vidéos et documents
        </p>
      </div>
      
      <MediaManager />
    </div>
  );
}
