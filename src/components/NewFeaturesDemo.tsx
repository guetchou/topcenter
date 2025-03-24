
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';
import FuturisticNotificationBubble from '@/components/notifications/FuturisticNotificationBubble';
import { formatDateTime, formatRelativeTime } from '@/utils/dateFormatter';
import { isValidEmail } from '@/utils/validation';
import usePersistentState from '@/hooks/usePersistentState';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const NewFeaturesDemo = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [name, setName] = usePersistentState('demo-name', '');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleShowNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    setNotificationType(type);
    setShowNotification(true);
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      handleShowNotification('success');
    } else {
      handleShowNotification('error');
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelles fonctionnalités</CardTitle>
          <CardDescription>
            Démonstration des nouvelles fonctionnalités ajoutées au projet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Notifications</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleShowNotification('info')} variant="outline">Notification Info</Button>
              <Button onClick={() => handleShowNotification('success')} variant="outline">Notification Succès</Button>
              <Button onClick={() => handleShowNotification('warning')} variant="outline">Notification Avertissement</Button>
              <Button onClick={() => handleShowNotification('error')} variant="outline">Notification Erreur</Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Images responsives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveImage 
                src="/lovable-uploads/staff-tce.jpg" 
                alt="Staff TopCenter" 
                aspectRatio="16/9"
              />
              <ResponsiveImage 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                alt="Image Unsplash" 
                aspectRatio="16/9"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Formatage de dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Date formatée:</p>
                <p>{formatDateTime(new Date())}</p>
              </div>
              <div className="p-4 border rounded-md">
                <p className="text-sm text-muted-foreground mb-1">Date relative:</p>
                <p>{formatRelativeTime(new Date(Date.now() - 3600000))}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">État persistant</h3>
            <div className="p-4 border rounded-md">
              <label className="block text-sm font-medium mb-2">
                Votre nom (persiste au rechargement):
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Entrez votre nom"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Validation</h3>
            <form onSubmit={handleSubmit} className="p-4 border rounded-md">
              <label className="block text-sm font-medium mb-2">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={validateEmail}
                className={`w-full p-2 border rounded-md ${emailError ? 'border-red-500' : ''}`}
                placeholder="votre@email.com"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
              <Button type="submit" className="mt-4">Valider</Button>
            </form>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Ces fonctionnalités sont disponibles pour utilisation dans tout le projet.
          </p>
        </CardFooter>
      </Card>
      
      {/* ScrollToTop button is fixed in the corner */}
      <ScrollToTopButton />
      
      {/* Notifications */}
      {showNotification && (
        <FuturisticNotificationBubble
          message={
            notificationType === 'info' 
              ? "Ceci est une notification d'information"
              : notificationType === 'success'
              ? "L'opération a été effectuée avec succès!"
              : notificationType === 'warning'
              ? "Attention, cette action peut avoir des conséquences"
              : "Une erreur s'est produite, veuillez réessayer"
          }
          type={notificationType}
          duration={5000}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default NewFeaturesDemo;
