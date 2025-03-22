
import { usePageContent } from "@/hooks/usePageContent";
import { ContactSection } from "@/components/sections/ContactSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

const Contact = () => {
  const { data: pageContent, isLoading } = usePageContent('contact');
  const { formatMessage } = useIntl();

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

  // Ensure the content structure exists with defaults for missing data
  const content = pageContent.content || {};
  const officeAddress = content.office_address || content.address || formatMessage({ id: "contact.address.default", defaultMessage: "Siège social, Brazzaville, Congo" });
  const phone = content.phone || formatMessage({ id: "contact.phone.default", defaultMessage: "+242 00 000 0000" });
  const email = content.email || formatMessage({ id: "contact.email.default", defaultMessage: "contact@topcenter.cg" });
  
  // Ensure hours is properly structured or provide defaults
  const hours = content.hours || {
    weekdays: formatMessage({ id: "contact.hours.weekdays", defaultMessage: "9h - 18h" }),
    saturday: formatMessage({ id: "contact.hours.saturday", defaultMessage: "10h - 15h" }),
    sunday: formatMessage({ id: "contact.hours.sunday", defaultMessage: "Fermé" })
  };

  return (
    <div className="min-h-screen">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">
          <FormattedMessage id="contact.title" defaultMessage="Contactez-nous" />
        </h1>
        <p className="text-muted-foreground mb-8">
          <FormattedMessage 
            id="contact.subtitle" 
            defaultMessage="Notre équipe est à votre disposition" 
          />
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0">
              <MapPin className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-base">
                <FormattedMessage id="contact.address.title" defaultMessage="Adresse" />
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
                <FormattedMessage id="contact.phone.title" defaultMessage="Téléphone" />
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
                <FormattedMessage id="contact.email.title" defaultMessage="Email" />
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
                <FormattedMessage id="contact.hours.title" defaultMessage="Horaires" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>
                  <FormattedMessage id="contact.hours.weekdays.label" defaultMessage="Lun-Ven" />: {hours.weekdays}
                </p>
                <p>
                  <FormattedMessage id="contact.hours.saturday.label" defaultMessage="Samedi" />: {hours.saturday}
                </p>
                <p>
                  <FormattedMessage id="contact.hours.sunday.label" defaultMessage="Dimanche" />: {hours.sunday}
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
