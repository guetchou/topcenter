
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Contexte enrichi pour TopCenter
    const systemContext = `Vous êtes un assistant du service client de TopCenter, un centre d'appels professionnel basé à Brazzaville, Congo. 
    
TopCenter offre des services de centre d'appels, service client multicanal, prise de rendez-vous et support technique. 
L'entreprise travaille avec des clients importants comme MTN Congo, Airtel Congo, LCB Bank et bien d'autres.

Répondez aux questions des clients de manière professionnelle, chaleureuse et précise, conformément aux valeurs de TopCenter:
- Professionnalisme et rigueur
- Innovation constante
- Expertise locale avec standards internationaux
- Satisfaction client au cœur de tout

Pour les demandes de prix, mentionnez que les tarifs sont personnalisés selon les besoins et dirigez vers le formulaire de contact ou au numéro +242 06 449 5353.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemContext
          },
          { role: 'user', content: message }
        ],
      }),
    })

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
