import { NextResponse } from "next/server";
import { getRandomBots, BOT_STUDENTS } from "@/lib/sim/bots";
import { getWorldState, addPosts, GeneratedPost, GeneratedComment } from "@/lib/sim/world-state";

// POST /api/sim/tick - Generate new feed activity
export async function POST(req: Request) {
    try {
        const worldState = getWorldState();
        const activeBots = getRandomBots(15); // Pick 15 random bots to post

        // Check if we have an API key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback: Generate mock posts without AI
            const mockPosts = generateMockPosts(activeBots, worldState);
            addPosts(mockPosts);
            return NextResponse.json({
                success: true,
                message: "Generated mock posts (no API key)",
                count: mockPosts.length,
                posts: mockPosts
            });
        }

        // Use Gemini to generate realistic posts
        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({ apiKey });

        const botProfiles = activeBots.map(b =>
            `- ${b.name} (@${b.handle}): ${b.major} ${b.year}, ${b.studentType}, interests: ${b.interests.join(", ")}, voice: ${b.voice}, themes: ${b.lifeThemes.join(", ")}`
        ).join("\n");

        const prompt = `You are simulating a campus social feed for PeerConnect, a mental-health support app at ASU.

CURRENT CONTEXT:
${worldState.todayContext}
Trending topics: ${worldState.trendingTopics.join(", ")}
Time of day: ${worldState.timeOfDay}

AVAILABLE STUDENTS TO POST:
${botProfiles}

RULES:
- Generate 8-12 realistic, casual posts
- Each post should feel like a real college student wrote it
- Include mix of: check-ins, wins, struggles, questions, funny moments
- Keep posts PG-13, supportive, non-clinical
- No medical advice or crisis content
- Include 0-4 comments per post from OTHER students
- Make timestamps realistic (posts from last 2 hours)
- Use emojis sparingly and naturally
- Reference ASU life (classes, campus, Tempe, Arizona)

Return ONLY valid JSON in this exact format:
{
  "posts": [
    {
      "bot_id": "bot_XX",
      "text": "the post content...",
      "post_type": "checkin|win|stuck|question|vent|advice|funny",
      "minutes_ago": 0-120,
      "allow_comments": true,
      "comments": [
        {"bot_id": "bot_YY", "text": "comment text...", "minutes_after_post": 5-60}
      ]
    }
  ]
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        let text = response.text || "";

        // Clean up the response - extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON in response");
        }

        const data = JSON.parse(jsonMatch[0]);

        // Enrich posts with bot data
        const enrichedPosts: GeneratedPost[] = data.posts.map((post: any) => {
            const bot = BOT_STUDENTS.find(b => b.id === post.bot_id) || getRandomBots(1)[0];
            const comments: GeneratedComment[] = (post.comments || []).map((c: any) => {
                const commentBot = BOT_STUDENTS.find(b => b.id === c.bot_id) || getRandomBots(1)[0];
                return {
                    bot_id: commentBot.id,
                    bot_handle: commentBot.handle,
                    bot_name: commentBot.name,
                    bot_photo: commentBot.profilePhoto,
                    text: c.text,
                    minutes_after_post: c.minutes_after_post || Math.floor(Math.random() * 30),
                };
            });

            return {
                bot_id: bot.id,
                bot_handle: bot.handle,
                bot_name: bot.name,
                bot_photo: bot.profilePhoto,
                major: bot.major,
                year: bot.year,
                text: post.text,
                post_type: post.post_type || "checkin",
                minutes_ago: post.minutes_ago || Math.floor(Math.random() * 60),
                allow_comments: post.allow_comments !== false,
                comments,
            };
        });

        addPosts(enrichedPosts);

        return NextResponse.json({
            success: true,
            message: "Generated AI posts",
            count: enrichedPosts.length,
            posts: enrichedPosts
        });

    } catch (error: any) {
        console.error("Error generating posts:", error);

        // Fallback to mock posts
        const worldState = getWorldState();
        const activeBots = getRandomBots(10);
        const mockPosts = generateMockPosts(activeBots, worldState);
        addPosts(mockPosts);

        return NextResponse.json({
            success: true,
            message: "Generated fallback mock posts",
            error: error.message,
            count: mockPosts.length,
            posts: mockPosts
        });
    }
}

// Use shared generator
import { generateMockPosts } from "@/lib/sim/generator";
