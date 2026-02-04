export type FutureMessageStatus = "pending" | "delivered" | "read";
export type FutureMessageType = "text" | "voice" | "photo" | "video";
export type FutureMessageTriggerType = "scheduled" | "mood" | "milestone";

export interface FutureMessageTrigger {
    type: FutureMessageTriggerType;
    // For scheduled
    date?: string; // ISO date string
    // For mood
    mood?: string; // "stressed", "lonely", "need-support"
    checkInCount?: number; // "after 3 stressed check-ins"
    // For milestone
    milestoneLabel?: string; // "When I complete X"
}

export interface FutureMessage {
    id: string;
    createdAt: string;
    type: FutureMessageType;
    content: string; // Text content or URL to media
    mediaUrl?: string; // For photo/video/voice
    duration?: number; // For voice/video
    trigger: FutureMessageTrigger;
    status: FutureMessageStatus;
    isFromPast: boolean; // Just a flag to help UI context "Past me left this..."
}
