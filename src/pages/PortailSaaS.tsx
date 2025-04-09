
import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  CreditCard, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle, 
  Check, 
  ShieldCheck, 
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail, isValidPhoneNumber, validatePassword } from "@/utils/validation";

export default function PortailSaaS() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [paymentProvider, setPaymentProvider] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignUpSuccess, setShowSignUpSuccess] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  
  // Formulaire d'inscription
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      company: "",
      address: "",
      city: ""
    },
  });

  // Formulaire de connexion
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const plans = {
    starter: {
      title: "Pack Starter",
      price: "5 000",
      currency: "FCFA",
      period: "mois",
      description: "Idéal pour les petites entreprises et les entrepreneurs individuels",
      features: [
        "Email professionnel",
        "Mini site web responsive",
        "CRM basique (gestion de contacts)",
        "Support WhatsApp 8h-18h",
        "1 utilisateur inclus"
      ],
      recommended: false,
      color: "bg-blue-100"
    },
    pro: {
      title: "Pack Pro",
      price: "15 000",
      currency: "FCFA",
      period: "mois",
      description: "Solution complète pour les PME en croissance",
      features: [
        "CRM complet avec automatisations",
        "ERP light (facturation, inventaire)",
        "Site web professionnel multi-pages",
        "Nom de domaine personnalisé inclus",
        "Support prioritaire par email et téléphone",
        "5 utilisateurs inclus"
      ],
      recommended: true,
      color: "bg-purple-100"
    },
    premium: {
      title: "Pack Premium",
      price: "35 000",
      currency: "FCFA",
      period: "mois",
      description: "Pour les entreprises avec des besoins avancés",
      features: [
        "Solution Call center intégrée",
        "Site web + boutique en ligne",
        "Chatbot IA personnalisé",
        "Assistance technique 24/7",
        "Marketing automation",
        "Utilisateurs illimités"
      ],
      recommended: false,
      color: "bg-amber-100"
    }
  };

  const handleSignUp = (data) => {
    setIsSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
      console.log("Données d'inscription:", {
        ...data,
        selectedPlan
      });
      
      setIsSubmitting(false);
      setShowSignUpSuccess(true);
      
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant procéder au paiement.",
      });
      
      // Réinitialiser le formulaire
      form.reset();
    }, 1500);
  };

  const handleLogin = (data) => {
    setIsSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
      console.log("Tentative de connexion:", data);
      
      setIsSubmitting(false);
      
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur votre espace client TopCenter",
      });
      
      // Réinitialiser le formulaire
      loginForm.reset();
    }, 1500);
  };

  const handlePayment = () => {
    if (!phoneNumber && paymentMethod === "mobile") {
      toast({
        title: "Erreur de paiement",
        description: "Veuillez saisir un numéro de téléphone valide",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setPaymentStatus("Traitement en cours...");
    
    // Simuler un appel API de paiement
    setTimeout(() => {
      const paymentMethodName = paymentMethod === "mobile" 
        ? (paymentProvider === "mtn" ? "MTN Money" : paymentProvider === "airtel" ? "Airtel Money" : "Wave") 
        : "Carte bancaire";
      
      setPaymentStatus(`Paiement via ${paymentMethodName} effectué avec succès!`);
      setShowPaymentSuccess(true);
      setIsSubmitting(false);
      
      toast({
        title: "Paiement réussi !",
        description: `Votre abonnement au ${plans[selectedPlan].title} est maintenant actif.`,
      });
    }, 2000);
  };

  return (
    <div className="py-10 container mx-auto">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Portail SaaS TopCenter</h1>
          <p className="text-lg text-muted-foreground">
            Des solutions métiers adaptées à vos besoins, accessibles en quelques clics
          </p>
        </div>

        {showPaymentSuccess ? (
          <Card className="border-green-500">
            <CardHeader className="bg-green-50">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-center text-2xl">Félicitations !</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-lg">Votre abonnement au <span className="font-semibold">{plans[selectedPlan].title}</span> a été activé avec succès.</p>
              <p>Un email de confirmation contenant vos identifiants a été envoyé à votre adresse email.</p>
              <div className="border rounded-lg p-4 mt-6 bg-gray-50">
                <h3 className="font-medium mb-2">Prochaines étapes :</h3>
                <ul className="text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Connectez-vous à votre espace client pour commencer à utiliser vos services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Configurez votre profil et personnalisez vos paramètres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Explorez les tutoriels pour vous familiariser avec votre nouvelle plateforme</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full">Accéder à mon espace client</Button>
              <Button variant="outline" onClick={() => {
                setShowPaymentSuccess(false);
                setShowSignUpSuccess(false);
                setPaymentStatus(null);
              }}>
                Retour à l'accueil
              </Button>
            </CardFooter>
          </Card>
        ) : showSignUpSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle>Choisissez votre méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="border rounded-lg p-4 bg-gray-50 w-full max-w-md">
                  <h3 className="font-medium mb-2">Résumé de votre abonnement</h3>
                  <div className="flex justify-between py-2 border-b">
                    <span>Plan</span>
                    <span className="font-medium">{plans[selectedPlan].title}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span>Tarif</span>
                    <span className="font-medium">{plans[selectedPlan].price} {plans[selectedPlan].currency} / {plans[selectedPlan].period}</span>
                  </div>
                  <div className="flex justify-between py-2 font-medium">
                    <span>Total</span>
                    <span>{plans[selectedPlan].price} {plans[selectedPlan].currency}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Tabs defaultValue="mobile" onValueChange={(value) => setPaymentMethod(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mobile" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Mobile Money</span>
                    </TabsTrigger>
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Carte bancaire</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="mobile" className="pt-4 space-y-4">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div 
                          className={`border rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors ${paymentProvider === 'mtn' ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setPaymentProvider('mtn')}
                        >
                          <div className="h-12 flex items-center justify-center">
                            <img src="/lovable-uploads/logo-mtn.png" alt="MTN Money" className="h-10 object-contain" onError={(e) => e.currentTarget.src = 'https://placehold.co/100x60?text=MTN+Money'} />
                          </div>
                          <p className="mt-2 text-sm font-medium">MTN Money</p>
                        </div>
                        <div 
                          className={`border rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors ${paymentProvider === 'airtel' ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setPaymentProvider('airtel')}
                        >
                          <div className="h-12 flex items-center justify-center">
                            <img src="/lovable-uploads/logo-airtel.jpg" alt="Airtel Money" className="h-10 object-contain" />
                          </div>
                          <p className="mt-2 text-sm font-medium">Airtel Money</p>
                        </div>
                        <div 
                          className={`border rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors ${paymentProvider === 'wave' ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => setPaymentProvider('wave')}
                        >
                          <div className="h-12 flex items-center justify-center">
                            <img src="https://placehold.co/100x60?text=Wave" alt="Wave" className="h-10 object-contain" />
                          </div>
                          <p className="mt-2 text-sm font-medium">Wave</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Numéro de téléphone</Label>
                        <Input
                          id="phone-number"
                          type="tel"
                          placeholder="Votre numéro Mobile Money"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Vous recevrez une notification sur ce numéro pour confirmer le paiement
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="card" className="pt-4 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Numéro de carte</Label>
                        <Input
                          id="card-number"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Date d'expiration</Label>
                          <Input
                            id="expiry"
                            type="text"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            type="text"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name-on-card">Nom sur la carte</Label>
                        <Input
                          id="name-on-card"
                          type="text"
                          placeholder="JEAN DUPONT"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Paiement sécurisé avec chiffrement SSL 256-bit</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handlePayment} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Traitement en cours..." : "Payer maintenant"}
              </Button>
              
              {paymentStatus && (
                <div className="text-center text-green-600 font-medium mt-4">
                  {paymentStatus}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-12">
              <Tabs defaultValue={selectedPlan} onValueChange={setSelectedPlan}>
                <TabsList className="grid w-full grid-cols-3">
                  {Object.keys(plans).map((key) => (
                    <TabsTrigger key={key} value={key}>
                      {plans[key].title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  {Object.keys(plans).map((key) => (
                    <TabsContent key={key} value={key} className="mt-0 data-[state=active]:flex data-[state=active]:flex-col h-full">
                      <Card className={`flex flex-col h-full border-2 ${key === selectedPlan ? 'border-primary' : 'border-muted'} ${plans[key].recommended ? 'shadow-lg' : ''}`}>
                        {plans[key].recommended && (
                          <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                            Recommandé
                          </div>
                        )}
                        <CardHeader className={`${plans[key].color}`}>
                          <CardTitle className="text-2xl text-center">
                            {plans[key].title}
                          </CardTitle>
                          <div className="text-center mt-4">
                            <span className="text-4xl font-bold">{plans[key].price}</span>
                            <span className="text-lg ml-1">{plans[key].currency}</span>
                            <span className="text-muted-foreground">/{plans[key].period}</span>
                          </div>
                          <p className="text-sm text-center text-muted-foreground mt-2">
                            {plans[key].description}
                          </p>
                        </CardHeader>
                        
                        <CardContent className="flex-grow">
                          <ul className="space-y-3 mt-4">
                            {plans[key].features.map((feature, i) => (
                              <li key={i} className="flex gap-2 items-start">
                                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        
                        <CardFooter className="pt-0">
                          <Button 
                            className="w-full" 
                            variant={key === selectedPlan ? "default" : "outline"}
                            onClick={() => setSelectedPlan(key)}
                          >
                            {key === selectedPlan ? "Sélectionné" : "Choisir ce plan"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Créer un compte</span>
                    <Award className="h-5 w-5 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="lastName"
                          rules={{ required: "Le nom est requis" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Nom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="firstName"
                          rules={{ required: "Le prénom est requis" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input placeholder="Prénom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        rules={{ 
                          required: "L'email est requis",
                          validate: (value) => isValidEmail(value) || "Email invalide" 
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email professionnel</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="vous@entreprise.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        rules={{ 
                          required: "Le téléphone est requis",
                          validate: (value) => isValidPhoneNumber(value) || "Format de téléphone invalide" 
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel" 
                                placeholder="+242 XX XXX XXXX" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entreprise (optionnel)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nom de votre entreprise" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ville</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre ville" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse (optionnel)</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre adresse" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="password"
                        rules={{ 
                          required: "Le mot de passe est requis",
                          validate: (value) => {
                            const validation = validatePassword(value);
                            return validation.isValid || validation.errors[0];
                          }
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Choisir un mot de passe sécurisé" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2">
                        <p className="text-sm mb-4">
                          Plan sélectionné : <span className="font-semibold">{plans[selectedPlan].title}</span> - 
                          <span className="font-semibold"> {plans[selectedPlan].price} {plans[selectedPlan].currency}</span>/{plans[selectedPlan].period}
                        </p>
                        
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? "Traitement..." : "Créer mon compte"}
                        </Button>
                        
                        <p className="text-xs text-center text-muted-foreground mt-4">
                          En créant un compte, vous acceptez nos Conditions Générales d'Utilisation et notre Politique de Confidentialité
                        </p>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Déjà client ?</span>
                      <Lock className="h-5 w-5 text-primary" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          rules={{ 
                            required: "L'email est requis" 
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="votre@email.com"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          rules={{ 
                            required: "Le mot de passe est requis" 
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Votre mot de passe"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                          {isSubmitting ? "Connexion..." : "Se connecter"}
                        </Button>
                        
                        <div className="text-center">
                          <Button variant="link" className="text-sm p-0 h-auto">
                            Mot de passe oublié ?
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Besoin d'aide ?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Notre équipe d'experts est disponible pour vous aider à choisir la meilleure solution pour votre entreprise.</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>+242 06 873 0101</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>contact@topcenter.cg</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Demander un appel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
