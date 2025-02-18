
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startupId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch startup data
    const { data: startup } = await supabase
      .from('startups')
      .select(`
        *,
        startup_details (*),
        startup_financials (*),
        team_members (*)
      `)
      .eq('id', startupId)
      .single();

    if (!startup) {
      throw new Error('Startup not found');
    }

    // Prepare data for OpenAI
    const prompt = `Analyze this startup:
    
    Company: ${startup.name}
    Industry: ${startup.industry}
    Founded: ${startup.founding_year}
    Location: ${startup.location}
    Employees: ${startup.employee_count}
    
    Problem: ${startup.startup_details.problem_statement}
    Solution: ${startup.startup_details.solution}
    Business Model: ${startup.startup_details.business_model}
    Market Size: ${startup.startup_details.market_size}
    Tech Stack: ${startup.startup_details.tech_stack}
    
    Current Revenue: ${startup.startup_financials.current_revenue}
    Burn Rate: ${startup.startup_financials.burn_rate}
    Funding Raised: ${startup.startup_financials.funding_raised}
    Valuation: ${startup.startup_financials.valuation}
    
    Please provide a comprehensive analysis including:
    1. Market potential (score 0-100)
    2. Competitive position (score 0-100)
    3. Financial viability (score 0-100)
    4. Scalability potential (score 0-100)
    5. Risk assessment (score 0-100)
    6. Summary
    7. Recommendations

    Format the response as JSON with the following structure:
    {
      "market_potential_score": number,
      "competitive_position_score": number,
      "financial_viability_score": number,
      "scalability_score": number,
      "risk_score": number,
      "summary": "text",
      "recommendations": "text"
    }`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an experienced venture capital analyst. Provide detailed analysis and scoring based on the data provided.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const aiData = await openAIResponse.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // Update the AI analysis in the database
    const { error: updateError } = await supabase
      .from('ai_analyses')
      .upsert({
        startup_id: startupId,
        status: 'completed',
        ...analysis,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ message: 'Analysis completed', analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
