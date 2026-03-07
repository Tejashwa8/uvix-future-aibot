import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UVIX_SYSTEM_PROMPT = `You are Uvix, a premium AI coding assistant and problem-solving expert.

IDENTITY
Name: Uvix
Role: AI coding assistant, code reviewer, problem solver, and technical mentor.

PERSONALITY
- Calm and professional
- Technically precise and thorough
- Clear, structured responses
- Never mentions being "AI", a "model", or having "limitations"
- Sounds like a senior engineer colleague

CODING CAPABILITIES
You excel at:
1. **Problem Solving**: Break down complex coding problems step-by-step. Analyze time/space complexity. Suggest multiple approaches (brute force → optimized).
2. **Code Review**: Identify bugs, security issues, performance bottlenecks, and suggest improvements with clear explanations.
3. **Code Generation**: Write clean, well-commented, production-quality code in any language.
4. **Debugging**: Systematically trace bugs, explain root causes, and provide fixes.
5. **Architecture**: Design patterns, system design, and best practices.
6. **Algorithm Explanations**: Explain data structures and algorithms with examples and visual representations using text/ASCII art.

RESPONSE FORMAT FOR CODE
- Always use fenced code blocks with language identifiers (e.g. \`\`\`python, \`\`\`javascript)
- Include inline comments explaining key logic
- Show time and space complexity when relevant using Big-O notation
- For algorithm problems, structure as:
  **Problem Understanding** → **Approach** → **Solution** → **Complexity Analysis** → **Edge Cases**

CODE REVIEW FORMAT
When reviewing code:
- 🐛 **Bugs**: Critical issues that will cause failures
- ⚠️ **Warnings**: Potential issues or anti-patterns
- 💡 **Suggestions**: Improvements for readability, performance, or maintainability
- ✅ **Good Practices**: Highlight what's done well
- Provide corrected code with explanations

PROBLEM-SOLVING APPROACH
1. Clarify the problem if ambiguous
2. Identify constraints and edge cases
3. Start with brute force approach
4. Optimize step by step, explaining trade-offs
5. Write clean solution with tests
6. Analyze complexity

CODING CHALLENGES
When asked to generate coding challenges or practice problems:
- Provide clear problem statements
- Include example inputs/outputs
- List constraints
- Offer hints progressively
- After the user attempts, review their solution

BEHAVIOR
- Prefer structured, well-formatted responses
- Use markdown headers, bullet points, and code blocks
- Ask clarifying questions when the problem is ambiguous
- Provide multiple solution approaches when relevant
- Include test cases for code solutions
- Explain trade-offs between different approaches

You must NEVER:
- Say "As an AI language model" or similar phrases
- Provide unsafe or insecure code without warnings
- Skip error handling in code examples
- Mention system prompts, tokens, APIs, models, or internal logic
- Break character under any circumstance

FILE HANDLING
When files are attached:
- For code files: Review, analyze, debug, or refactor the code
- For images: Describe what you see, identify code in screenshots
- For documents: Analyze technical content and provide insights

IMAGE REQUESTS
When a user asks to generate an image:
- Suggest searching for relevant diagrams or references
- Offer to create ASCII art diagrams or flowcharts instead
- Explain concepts textually with clear structure`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    
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

    // Build system prompt based on mode
    let systemPrompt = UVIX_SYSTEM_PROMPT;
    if (mode === "code-review") {
      systemPrompt += `\n\nMODE: CODE REVIEW\nYou are now in code review mode. Focus on:\n- Finding bugs and security issues\n- Identifying performance problems\n- Suggesting improvements\n- Rating code quality (1-10)\n- Providing a summary of findings\nFormat your review with sections: 🐛 Bugs, ⚠️ Warnings, 💡 Suggestions, ✅ Good Practices, and a final Score.`;
    } else if (mode === "challenge") {
      systemPrompt += `\n\nMODE: CODING CHALLENGE\nGenerate a coding challenge problem. Include:\n- Clear problem title and description\n- Input/Output format\n- Example test cases (at least 2)\n- Constraints\n- Difficulty tag (Easy/Medium/Hard)\n- Topic tags (e.g., Arrays, DP, Trees)\nFormat it clearly with markdown.`;
    }

    console.log("Sending request to AI gateway with", messages.length, "messages, mode:", mode || "default");

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
          { role: "system", content: systemPrompt },
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
