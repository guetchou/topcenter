import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Training = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Formation</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Modules de formation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accédez à nos ressources de formation et développez vos compétences.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Training;