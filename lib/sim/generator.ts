
import { BotStudent, getRandomBots } from "./bots";
import { WorldState, GeneratedPost, GeneratedComment } from "./world-state";

export function generateMockPosts(bots: BotStudent[], worldState: WorldState): GeneratedPost[] {
    const postTemplates = [
        {
            type: "checkin" as const, templates: [
                "How's everyone doing today? ${timeContext}",
                "Just checking in - ${theme} is hitting different lately",
                "Day ${day} of the semester... we got this! 💪",
                "${topic} has been on my mind a lot",
            ]
        },
        {
            type: "win" as const, templates: [
                "Small win but I finally ${achievement}! 🎉",
                "Actually proud of myself today - ${achievement}",
                "Not to brag but... jk totally bragging - I did it! 😊",
                "Grateful for ${thing} today",
            ]
        },
        {
            type: "stuck" as const, templates: [
                "Anyone else struggling with ${topic}? Feeling kinda stuck",
                "Needed to vent... ${theme} is really getting to me",
                "How do y'all deal with ${topic}? Genuinely asking",
                "Not my best day... ${theme} 😔",
            ]
        },
        {
            type: "question" as const, templates: [
                "Question for my ${studentType} folks - ${question}?",
                "Is anyone else confused about ${topic}?",
                "Looking for advice on ${topic}... help?",
                "Where do y'all go to ${activity} on campus?",
            ]
        },
        {
            type: "funny" as const, templates: [
                "Me @ ${thing}: 🙃",
                "Normalize ${thing} tbh",
                "The way I thought ${expectation} but actually ${reality}",
                "Arizona weather really said ${weatherJoke}",
            ]
        },
    ];

    const topics = worldState.trendingTopics;
    const timeContexts = [
        "Monday energy is real",
        "surviving the week one day at a time",
        "weekend can't come soon enough",
        "this semester is flying by",
    ];

    return bots.slice(0, 8 + Math.floor(Math.random() * 5)).map((bot, idx) => {
        const typeInfo = postTemplates[idx % postTemplates.length];
        const template = typeInfo.templates[Math.floor(Math.random() * typeInfo.templates.length)];

        // Simple template filling
        let text = template
            .replace("${timeContext}", timeContexts[Math.floor(Math.random() * timeContexts.length)])
            .replace("${theme}", bot.lifeThemes[0] || "this")
            .replace("${day}", String(Math.floor(Math.random() * 60) + 1))
            .replace("${topic}", topics[Math.floor(Math.random() * topics.length)] || "life")
            .replace("${achievement}", ["finished my homework", "talked to a professor", "made a friend in class", "went to the gym"][Math.floor(Math.random() * 4)])
            .replace("${thing}", ["today", "this semester", "my schedule", "campus coffee"][Math.floor(Math.random() * 4)])
            .replace("${studentType}", bot.studentType)
            .replace("${question}", ["how do you stay organized", "what helps with motivation", "best study spots"][Math.floor(Math.random() * 3)])
            .replace("${activity}", ["study", "relax", "eat", "work out"][Math.floor(Math.random() * 4)])
            .replace("${expectation}", "college was gonna be easy")
            .replace("${reality}", "📚😵")
            .replace("${weatherJoke}", ["☀️ every single day", "100°F is 'nice'", "what is rain"][Math.floor(Math.random() * 3)]);

        // Generate 0-3 comments
        const numComments = Math.floor(Math.random() * 4);
        const commentBots = getRandomBots(numComments).filter(b => b.id !== bot.id);

        const commentTemplates = [
            "I feel this so much 💯",
            "Same here!",
            "You got this! 💪",
            "Sending good vibes your way",
            "Felt that",
            "Facts tho",
            "Literally me rn",
            "Hang in there!",
        ];

        const comments: GeneratedComment[] = commentBots.map((cb, ci) => ({
            bot_id: cb.id,
            bot_handle: cb.handle,
            bot_name: cb.name,
            bot_photo: cb.profilePhoto,
            text: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
            minutes_after_post: 5 + ci * 10 + Math.floor(Math.random() * 20),
        }));

        // Assign images to specific indices to ensure they appear
        const image = idx === 0 ? "/images/asu-campus.png" : (idx === 2 ? "/images/asu-library.png" : undefined);

        return {
            bot_id: bot.id,
            bot_handle: bot.handle,
            bot_name: bot.name,
            bot_photo: bot.profilePhoto,
            major: bot.major,
            year: bot.year,
            text,
            post_type: typeInfo.type,
            minutes_ago: idx * 8 + Math.floor(Math.random() * 15),
            allow_comments: true,
            comments,
            image
        };
    });
}
