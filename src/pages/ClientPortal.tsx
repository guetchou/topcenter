import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientPortal = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Portail Client</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue sur votre espace client</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accédez à vos services et suivez vos demandes en temps réel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientPortal;