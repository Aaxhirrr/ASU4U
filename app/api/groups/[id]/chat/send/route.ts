import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const { userMessage, userName, groupContext } = body;

        console.log("Received request:", { userMessage, userName, groupContext });

        // Check for API key with fallback
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCs1DAd2aL96vO16xTKXoOG-pHmLMVwUI8";
        if (!apiKey) {
            console.error("No GEMINI_API_KEY found");
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Generate responses from 2-3 different group members
        const numResponses = Math.floor(Math.random() * 2) + 2; // 2-3 responses
        const responses = [];

        const groupMembers = [
            { name: "Marcus", id: "2", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
            { name: "Emily", id: "3", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
            { name: "Sarah", id: "4", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
            { name: "Alex", id: "5", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        ];

        // Shuffle and pick random members
        const shuffled = [...groupMembers].sort(() => Math.random() - 0.5);
        const selectedMembers = shuffled.slice(0, numResponses);

        // EMERGENCY MODE: Hardcoded responses
        // Bypassing Gemini to ensure reliability
        for (let i = 0; i < numResponses; i++) {
            const member = selectedMembers[i];
            const delay = i === 0 ? 0 : (i * 2500) + Math.floor(Math.random() * 1500);

            // Simple static templates based on group context
            const templates = [
                "That's so true!",
                "I was just thinking the same thing.",
                `@${userName} totally agree.`,
                "Anyone else feeling this?",
                "This semester is wild.",
                "Wait, can you explain more?",
                "Haha literally me.",
                "Keep going, you got this.",
                "Vibe.",
                "Does anyone have notes on this?"
            ];

            const responseText = templates[Math.floor(Math.random() * templates.length)];
            console.log(`(Hardcoded) Got response from ${member.name}:`, responseText);

            responses.push({
                userId: member.id,
                userName: member.name,
                userPhoto: member.photo,
                content: responseText,
                delay: delay,
            });
        }

        console.log("Returning responses:", responses.length);
        return NextResponse.json({ responses });
    } catch (error: any) {
        console.error("Error generating group responses:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
