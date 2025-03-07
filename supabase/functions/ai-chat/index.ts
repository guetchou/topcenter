
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, context, previousMessages } = await req.json();
    
    // Conversion des messages précédents au format attendu par l'API
    const formattedPreviousMessages = previousMessages
      .filter(msg => msg.text.trim()) // filtrer les messages vides
      .map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

    // Construction des messages avec le contexte système enrichi et instructions de confiance
    const systemContent = context + `
    
IMPORTANT: 
1. Si vous n'êtes pas sûr d'une réponse (moins de 70% de confiance), commencez votre réponse par "[INCERTAIN]".
2. Pour les questions complexes, techniques ou spécifiques que vous ne pouvez pas résoudre avec certitude, commencez votre réponse par "[TRANSFERT_RECOMMANDÉ]" et suggérez un transfert vers un agent humain.
3. Pour les questions sensibles nécessitant une intervention humaine (plaintes, problèmes complexes, demandes de remboursement), commencez par "[TRANSFERT_RECOMMANDÉ]".`;

    const messages = [
      {
        role: 'system',
        content: systemContent
      },
      ...formattedPreviousMessages,
      {
        role: 'user',
        content: message
      }
    ];

    console.log("Envoi à Perplexity avec contexte enrichi et instructions de confiance");
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: messages,
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: ['perplexity.ai'],
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    console.log("Réponse reçue de Perplexity");

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("Erreur AI Chat:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
