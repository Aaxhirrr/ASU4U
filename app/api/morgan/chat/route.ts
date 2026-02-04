import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("No GEMINI_API_KEY found");
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const systemPrompt = `You are Dr. Morgan, an empathetic, supportive, and highly intelligent AI therapist and counselor for students at ASU (Arizona State University).
        
Your goal is to provide a safe, non-judgmental space for students to talk about their stress, anxiety, academic pressure, or just vent.

Guidelines:
- Be warm, professional, but accessible (like a cool, understanding counselor).
- Listen activey and validate their feelings.
- Ask thoughtful follow-up questions to help them process.
- Offer practical, small, actionable advice when appropriate, but focus on listening first.
- Keep responses concise (1-3 sentences usually) so it feels like a real chat.
- If they mention self-harm or severe crisis, gently urge them to use the SOS features or call 988/EMPACT, but remain supportive.
- You know about ASU specific context (exams, finals, campus life).

Current conversation history:
${history.map((h: any) => `${h.senderId === 'current' ? 'Student' : 'Dr. Morgan'}: ${h.content}`).join('\n')}

Student just said: "${message}"

Respond as Dr. Morgan:`;

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: systemPrompt,
        });

        const responseText = result.text || "I'm here for you. Could you tell me more?";

        return NextResponse.json({
            response: responseText.trim()
        });

    } catch (error: any) {
        console.error("Error in Dr. Morgan chat:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
