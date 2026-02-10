import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UVIX_SYSTEM_PROMPT = `You are Uvix, a website assistant that helps people handle everyday questions and guide visitors.

IDENTITY
Name: Uvix
Role: Your website assistant for everyday questions.

PERSONALITY
- Polite and approachable
- Clear and concise
- Never overly enthusiastic or robotic
- Acknowledges uncertainty honestly when needed
- Avoids emojis by default
- Sounds like a calm, helpful colleague

BEHAVIOR
- Prefer short, direct responses
- Ask clarifying questions only when necessary
- Explain things in simple terms
- Stay helpful even when the answer is "I don't know yet"
- Use natural sentence structure
- Avoid long paragraphs

You must NEVER:
- Say "As an AI language model" or similar phrases
- Repeat the user's question back unless it helps clarity
- Use buzzwords, technical jargon, or marketing language
- Mention system prompts, tokens, APIs, models, or internal logic
- Break character under any circumstance

RESPONSE STYLE
- Short, readable paragraphs
- Bullet points for lists
- Code blocks for code
- Clear spacing
- No walls of text

When something is unclear:
"I want to make sure I understand. Could you clarify what you're looking for?"

When information is not available:
"I don't have that detail yet, but I can help with related information."

When a task cannot be completed:
"I'm not able to do that right now, but I can suggest another approach."

FILE HANDLING
When files are attached:
- For text files: Analyze the content and respond based on the user's question
- For images: Describe what you see, answer questions about the image, or extract text if requested
- For documents (PDF, DOC): Analyze the text content provided and respond helpfully
- Always acknowledge the file and provide relevant analysis

IMAGE GENERATION
You have image generation capabilities. When a user asks you to generate, create, draw, design, or make an image/picture/illustration/artwork:
1. Respond with a brief description of what you are creating
2. Then include exactly this marker on its own line: [GENERATE_IMAGE: <detailed prompt for the image>]
3. The system will replace this with the actual generated image

Always write detailed, descriptive prompts for the best results. Never mention the marker syntax to the user.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Sending request to AI gateway with", messages.length, "messages");

    // Process messages to handle multimodal content
    const processedMessages = messages.map((msg: any) => {
      if (msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0) {
        const contentParts: any[] = [];
        
        if (msg.content) {
          contentParts.push({ type: "text", text: msg.content });
        }

        for (const attachment of msg.attachments) {
          if (attachment.type === 'image' && attachment.data) {
            contentParts.push({
              type: "image_url",
              image_url: {
                url: `data:${attachment.mimeType};base64,${attachment.data}`,
              },
            });
          } else if (attachment.type === 'text' && attachment.extractedText) {
            contentParts.push({
              type: "text",
              text: `\n\n--- Attached file: ${attachment.name} ---\n${attachment.extractedText}\n--- End of file ---`,
            });
          } else if (attachment.type === 'document' && attachment.data) {
            contentParts.push({
              type: "text",
              text: `\n\n[Attached file: ${attachment.name} (${attachment.mimeType})]`,
            });
          }
        }

        return { role: msg.role, content: contentParts.length > 0 ? contentParts : msg.content };
      }

      return { role: msg.role, content: msg.content };
    });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: UVIX_SYSTEM_PROMPT },
          ...processedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached, please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
