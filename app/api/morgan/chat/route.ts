import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history } = body;

        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCs1DAd2aL96vO16xTKXoOG-pHmLMVwUI8";
        if (!apiKey) {
            console.error("No GEMINI_API_KEY found");
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        // EMERGENCY MODE: Hardcoded responses as requested by user
        // This bypasses Gemini completely for instant reliability
        const fallbackResponses = [
            "I hear you. That sounds really tough to deal with right now.",
            "I'm listening. Tell me more about how you're feeling.",
            "It's valid to feel overwhelmed. Can you take a deep breath with me?",
            "I'm here for you. What do you think would help you feel a little better right now?",
            "Thank you for sharing that with me. It takes strength to open up.",
            "That sounds incredibly stressful. You're not alone in this.",
            "I understand. Take all the time you need to explain.",
            "How has this been affecting your sleep or daily routine?"
        ];

        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

        // Simulate slight delay for realism
        // await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json({
            response: randomResponse
        });

    } catch (error: any) {
        console.error("Error in Dr. Morgan chat:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
