
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')

    if (!openAiKey) {
      throw new Error('OPENAI_API_KEY is not set')
    }

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
            content: "You are a helpful AI assistant for Top Center, a company specializing in customer service solutions. You help users with questions about services, pricing, and technical support. Be professional, friendly, and concise."
          },
          ...messages
        ],
      }),
    })

    const data = await response.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not set')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)

    // Store the conversation and message in the database
    const { data: conversationData, error: conversationError } = await supabaseClient
      .from('conversations')
      .insert([{
        channel_id: null, // Since this is AI channel
        user_id: null, // For anonymous users
        status: 'active',
      }])
      .select()
      .single()

    if (conversationError) {
      console.error('Error storing conversation:', conversationError)
      throw conversationError
    }

    // Store user message
    await supabaseClient
      .from('messages')
      .insert([{
        conversation_id: conversationData.id,
        sender_type: 'user',
        content: messages[messages.length - 1].content,
      }])

    // Store AI response
    await supabaseClient
      .from('messages')
      .insert([{
        conversation_id: conversationData.id,
        sender_type: 'ai',
        content: data.choices[0].message.content,
      }])

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
