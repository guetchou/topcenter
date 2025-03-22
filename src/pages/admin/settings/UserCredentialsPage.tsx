
import React from 'react';
import { UserCredentialsManager } from '@/components/admin/UserCredentialsManager';

export const UserCredentialsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestion des identifiants par défaut</h1>
      <p className="text-muted-foreground mb-8">
        Sur cette page, vous pouvez gérer les identifiants par défaut du système. Ces identifiants sont utilisés pour l'accès initial au système.
      </p>
      <UserCredentialsManager />
    </div>
  );
};

export default UserCredentialsPage;
