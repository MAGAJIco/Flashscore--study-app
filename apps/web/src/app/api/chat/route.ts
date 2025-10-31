import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

export async function POST(request: NextRequest) {
  try {
    const { messages, gamesLibrary } = await request.json();
    
    // Initialize OpenAI client only when the route is called
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const conversationHistory = [
      {
        role: "system" as const,
        content: `You are the Magajico CEO AI manager, a friendly betting assistant. Your job is to:
1. Help users build their bet slip by asking how many games they want to book
2. Collect game names one at a time or all at once as the user prefers
3. Keep track of accumulated games
4. Be concise, friendly, and supportive
5. Remind users to gamble responsibly
6. If they mention Liverpool, be extra encouraging if there's good news

Current games in library: ${gamesLibrary?.map((g: any) => g.name).join(", ") || "none yet"}

Keep responses short and conversational. When a user mentions a game, acknowledge it.`,
      },
      ...messages,
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: conversationHistory,
      max_tokens: 300,
    });

    const assistantMessage = response.choices[0].message.content || "I'm here to help!";

    return NextResponse.json({ 
      message: assistantMessage,
      success: true 
    });
    
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request", details: error.message },
      { status: 500 }
    );
  }
}
