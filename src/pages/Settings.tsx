import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Gérez vos préférences et paramètres de compte.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;