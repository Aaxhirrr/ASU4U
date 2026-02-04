// World state for the simulated campus

export interface WorldState {
    todayContext: string;
    trendingTopics: string[];
    groupVibes: Record<string, string>;
    currentWeek: string;
    timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

// Generate dynamic world state based on real time
export function getWorldState(): WorldState {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();

    // Determine time of day
    let timeOfDay: WorldState["timeOfDay"];
    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    // Simulate semester context based on month
    const month = now.getMonth();
    let currentWeek: string;
    let todayContext: string;

    if (month === 0 || month === 1) {
        // Jan-Feb: Spring semester start
        currentWeek = "early-spring";
        todayContext = dayOfMonth < 15
            ? "First weeks of spring semester. Everyone's still figuring out schedules."
            : "Spring semester settling in. Study groups forming.";
    } else if (month === 2 || month === 3) {
        // Mar-Apr: Spring midterms and finals
        currentWeek = "spring-midterms";
        todayContext = month === 2
            ? "Spring break coming up! Midterms stress is real."
            : "Post-spring break. Finals are approaching fast.";
    } else if (month === 4) {
        // May: Finals and graduation
        currentWeek = "finals-week";
        todayContext = "Finals week chaos. Seniors are graduating. Bittersweet vibes.";
    } else if (month >= 5 && month <= 7) {
        // Summer
        currentWeek = "summer";
        todayContext = "Summer session. Campus is quieter but we're still here grinding.";
    } else if (month === 8 || month === 9) {
        // Aug-Sept: Fall start
        currentWeek = "fall-start";
        todayContext = month === 8
            ? "Welcome week! New students everywhere. Energy is high."
            : "Fall semester in full swing. Football season! 🏈";
    } else if (month === 10) {
        // Oct: Midterms
        currentWeek = "fall-midterms";
        todayContext = "Halloween and midterms. Spooky season meets stress season.";
    } else {
        // Nov-Dec: Finals
        currentWeek = "fall-finals";
        todayContext = month === 10
            ? "Thanksgiving break soon! Pushing through the semester."
            : "Finals week. Winter break is so close. We got this!";
    }

    // Day-specific vibes
    if (dayOfWeek === 0) todayContext += " Lazy Sunday vibes.";
    else if (dayOfWeek === 1) todayContext += " Monday grind begins.";
    else if (dayOfWeek === 5) todayContext += " TGIF! Weekend plans anyone?";
    else if (dayOfWeek === 6) todayContext += " Saturday night in Tempe!";

    // Trending topics that rotate
    const allTopics = [
        "homesickness", "roommate drama", "study tips", "meal prep",
        "career fairs", "internships", "burnout", "self-care",
        "making friends", "relationship advice", "money stress", "job hunting",
        "imposter syndrome", "mental health check", "gym motivation", "sleep schedule",
        "professor struggles", "group project pain", "campus events", "club meetings"
    ];

    // Pick 3-5 trending topics based on date (pseudo-random but consistent per day)
    const topicSeed = dayOfMonth + month * 31;
    const trendingTopics = allTopics
        .sort((a, b) => {
            const aHash = a.charCodeAt(0) * topicSeed % 100;
            const bHash = b.charCodeAt(0) * topicSeed % 100;
            return aHash - bHash;
        })
        .slice(0, 4 + (topicSeed % 2));

    // Group-specific vibes
    const groupVibes: Record<string, string> = {
        "international": timeOfDay === "night"
            ? "Late night calls home and visa talk"
            : "Cultural exchange and food recommendations",
        "first-gen": currentWeek.includes("finals")
            ? "Supporting each other through finals stress"
            : "Navigating college life together",
        "out-of-state": month >= 10
            ? "Missing home, planning holiday travel"
            : "Exploring Arizona and making it feel like home",
        "mental-health": "Safe space vibes. Sharing wins and struggles.",
        "transfer": "Helping each other adjust and find resources",
    };

    return {
        todayContext,
        trendingTopics,
        groupVibes,
        currentWeek,
        timeOfDay,
    };
}

// Post types for structured generation
export type PostType = "checkin" | "win" | "stuck" | "question" | "vent" | "advice" | "funny";

export interface GeneratedPost {
    bot_id: string;
    bot_handle: string;
    bot_name: string;
    bot_photo: string;
    major: string;
    year: string;
    text: string;
    image?: string;
    post_type: PostType;
    minutes_ago: number;
    allow_comments: boolean;
    comments: GeneratedComment[];
}

export interface GeneratedComment {
    bot_id: string;
    bot_handle: string;
    bot_name: string;
    bot_photo: string;
    text: string;
    minutes_after_post: number;
}

export interface GeneratedMessage {
    bot_id: string;
    bot_handle: string;
    bot_name: string;
    bot_photo: string;
    text: string;
    minutes_ago: number;
    reply_to?: string; // optional reference to another message
}

// In-memory store for posts and messages (hackathon simplicity)
export let postStore: GeneratedPost[] = [];
export let messageStore: Record<string, GeneratedMessage[]> = {};
export let dmStore: Record<string, { summary: string; messages: { role: string; text: string; timestamp: string }[] }> = {};

export function addPosts(posts: GeneratedPost[]) {
    postStore = [...posts, ...postStore].slice(0, 100); // Keep last 100 posts
}

export function getPosts(limit: number = 20): GeneratedPost[] {
    return postStore.slice(0, limit);
}

export function addGroupMessages(groupId: string, messages: GeneratedMessage[]) {
    if (!messageStore[groupId]) messageStore[groupId] = [];
    messageStore[groupId] = [...messages, ...messageStore[groupId]].slice(0, 50);
}

export function getGroupMessages(groupId: string, limit: number = 30): GeneratedMessage[] {
    return (messageStore[groupId] || []).slice(0, limit);
}

export function getDmThread(threadId: string) {
    if (!dmStore[threadId]) {
        dmStore[threadId] = { summary: "", messages: [] };
    }
    return dmStore[threadId];
}

export function addDmMessage(threadId: string, role: string, text: string) {
    const thread = getDmThread(threadId);
    thread.messages.push({ role, text, timestamp: new Date().toISOString() });
    // Keep last 30 messages
    if (thread.messages.length > 30) {
        thread.messages = thread.messages.slice(-30);
    }
}
