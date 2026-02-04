
import { GoogleGenAI } from "@google/genai";

export interface ModerationResult {
    flagged: boolean;
    category?: "harassment" | "self-harm" | "toxicity" | "spam";
    reason?: string;
    helpfulMessage?: string; // For self-harm resources
}

export async function moderateContent(text: string): Promise<ModerationResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        // Basic keyword fallback
        const lower = text.toLowerCase();
        if (lower.includes("kill myself") || lower.includes("suicide")) {
            return {
                flagged: true,
                category: "self-harm",
                helpfulMessage: "You are not alone. Please reach out to the Crisis Lifeline at 988."
            };
        }
        if (lower.includes("stupid") || lower.includes("hate you")) {
            return {
                flagged: true,
                category: "toxicity",
                reason: "Please keep the conversation respectful."
            };
        }
        return { flagged: false };
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `
Analyze this social media post for safety and moderation.
TEXT: "${text}"

CATEGORIES TO FLAG:
1. Harassment/Toxicity: insults, slurs, bullying.
2. Self-Harm: expressions of wanting to hurt oneself, hopelessness, suicide.
3. Spam/Scams: obvious spam.

If flagged, categorize it and provide a user-facing reason (gentle/firm) or helpful resource message (for self-harm).

Return ONLY valid JSON:
{
  "flagged": boolean,
  "category": "harassment" | "self-harm" | "toxicity" | "spam" | null,
  "reason": "User facing message why it was blocked",
  "helpfulMessage": "Resource message if self-harm (e.g. Call 988)"
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        const resultText = response.text || "";
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return { flagged: false };

    } catch (error) {
        console.error("Moderation error:", error);
        return { flagged: false }; // Fail open if AI fails, in a real app might fail closed
    }
}
