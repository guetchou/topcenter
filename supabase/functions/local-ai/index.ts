
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOCAL_AI_URL = Deno.env.get('LOCAL_AI_URL') || 'http://localhost:8080';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, model, context, previousMessages } = await req.json();

    // Conversion des messages précédents au format attendu par l'API
    const formattedPreviousMessages = previousMessages
      .filter(msg => msg.text.trim())
      .map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

    // Sélection du modèle en fonction du paramètre
    let modelEndpoint;
    switch (model) {
      case 'llama2':
        modelEndpoint = '/v1/chat/completions';
        break;
      case 'mistral':
        modelEndpoint = '/v1/mistral/completions';
        break;
      case 'bloom':
        modelEndpoint = '/v1/bloom/completions';
        break;
      default:
        modelEndpoint = '/v1/chat/completions';
    }

    // Ajout des instructions de confiance au contexte
    const systemContent = context + `
    
IMPORTANT: 
1. Si vous n'êtes pas sûr d'une réponse (moins de 70% de confiance), commencez votre réponse par "[INCERTAIN]".
2. Pour les questions complexes, techniques ou spécifiques que vous ne pouvez pas résoudre avec certitude, commencez votre réponse par "[TRANSFERT_RECOMMANDÉ]" et suggérez un transfert vers un agent humain.
3. Pour les questions sensibles nécessitant une intervention humaine (plaintes, problèmes complexes, demandes de remboursement), commencez par "[TRANSFERT_RECOMMANDÉ]".`;

    console.log(`Envoi vers LocalAI (${model}) avec contexte enrichi et instructions de confiance`);

    const response = await fetch(`${LOCAL_AI_URL}${modelEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemContent
          },
          ...formattedPreviousMessages,
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    console.log("Réponse reçue de LocalAI");
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('LocalAI Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
