
import { usePageContent } from "@/hooks/usePageContent";
import { ContactSection } from "@/components/sections/ContactSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  const { data: pageContent, isLoading } = usePageContent('contact');

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!pageContent) return null;

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">{pageContent.title}</h1>
        <p className="text-muted-foreground mb-8">{pageContent.description}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <MapPin className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">Adresse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {pageContent.content.office_address}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <Phone className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">Téléphone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {pageContent.content.phone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <Mail className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {pageContent.content.email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <Clock className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">Horaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Lun-Ven: {pageContent.content.hours.weekdays}</p>
                <p>Samedi: {pageContent.content.hours.saturday}</p>
                <p>Dimanche: {pageContent.content.hours.sunday}</p>
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
