
import { ContactSection } from "@/components/sections/ContactSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  // Données statiques pour éviter les erreurs avec l'internationalisation
  const officeAddress = "Siège social, Brazzaville, Congo";
  const phone = "+242 00 000 0000";
  const email = "contact@topcenter.cg";
  const hours = {
    weekdays: "9h - 18h",
    saturday: "10h - 15h",
    sunday: "Fermé"
  };

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">
          Contactez-nous
        </h1>
        <p className="text-muted-foreground mb-8">
          Notre équipe est à votre disposition
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <MapPin className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">
                Adresse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {officeAddress}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <Phone className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">
                Téléphone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {phone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <Mail className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <Clock className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">
                Horaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>
                  Lun-Ven: {hours.weekdays}
                </p>
                <p>
                  Samedi: {hours.saturday}
                </p>
                <p>
                  Dimanche: {hours.sunday}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ContactSection />
    </div>
  );
};

export default Contact;
