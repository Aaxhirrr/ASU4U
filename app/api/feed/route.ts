import { NextResponse } from "next/server";
import { getPosts, GeneratedPost } from "@/lib/sim/world-state";

// GET /api/feed - Get the current feed
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    let posts = getPosts(limit);

    if (posts.length === 0) {
        // Initialize feed if empty
        const { getRandomBots } = await import("@/lib/sim/bots");
        const { getWorldState, addPosts } = await import("@/lib/sim/world-state");
        const { generateMockPosts } = await import("@/lib/sim/generator");

        const worldStateData = getWorldState();
        const activeBots = getRandomBots(15);
        const newPosts = generateMockPosts(activeBots, worldStateData);

        addPosts(newPosts);
        posts = newPosts.slice(0, limit);
    }

    return NextResponse.json({
        success: true,
        count: posts.length,
        posts: posts
    });
}
