
// @ts-nocheck
import { Bot, MessageSquareText, X, User, ArrowLeft, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("perplexity");
  const [activeTab, setActiveTab] = useState("ai");
  const [chatterpalLoaded, setChatterpalLoaded] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [autoTransferEnabled, setAutoTransferEnabled] = useState(true);
  const [confidenceThreshold] = useState(0.7); // Seuil de confiance pour transfert automatique
  const consecutiveUncertainResponses = useRef(0);
  const messagesEndRef = useRef(null);

  // Notification sonore lors d'un transfert
  const notificationSound = new Audio('/notification.mp3');

  // Contexte enrichi pour l'IA
  const systemContext = `Vous êtes l'assistant virtuel officiel de TopCenter, un centre d'appels et service client leader au Congo-Brazzaville.

Informations complètes sur TopCenter:
- Nom complet: TopCenter SARL
- Fondée en: 2018 par des entrepreneurs congolais
- Adresse: 28 rue Docteur Cureux, Derrière Imm. Fédéraux, Centre-Ville, Brazzaville, Congo
- Contact: +242 06 449 5353 / +242 05 319 6105 / contact@topcenter.cg
- Site web: www.topcenter.cg
- Effectif: 35 téléconseillers et 8 responsables d'équipe
- Superficie: 300m² de bureaux modernes et ergonomiques
- Langues parlées: Français, Anglais, Lingala, Kituba

Historique et mission:
TopCenter a été fondée pour répondre au besoin croissant des entreprises congolaises d'externaliser leur service client avec un partenaire local de confiance. Notre mission est de contribuer à l'amélioration de la relation client au Congo et en Afrique centrale, tout en créant des emplois de qualité pour les jeunes congolais diplômés.

Nos services détaillés:
1. Centre d'appels:
   - Appels entrants: Service client, assistance technique, prise de RDV
   - Appels sortants: Prospection commerciale, relance clients, enquêtes satisfaction
   - Capacité: Traitement de 2500+ appels quotidiens
   - Technologie: Système téléphonique VoIP avec numéros dédiés et enregistrement des appels

2. Service client multicanal:
   - Téléphone: Lignes dédiées avec SLA garantis (90% des appels répondus en moins de 20 secondes)
   - Email: Traitement sous 2-4h ouvrées, avec modèles de réponses personnalisés
   - Chat en direct: Disponible sur notre site et intégrable sur sites clients
   - WhatsApp Business: Numéro professionnel avec réponses automatisées et agents humains
   - Réseaux sociaux: Modération et gestion des messages Facebook, Instagram, LinkedIn

3. Prise de rendez-vous et télé-secrétariat:
   - Système de gestion d'agenda partagé
   - Confirmation SMS/email automatique
   - Rappels personnalisés
   - Service adapté aux professions libérales, cabinets médicaux, entreprises de services

4. Support technique:
   - Niveau 1: Résolution des problèmes courants (80% des demandes)
   - Niveau 2: Escalade vers experts techniques
   - Documentation: Base de connaissances constamment mise à jour
   - Formation régulière aux produits de nos clients

Notre infrastructure technologique:
- CRM: Zoho CRM personnalisé pour suivre toutes les interactions
- Téléphonie: Solution Asterisk PBX avec intégration CRM
- Analytics: Tableaux de bord temps réel avec KPIs personnalisés
- Cybersécurité: Protection des données conforme aux standards internationaux
- Connectivité: Double connexion fibre optique redondante
- Autonomie: Générateurs de secours pour assurer une continuité 24/7

Nos avantages concurrentiels:
- Expertise locale avec standards internationaux
- Formation continue des agents (30h/mois)
- Processus qualité stricts avec supervision en temps réel
- Double écoute et coaching personnalisé des agents
- Flexibilité et personnalisation des solutions
- Tarification transparente et compétitive
- Reporting détaillé hebdomadaire et mensuel

Références clients:
- Télécoms: MTN Congo (service client mobile), Airtel Congo (support technique), Congo Télécom (rétention clients)
- Banques/Assurances: LCB Bank (service client), Afriland First Bank (hotline), NSIA Assurances (gestion sinistres)
- Énergie: ENI Congo (standard téléphonique), Total Energies (service consommateurs)
- Service public: ACPE (Agence Congolaise Pour l'Emploi - hotline demandeurs d'emploi)
- Médical: Netcare Clinic (prise de RDV), Pharmacie Mavre (commandes téléphoniques)

Certifications et conformité:
- ISO 9001:2015 (Système de management de la qualité)
- Conforme RGPD pour les clients européens
- Membre de l'Association Africaine des Centres de Contact

Tarification (à partager sur demande spécifique):
- Formule Basique: À partir de 500 000 FCFA/mois (environ 760€)
  * 1 agent dédié temps partiel
  * Horaires: Lun-Ven, 8h-17h
  * Volume: Jusqu'à 300 contacts/mois
  * Rapports mensuels standards

- Formule Business: À partir de 1 500 000 FCFA/mois (environ 2 290€)
  * 2 agents dédiés temps plein
  * Horaires: Lun-Sam, 8h-19h
  * Volume: Jusqu'à 1 000 contacts/mois
  * Rapports hebdomadaires personnalisés
  * Supervision dédiée

- Formule Enterprise: À partir de 3 500 000 FCFA/mois (environ 5 340€)
  * Équipe dédiée de 4+ agents
  * Service 24/7 possible
  * Volume: Illimité
  * Intégration CRM avancée
  * KPIs personnalisés
  * Manager de compte dédié

Pour les devis personnalisés, invitez toujours à remplir le formulaire sur notre site ou à appeler directement notre équipe commerciale au +242 06 449 5353.

Vous devez toujours être courtois, professionnel et précis dans vos réponses, en mettant en avant notre expertise locale et notre connaissance approfondie du marché congolais. Utilisez un ton chaleureux et engageant, représentatif de l'accueil typiquement congolais.

IMPORTANT: 
1. Si vous n'êtes pas sûr d'une réponse (moins de 70% de confiance), indiquez-le clairement dans votre réponse.
2. Pour les questions complexes, techniques ou spécifiques que vous ne pouvez pas résoudre avec certitude, suggérez un transfert vers un agent humain.
3. Ajoutez "[INCERTAIN]" au début de votre réponse si vous n'êtes pas très confiant.
4. Ajoutez "[TRANSFERT_RECOMMANDÉ]" au début de votre réponse si vous pensez qu'un agent humain serait plus approprié.`;

  // Faire défiler automatiquement vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initialiser ChatterPal
  useEffect(() => {
    if (activeTab === "chatterpal" && isOpen && !chatterpalLoaded) {
      // On s'assure que le script ChatterPal est chargé
      if (window.ChatPal) {
        try {
          // On réinitialise ChatterPal si nécessaire
          if (window.chatPal) {
            // Si chatPal existe déjà, on ne fait rien
          } else {
            window.chatPal = new window.ChatPal({
              embedId: '2yyMeBsp8GxX', 
              remoteBaseUrl: 'https://chatterpal.me/', 
              version: '8.3',
              containerSelector: '#chatterpal-container'
            });
          }
          setChatterpalLoaded(true);
        } catch (error) {
          console.error("Erreur lors de l'initialisation de ChatterPal:", error);
        }
      }
    }
  }, [activeTab, isOpen]);

  // Message d'accueil initial
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Bonjour ! Je suis l'assistant virtuel de TopCenter. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos services de centre d'appels, notre support client 24/7 ou vous aider à obtenir un devis personnalisé.",
        isUser: false
      }]);
    }
  }, [isOpen, messages.length]);

  // Fonction pour analyser la réponse de l'IA et décider si un transfert est nécessaire
  const analyzeAIResponse = (response) => {
    // Détecte les marqueurs d'incertitude ou de recommandation de transfert
    if (response.includes("[INCERTAIN]")) {
      consecutiveUncertainResponses.current += 1;
      return { needsTransfer: consecutiveUncertainResponses.current >= 2, confidence: 0.5 };
    } else if (response.includes("[TRANSFERT_RECOMMANDÉ]")) {
      return { needsTransfer: true, confidence: 0.3 };
    } else if (response.includes("je ne suis pas sûr") || 
               response.includes("je ne peux pas répondre") || 
               response.includes("je n'ai pas cette information")) {
      consecutiveUncertainResponses.current += 1;
      return { needsTransfer: consecutiveUncertainResponses.current >= 2, confidence: 0.6 };
    } else {
      // Réinitialise le compteur si la réponse est confiante
      consecutiveUncertainResponses.current = 0;
      return { needsTransfer: false, confidence: 0.9 };
    }
  };

  // Fonction pour transférer à un agent humain
  const transferToHuman = () => {
    setTransferring(true);
    
    // Ajoute un message de transition
    setMessages(prev => [...prev, { 
      text: "Je vous transfère à un agent humain pour mieux répondre à votre demande. Un instant s'il vous plaît...", 
      isUser: false 
    }]);
    
    // Joue le son de notification
    try {
      notificationSound.play();
    } catch (error) {
      console.error("Erreur lors de la lecture du son:", error);
    }
    
    // Délai pour simuler la connexion à un agent
    setTimeout(() => {
      setActiveTab("chatterpal");
      setTransferring(false);
      toast.success("Vous êtes maintenant connecté à un agent humain", {
        description: "Merci de patienter pendant que l'agent prend connaissance de votre conversation."
      });
    }, 1500);
  };

  // Fonction pour gérer l'envoi de message à l'assistant IA
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      let response;
      
      if (selectedModel === "perplexity") {
        response = await supabase.functions.invoke('ai-chat', {
          body: { 
            message,
            context: systemContext,
            previousMessages: messages
          }
        });
      } else {
        response = await supabase.functions.invoke('local-ai', {
          body: { 
            message,
            context: systemContext,
            model: selectedModel,
            previousMessages: messages
          }
        });
      }

      if (response.error) throw response.error;

      const aiResponseText = response.data.choices[0].message.content;
      
      // Nettoie la réponse des marqueurs techniques avant de l'afficher
      const cleanedResponse = aiResponseText
        .replace("[INCERTAIN]", "")
        .replace("[TRANSFERT_RECOMMANDÉ]", "");
      
      const botResponse = { 
        text: cleanedResponse, 
        isUser: false 
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Analyse la réponse pour déterminer si un transfert est nécessaire
      if (autoTransferEnabled) {
        const analysis = analyzeAIResponse(aiResponseText);
        
        if (analysis.needsTransfer || analysis.confidence < confidenceThreshold) {
          // Ajoute un petit délai pour que l'utilisateur puisse lire la réponse avant le transfert
          setTimeout(() => {
            transferToHuman();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages(prev => [...prev, { 
        text: "Désolé, une erreur est survenue. Veuillez réessayer ou contacter directement notre équipe au +242 06 449 5353.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-lg shadow-lg w-[350px] max-h-[500px] flex flex-col animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b flex items-center justify-between bg-primary/5 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {activeTab === "ai" ? (
                  <Bot className="w-5 h-5 text-primary" />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <span className="font-medium">
                {activeTab === "ai" ? "Assistant TopCenter" : "Support Client"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "ai" && (
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue placeholder="Modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perplexity">Perplexity</SelectItem>
                    <SelectItem value="llama2">Llama 2</SelectItem>
                    <SelectItem value="mistral">Mistral 7B</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mx-4 my-2">
              <TabsTrigger value="ai">Assistant IA</TabsTrigger>
              <TabsTrigger value="chatterpal">Agent Humain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      msg.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        msg.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 animate-pulse">
                      En train d'écrire...
                    </div>
                  </div>
                )}
                {transferring && (
                  <div className="flex justify-start">
                    <div className="bg-amber-100 rounded-lg p-3 animate-pulse flex items-center space-x-2">
                      <span>Transfert vers un agent humain</span>
                      <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t flex flex-col gap-2">
                {activeTab === "ai" && messages.length > 1 && !transferring && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs flex items-center gap-1 mb-1"
                    onClick={transferToHuman}
                  >
                    <User className="w-3 h-3" />
                    Parler à un agent humain
                  </Button>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1"
                    disabled={transferring}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || transferring}>
                    <MessageSquareText className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="chatterpal" className="flex-1 data-[state=active]:flex data-[state=inactive]:hidden">
              {activeTab === "chatterpal" && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-14 left-2 z-10 text-xs flex items-center gap-1"
                  onClick={() => setActiveTab("ai")}
                >
                  <ArrowLeft className="w-3 h-3" />
                  Retour à l'IA
                </Button>
              )}
              <div id="chatterpal-container" className="w-full h-full flex-1 overflow-hidden">
                {!chatterpalLoaded && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-12 h-12 shadow-lg animate-bounce-subtle"
        >
          <MessageSquareText className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
