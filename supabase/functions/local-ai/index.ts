
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
    const { message, model } = await req.json();

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

    const response = await fetch(`${LOCAL_AI_URL}${modelEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant virtuel professionnel de TopCenter, expert en centre d\'appels et services clients.'
          },
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
