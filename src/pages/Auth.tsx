
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { DevModeAlert } from '@/components/auth/DevModeAlert';

const Auth = () => {
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
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Accédez à votre compte TopCenter ou créez-en un nouveau.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm from={from} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>
                  Rejoignez TopCenter et profitez de nos services de centre d'appel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterForm onSuccess={() => setActiveTab('login')} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
