
import { NextResponse } from "next/server";
import { getPosts } from "@/lib/sim/world-state";
import { extractTrendingTopics } from "@/lib/sim/trending";

// GET /api/trending
export async function GET() {
    const posts = getPosts(40);
    const topics = await extractTrendingTopics(posts);

    return NextResponse.json({
        success: true,
        topics
    });
}

// POST /api/sim/trendingTick - Force refresh (optional, but good for demo)
export async function POST() {
    const posts = getPosts(40);
    // In a real app we'd invalidate cache here
    const topics = await extractTrendingTopics(posts);

    return NextResponse.json({
        success: true,
        message: "Refreshed trending topics",
        topics
    });
}
