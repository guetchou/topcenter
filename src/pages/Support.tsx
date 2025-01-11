import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Support = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Support</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Centre d'aide</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Trouvez de l'aide et contactez notre équipe de support.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;