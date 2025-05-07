
import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p>Veuillez vous connecter pour voir votre profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informations utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm font-medium">Nom:</p>
            <p>{user.name}</p>
            <p className="text-sm font-medium">Email:</p>
            <p>{user.email}</p>
            <p className="text-sm font-medium">Rôle:</p>
            <p>{user.role}</p>
          </div>
          <div className="pt-4">
            <Button variant="destructive" onClick={logout}>
              Se déconnecter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
