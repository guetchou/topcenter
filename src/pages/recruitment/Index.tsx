import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Recruitment = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simuler l'envoi du formulaire
    toast({
      title: "Candidature envoyée",
      description: "Nous vous contacterons bientôt pour la suite du processus.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      message: ""
    });
  };

  const positions = [
    {
      title: "Agent Call Center",
      description: "Service client et support technique",
      requirements: ["Français courant", "Expérience en service client", "Disponibilité 24/7"]
    },
    {
      title: "Superviseur d'équipe",
      description: "Gestion et formation des équipes",
      requirements: ["3 ans d'expérience minimum", "Leadership", "Gestion d'équipe"]
    },
    {
      title: "Livreur",
      description: "Livraison des commandes clients",
      requirements: ["Permis de conduire", "Connaissance de la ville", "Disponibilité"]
    }
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Rejoignez notre équipe</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Postes disponibles</h2>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{position.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{position.description}</p>
                  <h4 className="font-semibold mb-2">Prérequis :</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {position.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Postuler</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nom complet"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
            <Input
              placeholder="Poste souhaité"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              required
            />
            <Input
              placeholder="Années d'expérience"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              required
            />
            <Textarea
              placeholder="Message / Motivation"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
            <Button type="submit" className="w-full">
              Envoyer ma candidature
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;