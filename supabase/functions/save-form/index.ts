
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

interface FormData {
  title: string;
  description: string;
  fields: any[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    const formData: FormData = await req.json()
    
    // Validate form data
    if (!formData.title) {
      return new Response(
        JSON.stringify({ error: "Form title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    console.log("Saving form with data:", JSON.stringify(formData));
    
    // Insert the form into the database
    const { data, error } = await supabaseClient
      .from('form_templates')
      .insert([
        {
          title: formData.title,
          description: formData.description,
          fields: formData.fields,
          status: 'active'
        }
      ])
      .select()
    
    if (error) {
      console.error('Error saving form:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    console.log("Form saved successfully:", data);
    
    return new Response(
      JSON.stringify({ data: data[0] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
