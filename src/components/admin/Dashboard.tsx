import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Server, 
  Activity, 
  Settings, 
  FileText, 
  Database,
  BarChart3,
  Shield
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Utilisateurs actifs",
      value: "124",
      icon: Users,
      trend: "+12%",
      color: "text-blue-600"
    },
    {
      title: "Services actifs",
      value: "5",
      icon: Server,
      trend: "100%",
      color: "text-green-600"
    },
    {
      title: "Requêtes/jour",
      value: "2,847",
      icon: Activity,
      trend: "+23%",
      color: "text-purple-600"
    },
    {
      title: "Uptime",
      value: "99.9%",
      icon: Shield,
      trend: "Stable",
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Gestion des utilisateurs",
      description: "Ajouter, modifier ou supprimer des utilisateurs",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "Configuration système",
      description: "Paramètres généraux de l'application",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-green-500"
    },
    {
      title: "Base de données",
      description: "Gérer les données et collections",
      icon: Database,
      href: "/admin/pocketbase",
      color: "bg-purple-500"
    },
    {
      title: "Rapports",
      description: "Générer et consulter les rapports",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name || 'Admin'}
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {user?.role === 'admin' ? 'Super Admin' : 'Administrateur'}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.trend} par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-sm">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  {action.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Nouvel utilisateur enregistré", time: "Il y a 5 min", type: "user" },
                { action: "Sauvegarde automatique effectuée", time: "Il y a 15 min", type: "system" },
                { action: "Déploiement réussi", time: "Il y a 1h", type: "deploy" },
                { action: "Configuration mise à jour", time: "Il y a 2h", type: "settings" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'system' ? 'bg-green-500' :
                    activity.type === 'deploy' ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-foreground">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Statistiques système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Utilisation CPU</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Utilisation mémoire</span>
                <span className="text-sm font-medium">62%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stockage</span>
                <span className="text-sm font-medium">34%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '34%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;