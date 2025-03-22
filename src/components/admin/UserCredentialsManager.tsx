
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";

// Liste des identifiants par défaut
const defaultCredentials = [
  { role: 'master_admin', email: 'master@topcenter.app', password: 'password123' },
  { role: 'super_admin', email: 'super@topcenter.app', password: 'password123' },
  { role: 'admin', email: 'admin@topcenter.app', password: 'password123' },
  { role: 'commercial_agent', email: 'commercial@topcenter.app', password: 'password123' },
  { role: 'support_agent', email: 'support@topcenter.app', password: 'password123' },
  { role: 'client', email: 'client@topcenter.app', password: 'password123' },
];

interface CredentialCardProps {
  role: string;
  email: string;
  password: string;
  onPasswordChange: (newPassword: string) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ role, email, password, onPasswordChange }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success("Email copié dans le presse-papier");
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    toast.success("Mot de passe copié dans le presse-papier");
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    onPasswordChange(newPassword);
    setIsChangingPassword(false);
    setNewPassword('');
    toast.success("Mot de passe mis à jour");
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'master_admin': return 'Master Admin';
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'commercial_agent': return 'Agent Commercial';
      case 'support_agent': return 'Agent Support';
      case 'client': return 'Client';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'master_admin': return 'border-purple-600';
      case 'super_admin': return 'border-red-500';
      case 'admin': return 'border-blue-500';
      case 'commercial_agent': return 'border-green-500';
      case 'support_agent': return 'border-orange-500';
      case 'client': return 'border-gray-500';
      default: return 'border-gray-200';
    }
  };

  return (
    <Card className={`mb-4 ${getRoleColor(role)}`} style={{ borderWidth: '2px' }}>
      <CardHeader>
        <CardTitle>{getRoleLabel(role)}</CardTitle>
        <CardDescription>Identifiants de connexion</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Email:</Label>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-muted px-2 py-1 rounded">{email}</span>
            <Button variant="outline" size="icon" onClick={handleCopyEmail}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!isChangingPassword ? (
          <div className="flex items-center justify-between">
            <Label>Mot de passe:</Label>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-muted px-2 py-1 rounded">
                {password.replace(/./g, '•')}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopyPassword}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Nouveau mot de passe:</Label>
            <div className="flex gap-2">
              <Input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Nouveau mot de passe"
              />
              <Button onClick={handlePasswordChange}>Enregistrer</Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant={isChangingPassword ? "outline" : "default"} 
          onClick={() => setIsChangingPassword(!isChangingPassword)}
          className="w-full"
        >
          {isChangingPassword ? "Annuler" : "Changer le mot de passe"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const UserCredentialsManager: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [credentials, setCredentials] = useState(defaultCredentials);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (email: string, newPassword: string) => {
    // Dans une vraie application, il faudrait appeler une API pour changer le mot de passe
    // Pour le moment, on simule le changement localement
    setCredentials(prev => 
      prev.map(cred => 
        cred.email === email 
          ? { ...cred, password: newPassword } 
          : cred
      )
    );
  };

  const handleResetCredentials = () => {
    setIsLoading(true);
    // Simulation d'une opération asynchrone
    setTimeout(() => {
      setCredentials(defaultCredentials);
      setIsLoading(false);
      toast.success("Identifiants réinitialisés avec succès");
    }, 1000);
  };

  const filteredCredentials = selectedRole === "all" 
    ? credentials 
    : credentials.filter(cred => cred.role === selectedRole);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Identifiants</h1>
        <Button 
          onClick={handleResetCredentials} 
          variant="outline" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Réinitialisation...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser les identifiants
            </>
          )}
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="role-filter">Filtrer par rôle:</Label>
        <Select 
          value={selectedRole} 
          onValueChange={setSelectedRole}
        >
          <SelectTrigger id="role-filter" className="w-full md:w-[200px]">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="master_admin">Master Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="commercial_agent">Agent Commercial</SelectItem>
            <SelectItem value="support_agent">Agent Support</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCredentials.map((cred) => (
          <CredentialCard 
            key={cred.email}
            role={cred.role}
            email={cred.email}
            password={cred.password}
            onPasswordChange={(newPassword) => handlePasswordChange(cred.email, newPassword)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserCredentialsManager;
