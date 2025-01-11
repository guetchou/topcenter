import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Analytiques</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Appels totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,234</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Temps moyen d'appel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">5m 23s</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Taux de satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">95%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;