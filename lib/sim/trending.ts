
import { GoogleGenAI } from "@google/genai";
import { GeneratedPost } from "./world-state";

export interface TrendingTopic {
    tag: string;
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    description: string;
    count: number;
}

let cachedTopics: TrendingTopic[] = [];
let lastUpdated = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function extractTrendingTopics(posts: GeneratedPost[]): Promise<TrendingTopic[]> {
    try {
        const now = Date.now();
        if (cachedTopics.length > 0 && now - lastUpdated < CACHE_DURATION) {
            return cachedTopics;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return generateMockTrends();
        }

        const ai = new GoogleGenAI({ apiKey });

        // Feed recent post text to Gemini
        const recentPostsText = posts.slice(0, 30).map(p => p.text).join("\n---\n");

        const prompt = `
Analyze these recent social media posts from a college campus and identify the top 3-5 trending topics.
For each topic, provide a short hashtag (e.g., #Midterms), the general sentiment, and a very brief description (max 5 words).

POSTS:
${recentPostsText}

Return ONLY valid JSON:
{
  "topics": [
    { "tag": "#Hashtag", "sentiment": "positive|negative|neutral", "description": "Brief description", "count": number_of_mentions }
  ]
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            cachedTopics = data.topics;
            lastUpdated = now;
            return cachedTopics;
        }

        return generateMockTrends();

    } catch (error) {
        console.error("Error extracting trends:", error);
        return generateMockTrends();
    }
}

function generateMockTrends(): TrendingTopic[] {
    return [
        { tag: "#Midterms", sentiment: "negative", description: "Stress levels rising", count: 45 },
        { tag: "#Coffee", sentiment: "positive", description: "Fueling the study sessions", count: 32 },
        { tag: "#CampusHeat", sentiment: "neutral", description: "Arizona weather strikes again", count: 28 },
        { tag: "#WeekendVibes", sentiment: "positive", description: "Looking forward to rest", count: 15 },
    ];
}
