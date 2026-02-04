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

        for (let i = 0; i < numResponses; i++) {
            const member = selectedMembers[i];
            const delay = i === 0 ? 0 : (i * 2500) + Math.floor(Math.random() * 1500);

            const prompt = `You are ${member.name}, a supportive college student in the group "${groupContext?.groupName || 'College Support'}".

Group description: ${groupContext?.groupDescription || 'A supportive community'}

A student just posted: "${userMessage}"

Write a helpful, empathetic response to what they said. 
- Be conversational and natural (like texting a friend)
- Reference details from their message
- Keep it 1-2 sentences max
- Use casual language
- NO generic responses

Your response:`;

            console.log(`Generating response ${i + 1} for ${member.name}`);

            const result = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: prompt,
            });

            const responseText = result.text || "";
            console.log(`Got response from ${member.name}:`, responseText);

            responses.push({
                userId: member.id,
                userName: member.name,
                userPhoto: member.photo,
                content: responseText.trim(),
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
