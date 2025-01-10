import { Button } from "@/components/ui/button";
import { Phone, Mail, FileText } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8 rounded-lg border bg-card">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Contact Support"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+242 06 000 0000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>contact@topcenter.cg</span>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-lg border bg-card">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              alt="Services Image"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <div className="space-y-4">
              <Button className="w-full" size="lg">
                <FileText className="w-4 h-4 mr-2" />
                Demander un devis
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Nous appeler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};