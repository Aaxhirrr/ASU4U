import { BOT_STUDENTS } from "./bots";

export type CapsuleType = "letter" | "snapshot" | "voice";
export type Mood = "stressed" | "lonely" | "motivated" | "tired" | "hopeful" | "anxious" | "neutral";
export type IdentityMode = "anonymous" | "revealable" | "named";

export interface Capsule {
    id: string;
    sender: {
        id: string;
        name: string;
        photo?: string; // Only if named or revealed
        major?: string;
    };
    type: CapsuleType;
    content: string; // Text content or transcript
    mediaUrl?: string; // Image for snapshot, audio for voice
    tags: string[]; // e.g., "finals", "homesick"
    moods: Mood[]; // Moods this is helpful for
    identityMode: IdentityMode;
    createdAt: string;
    isOpened: boolean;
}

export interface CheckIn {
    mood: Mood;
    moodScore: number; // 1-5
    tags: string[];
    journal?: string;
    timestamp: number;
}

// Mock "Ocean" of capsules
let CAPSULE_OCEAN: Capsule[] = [];

// Seed some initial capsules from bots
export function seedCapsules() {
    if (CAPSULE_OCEAN.length > 0) return;

    const scenarios = [
        {
            text: "Hey, I know finals are brutal right now. I failed my first calc midterm last year and thought it was over. But I'm still here, still an engineer. One test doesn't define you. Breathe.",
            tags: ["finals", "failure", "stress"],
            moods: ["stressed", "anxious", "tired"] as Mood[],
            type: "letter" as CapsuleType
        },
        {
            text: "To whoever needs this: You are not behind. You are exactly where you need to be. Social media is a lie lol.",
            tags: ["imposter syndrome", "comparison"],
            moods: ["lonely", "anxious"] as Mood[],
            type: "letter" as CapsuleType
        },
        {
            text: "Look at this sunset from the library roof. Reminded me that the world is big and my problems are small. Hope this helps you too.",
            mediaUrl: "/images/asu-campus.png", // reusing existing image
            tags: ["nature", "perspective"],
            moods: ["tired", "neutral", "hopeful"] as Mood[],
            type: "snapshot" as CapsuleType
        },
        {
            text: "Just a reminder to drink water and unclench your jaw. You're doing great.",
            tags: ["self-care"],
            moods: ["stressed", "tired"] as Mood[],
            type: "voice" as CapsuleType
        }
    ];

    CAPSULE_OCEAN = scenarios.map((s, i) => {
        const bot = BOT_STUDENTS[i % BOT_STUDENTS.length];
        return {
            id: `seed-${i}`,
            sender: {
                id: bot.handle,
                name: bot.name,
                // photo: bot.photo, // BotStudent doesn't have photo, using handle/avatar logic elsewhere
                major: bot.major
            },
            type: s.type,
            content: s.text,
            mediaUrl: s.mediaUrl,
            tags: s.tags,
            moods: s.moods,
            identityMode: Math.random() > 0.5 ? "anonymous" : "revealable",
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(), // Past 5 days
            isOpened: false
        };
    });
}

// Find a matching capsule for a check-in
export function findMatchingCapsule(checkIn: CheckIn): Capsule | null {
    // 1. Filter unrelated or locked capsules (mock: just use open pool)
    const candidates = CAPSULE_OCEAN.filter(c => !c.isOpened);

    if (candidates.length === 0) return null;

    // 2. Score candidates
    const scored = candidates.map(c => {
        let score = 0;

        // Mood match
        if (c.moods.includes(checkIn.mood)) score += 5;

        // Tag match
        const commonTags = c.tags.filter(t => checkIn.tags.includes(t));
        score += commonTags.length * 3;

        // Random jitter for variety
        score += Math.random() * 2;

        return { capsule: c, score };
    });

    // 3. Sort and pick top
    scored.sort((a, b) => b.score - a.score);

    return scored.length > 0 ? scored[0].capsule : null;
}

export function dropCapsule(capsule: Capsule) {
    CAPSULE_OCEAN.unshift(capsule);
}

export function getMyCapsules(userId: string) {
    // Mock: just return a subset
    return {
        sent: CAPSULE_OCEAN.filter(c => c.sender.id === userId),
        received: CAPSULE_OCEAN.filter(c => c.isOpened) // Mock: assuming opened means "received by me" for now
    };
}
