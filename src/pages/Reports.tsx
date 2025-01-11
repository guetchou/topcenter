import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Rapports</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rapports disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Consultez et générez vos rapports d'activité.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;