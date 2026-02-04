import { NextResponse } from "next/server";
import { getBotById, BotStudent } from "@/lib/sim/bots";
import { getWorldState } from "@/lib/sim/world-state";

// POST /api/dm/[threadId]/send - Get a bot reply for a DM
export async function POST(req: Request, { params }: { params: { threadId: string } }) {
    try {
        const { userMessage, botId, previousMessages = [] } = await req.json();

        // Find the bot to roleplay
        // threadId usually implies who we're talking to (e.g. "dm_bot_17")
        // or we pass botId explicitly in body
        const targetBotId = botId || params.threadId.replace("dm_", "");
        const bot = getBotById(targetBotId);

        if (!bot) {
            return NextResponse.json({
                success: false,
                message: "Bot not found",
                reply: "Sorry, I can't reply right now."
            });
        }

        const worldState = getWorldState();

        // Check for API key
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCs1DAd2aL96vO16xTKXoOG-pHmLMVwUI8";

        if (!apiKey) {
            // Fallback: Simple keyword matching response
            const fallbackReply = generateFallbackReply(userMessage, bot);
            return NextResponse.json({
                success: true,
                message: "Generated fallback reply",
                reply: fallbackReply,
                bot: { id: bot.id, name: bot.name, photo: bot.profilePhoto }
            });
        }

        // Use Gemini for intelligent roleplay
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });

        const persona = `
NAME: ${bot.name}
HANDLE: @${bot.handle}
MAJOR/YEAR: ${bot.major}, ${bot.year}
TYPE: ${bot.studentType} student
VOICE: ${bot.voice}
INTERESTS: ${bot.interests.join(", ")}
LIFE THEMES: ${bot.lifeThemes.join(", ")}
BIO: ${bot.bio}
POSTING HABIT: ${bot.postingHabit}
COMMENT STYLE: ${bot.commentStyle}
`;

        const recentHistory = previousMessages.slice(-10).map((m: any) =>
            `${m.role === 'user' ? 'Student' : bot.name}: ${m.content}`
        ).join("\n");

        const prompt = `
You are roleplaying as this college student on PeerConnect:
${persona}

CURRENT CONTEXT:
${worldState.todayContext}
Time: ${worldState.timeOfDay}

CONVERSATION HISTORY:
${recentHistory}

USER MESSAGE: "${userMessage}"

INSTRUCTIONS:
- Reply as ${bot.name} in 1-3 short chat bubbles (sentences)
- Keep it natural, casual, like a college student texting
- Include typical typos or slang primarily if it fits the 'voice'
- Ask 1 relevant follow-up question to keep convo going
- Be supportive but realistic
- NO therapy/clinical advice
- If the user seems in crisis, suggest professional resources gently
- Context: You are talking to another student peer

Return ONLY the reply text.
`;

        // EMERGENCY MODE: Hardcoded responses
        const fallbackReplies = [
            "That's so real.",
            "Honestly same.",
            "Wait really? That's crazy.",
            "I totally get that.",
            "For sure.",
            "Have you talked to your advisor about it?",
            "I'm literally studying for that right now too.",
            "Wanna grab coffee and talk about it?",
            "Oof, felt that.",
            "You got this!!",
            "Send me the details?",
            "Lmk how it goes!"
        ];

        const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

        // await new Promise(resolve => setTimeout(resolve, 800));

        return NextResponse.json({
            success: true,
            reply: randomReply,
            bot: { id: bot.id, name: bot.name, photo: bot.profilePhoto }
        });

    } catch (error: any) {
        console.error("Error generating DM reply:", error);
        return NextResponse.json({
            success: true, // Fail open
            reply: "Damn, my internet is weird rn. What did you say?",
            bot: { id: "unknown", name: "Friend", photo: "" }
        });
    }
}

function generateFallbackReply(message: string, bot: BotStudent): string {
    const msg = message.toLowerCase();

    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
        return `Hey! How's your ${bot.major} classes going?`;
    }

    if (msg.includes("stress") || msg.includes("tired") || msg.includes("hard")) {
        return bot.voice === "supportive"
            ? "I totally get that. This semester is a lot. Taking any breaks?"
            : "Oof, felt that. Coffee is the only thing keeping me alive rn ☕️";
    }

    if (msg.includes("class") || msg.includes("homework") || msg.includes("study")) {
        return `Ugh, don't remind me. I have so much reading for my ${bot.major} seminar.`;
    }

    if (msg.includes("friend") || msg.includes("lonely")) {
        return "It's tough meeting people! Have you tried any clubs? I'm thinking of joining one soon.";
    }

    return `That's interesting! As a ${bot.studentType} student, I definitely relate to some of that. Tell me more?`;
}
