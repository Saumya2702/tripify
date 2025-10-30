import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      destination, 
      duration, 
      budget, 
      interests, 
      travelStyle, 
      pace, 
      foodPreferences 
    } = await req.json();

    console.log('Generating itinerary for:', { destination, duration, budget });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create a detailed prompt for the AI
    const prompt = `You are an expert travel planner. Create a detailed, personalized ${duration}-day itinerary for ${destination}.

Trip Details:
- Budget Level: ${budget}
- Interests: ${interests.join(', ')}
- Travel Style: ${travelStyle}
- Pace: ${pace}
- Food Preferences: ${foodPreferences.join(', ')}

Generate a day-by-day itinerary with the following structure for each day:
{
  "day": <number>,
  "title": "<engaging day title>",
  "morning": {
    "activity": "<activity name>",
    "description": "<2-3 sentences about the activity>",
    "duration": "<time estimate>",
    "cost": "<estimated cost in local currency>",
    "tips": "<helpful travel tip>"
  },
  "afternoon": {
    "activity": "<activity name>",
    "description": "<2-3 sentences about the activity>",
    "duration": "<time estimate>",
    "cost": "<estimated cost in local currency>",
    "tips": "<helpful travel tip>"
  },
  "evening": {
    "activity": "<activity name>",
    "description": "<2-3 sentences about the activity>",
    "duration": "<time estimate>",
    "cost": "<estimated cost in local currency>",
    "tips": "<helpful travel tip>"
  },
  "restaurants": [
    {
      "name": "<restaurant name>",
      "type": "<cuisine type>",
      "meal": "<breakfast/lunch/dinner>",
      "description": "<why this restaurant>",
      "priceRange": "<$ to $$$>"
    }
  ],
  "accommodation": "<accommodation suggestion for this day>",
  "transportTips": "<how to get around this day>"
}

Important guidelines:
1. Match the pace (${pace}): relaxed = fewer activities, packed = more activities
2. Consider the budget (${budget}): adjust recommendations accordingly
3. Include activities matching interests: ${interests.join(', ')}
4. Respect food preferences: ${foodPreferences.join(', ')}
5. Tailor to travel style: ${travelStyle}
6. Include practical tips, local insights, and hidden gems
7. Provide realistic time estimates and costs
8. Suggest restaurants that match food preferences

Return ONLY valid JSON with an array of day objects. No markdown, no explanation.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert travel planner who creates detailed, personalized itineraries. Always respond with valid JSON only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI service credits depleted. Please contact support.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to generate itinerary');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Raw AI response:', content);

    // Parse the JSON response from AI
    let itinerary;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      itinerary = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, content);
      throw new Error('Failed to parse itinerary data');
    }

    // Add some metadata
    const result = {
      destination,
      duration,
      budget,
      interests,
      travelStyle,
      pace,
      foodPreferences,
      days: itinerary,
      generatedAt: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(result), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-itinerary function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
