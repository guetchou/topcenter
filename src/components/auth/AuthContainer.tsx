
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { DevModeAlert } from '@/components/auth/DevModeAlert';
import { AuthHeader } from '@/components/auth/AuthHeader';

export const AuthContainer = () => {
  const [activeTab, setActiveTab] = useState('login');
  const location = useLocation();
  
  // Extract redirect URL from location state or default to dashboard
  const from = location.state?.from?.pathname || '/';
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-md">
        <DevModeAlert />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <AuthHeader 
                title="Connexion" 
                description="Accédez à votre compte TopCenter ou créez-en un nouveau."
              />
              <LoginForm from={from} />
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <AuthHeader 
                title="Créer un compte" 
                description="Rejoignez TopCenter et profitez de nos services de centre d'appel."
              />
              <RegisterForm onSuccess={() => setActiveTab('login')} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
