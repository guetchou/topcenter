import { ContactSection } from "@/components/sections/ContactSection";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="space-y-20">
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est disponible pour répondre à toutes vos questions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-20">
            <Card className="p-6">
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Notre adresse</h3>
              <p className="text-muted-foreground">
                123 Avenue de l'Indépendance
                <br />
                Brazzaville, Congo
              </p>
            </Card>

            <Card className="p-6">
              <Phone className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Téléphone</h3>
              <p className="text-muted-foreground">
                +242 23 456 789
                <br />
                +242 98 765 432
              </p>
            </Card>

            <Card className="p-6">
              <Mail className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-muted-foreground">
                contact@topcenter.cg
                <br />
                support@topcenter.cg
              </p>
            </Card>

            <Card className="p-6">
              <Clock className="w-12 h-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Horaires</h3>
              <p className="text-muted-foreground">
                Lundi - Vendredi: 8h - 18h
                <br />
                Samedi: 9h - 15h
              </p>
            </Card>
          </div>
        </div>
      </section>

      <ContactSection />

      <section className="py-20 bg-secondary/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Localisation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Retrouvez-nous facilement grâce à Google Maps
            </p>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63833.41834008579!2d15.241595!3d-4.269422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3130fe234b2f%3A0x4d934ea85820c8f3!2sBrazzaville%2C%20Congo!5e0!3m2!1sfr!2sfr!4v1647887844561!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;