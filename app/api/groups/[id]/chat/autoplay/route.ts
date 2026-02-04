import { NextResponse } from "next/server";
import { getRandomBots, getBotById, BotStudent } from "@/lib/sim/bots";
import { getWorldState, addGroupMessages, GeneratedMessage } from "@/lib/sim/world-state";

// POST /api/groups/[id]/chat/autoplay - Generate lively group chat activity
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { groupName, groupDescription, recentMessages = [] } = await req.json();
        const groupId = params.id;
        const worldState = getWorldState();

        // Pick 3-5 random bots to participate in the chat
        const activeBots = getRandomBots(3 + Math.floor(Math.random() * 3));

        // Check for API key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback: Generate simple mock messages
            const mockMessages = generateMockGroupMessages(groupId, activeBots, groupName);
            addGroupMessages(groupId, mockMessages);
            return NextResponse.json({
                success: true,
                message: "Generated mock group chat (no API key)",
                count: mockMessages.length,
                messages: mockMessages
            });
        }

        // Use Gemini for dynamic group conversation
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });

        const botProfiles = activeBots.map(b =>
            `- ${b.name} (${b.studentType}, ${b.major}): ${b.voice} voice, interests: ${b.interests.join(", ")}`
        ).join("\n");

        const recentHistory = recentMessages.slice(-15).map((m: any) =>
            `${m.senderName || 'Student'}: ${m.content}`
        ).join("\n");

        const prompt = `
You are simulating a lively group chat for PeerConnect, a college social app.

GROUP: "${groupName}"
DESCRIPTION: "${groupDescription}"
CONTEXT: ${worldState.todayContext} (Time: ${worldState.timeOfDay})
GROUP VIBE: ${worldState.groupVibes[groupName] || worldState.groupVibes[Object.keys(worldState.groupVibes)[0]]}

PARTICIPANTS (Bots):
${botProfiles}

RECENT CHAT HISTORY:
${recentHistory}

INSTRUCTIONS:
- Generate 6-12 new messages between these bots
- Bots should reply to each other, reference previous messages, or start new relevant topics
- Keep it short, chatty, casual ("texting style")
- Occasional emojis, typos, slang matched to student personas
- Stay ON TOPIC for this specific group (e.g. if International group, talk about visa/culture/food)
- If chat history is empty, start a conversation naturally

Return ONLY valid JSON:
{
  "messages": [
    {
      "bot_id": "bot_id_here",
      "text": "message content...",
      "minutes_offset": 0-20
    }
  ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No valid JSON in response");

        const data = JSON.parse(jsonMatch[0]);

        // Process messages
        const newMessages: GeneratedMessage[] = data.messages.map((msg: any, index: number) => {
            // Find the bot (or random fallback if hallucinated ID)
            const bot = activeBots.find(b => b.id === msg.bot_id) || activeBots[index % activeBots.length];

            return {
                bot_id: bot.id,
                bot_handle: bot.handle,
                bot_name: bot.name,
                bot_photo: bot.profilePhoto,
                text: msg.text,
                minutes_ago: 0 // In a real app, you'd calculate this relative to request time
            };
        });

        addGroupMessages(groupId, newMessages);

        return NextResponse.json({
            success: true,
            message: "Generated group chat activity",
            count: newMessages.length,
            messages: newMessages
        });

    } catch (error: any) {
        console.error("Error generating group chat:", error);
        return NextResponse.json({
            success: false,
            message: "Error generating chat",
            error: error.message
        });
    }
}

function generateMockGroupMessages(groupId: string, bots: BotStudent[], groupName: string): GeneratedMessage[] {
    const templates = [
        "Anyone want to meet up for coffee?",
        "Did anyone understand the reading?",
        "Campus is so busy today!",
        "I'm so tired of finals week already",
        "Has anyone verified their transcript yet?",
        "This heat is killing me 🥵",
        "Who's going to the game this weekend?",
        "Anyone knowing a good place for lunch?",
    ];

    return bots.map((bot, i) => ({
        bot_id: bot.id,
        bot_handle: bot.handle,
        bot_name: bot.name,
        bot_photo: bot.profilePhoto,
        text: templates[Math.floor(Math.random() * templates.length)],
        minutes_ago: 0
    }));
}
