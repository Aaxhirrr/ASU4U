"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UsersRound, Users, Send, MessageCircle, BookOpen, User, UserPlus, UserMinus } from "lucide-react";
import "@/styles/peerconnect.css";

// Mock group data
const MOCK_GROUPS: Record<string, {
    id: string;
    name: string;
    description: string;
    rules: string[];
    members: string[];
}> = {
    "1": {
        id: "1",
        name: "International Students @ ASU",
        description: "A supportive community for international students navigating life at ASU. Share experiences, get advice, and make friends!",
        rules: ["Be respectful to all members", "No hate speech or discrimination", "Keep conversations supportive"],
        members: ["1", "2", "3", "4", "5"],
    },
    "2": {
        id: "2",
        name: "First-Gen College Students",
        description: "Connect with fellow first-generation college students. We support each other through the unique challenges we face.",
        rules: ["Share resources freely", "Encourage each other", "Respect privacy"],
        members: ["1", "2", "3"],
    },
    "3": {
        id: "3",
        name: "Out-of-State Sun Devils",
        description: "For students who moved to Arizona from other states. Let's explore our new home together!",
        rules: ["Welcome newcomers", "Share local tips", "Plan group activities"],
        members: ["1", "2"],
    },
};

// Mock messages
const MOCK_MESSAGES: Record<string, { id: string; userId: string; userName: string; userPhoto?: string; content: string; timestamp: string }[]> = {
    // Start with empty chats to test AI responses
};

export default function GroupDetailPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.id as string;

    const group = MOCK_GROUPS[groupId];
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState(MOCK_MESSAGES[groupId] || []);
    const [isMember, setIsMember] = useState(false);

    if (!group) {
        return (
            <div className="peerconnect-page min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
                <div className="peerconnect-user-card max-w-sm text-center p-6">
                    <h2 className="text-xl font-semibold mb-2" style={{ color: 'hsl(340 20% 15%)' }}>Group not found</h2>
                    <p className="mb-4" style={{ color: 'hsl(340 10% 45%)' }}>This group doesn't exist.</p>
                    <button className="peerconnect-befriend-btn" onClick={() => router.push('/groups')}>Back to Groups</button>
                </div>
            </div>
        );
    }

    const handleSend = async () => {
        console.log("🚀 handleSend CALLED!");
        if (!newMessage.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            userId: "current",
            userName: "You",
            content: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);
        const userMessageText = newMessage.trim();
        setNewMessage("");

        // Call API to get AI responses
        try {
            console.log("Calling API with message:", userMessageText);
            const response = await fetch(`/api/groups/${groupId}/chat/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userMessage: userMessageText,
                    userName: "You",
                    groupContext: {
                        groupName: group.name,
                        groupDescription: group.description,
                    }
                }),
            });

            if (!response.ok) {
                console.error("API error:", response.status, response.statusText);
                throw new Error("Failed to get responses");
            }

            const data = await response.json();
            console.log("API response:", data);

            if (!data.responses) {
                console.error("No responses in API data:", data);
                return;
            }

            // Add responses with staggered delays
            data.responses.forEach((aiResponse: any, index: number) => {
                console.log(`Scheduling response ${index + 1} with delay ${aiResponse.delay}ms:`, aiResponse.content);
                setTimeout(() => {
                    const aiMsg = {
                        id: Date.now().toString() + Math.random(),
                        userId: aiResponse.userId,
                        userName: aiResponse.userName,
                        userPhoto: aiResponse.userPhoto,
                        content: aiResponse.content,
                        timestamp: new Date().toISOString(),
                    };
                    console.log("Adding AI message:", aiMsg.userName, aiMsg.content);
                    setMessages(prev => [...prev, aiMsg]);
                }, aiResponse.delay);
            });
        } catch (error) {
            console.error("Failed to get AI responses:", error);
        }
    };

    return (
        <div className="peerconnect-page min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
            <div className="max-w-4xl mx-auto px-4 py-4 w-full flex-1 flex flex-col min-h-0 pb-20">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <button
                        onClick={() => router.push('/groups')}
                        className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-gray-100"
                        data-testid="button-back-group"
                    >
                        <ArrowLeft className="h-5 w-5" style={{ color: 'hsl(340 10% 45%)' }} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-bold truncate" style={{ color: 'hsl(340 20% 15%)' }}>{group.name}</h1>
                        <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>{group.members.length} members</p>
                    </div>
                    {isMember ? (
                        <button
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border"
                            style={{ borderColor: 'hsl(40 15% 80%)', color: 'hsl(340 10% 45%)' }}
                            onClick={() => setIsMember(false)}
                        >
                            <UserMinus className="h-4 w-4" />
                            Leave
                        </button>
                    ) : (
                        <button className="peerconnect-befriend-btn" onClick={() => setIsMember(true)}>
                            <UserPlus className="h-4 w-4" />
                            Join
                        </button>
                    )}
                </div>

                {/* Group Info Card */}
                <div className="peerconnect-user-card mb-4 shrink-0">
                    <div className="py-3 px-4">
                        <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>{group.description}</p>
                        {group.rules && group.rules.length > 0 && (
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'hsl(40 15% 90%)' }}>
                                <p className="text-xs font-medium mb-2" style={{ color: 'hsl(340 20% 15%)' }}>Group Rules:</p>
                                <ul className="text-xs space-y-1" style={{ color: 'hsl(340 10% 45%)' }}>
                                    {group.rules.map((rule, idx) => (
                                        <li key={idx}>• {rule}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="peerconnect-user-card flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="py-3 px-4 border-b shrink-0" style={{ borderColor: 'hsl(40 15% 90%)' }}>
                        <h3 className="text-sm font-semibold" style={{ color: 'hsl(340 20% 15%)' }}>Group Chat</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'hsl(40 30% 96% / 0.5)' }}>
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                <UsersRound className="h-12 w-12 mb-4" style={{ color: 'hsl(340 10% 45% / 0.3)' }} />
                                <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>
                                    No messages yet. Start the conversation!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg) => {
                                    const isOwn = msg.userId === "current";
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex items-start gap-2 ${isOwn && "flex-row-reverse"}`}
                                        >
                                            {!isOwn && (
                                                <div className="peerconnect-avatar w-8 h-8 shrink-0 text-xs">
                                                    {msg.userPhoto ? (
                                                        <img src={msg.userPhoto} alt={msg.userName} />
                                                    ) : (
                                                        msg.userName?.charAt(0) || "?"
                                                    )}
                                                </div>
                                            )}
                                            <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                                                {!isOwn && (
                                                    <p className="text-xs font-medium mb-1" style={{ color: 'hsl(340 20% 15%)' }}>{msg.userName}</p>
                                                )}
                                                <div
                                                    className={`rounded-2xl px-4 py-2 inline-block ${isOwn
                                                        ? "rounded-br-md"
                                                        : "rounded-bl-md border"
                                                        }`}
                                                    style={isOwn ? {
                                                        backgroundColor: 'hsl(340 66% 33%)',
                                                        color: 'white'
                                                    } : {
                                                        backgroundColor: 'white',
                                                        borderColor: 'hsl(40 15% 90%)',
                                                        color: 'hsl(340 20% 15%)'
                                                    }}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t shrink-0" style={{ borderColor: 'hsl(40 15% 90%)', backgroundColor: 'white' }}>
                        <div className="flex gap-2">
                            <input
                                placeholder="Write a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                className="peerconnect-search flex-1 rounded-full"
                                data-testid="input-group-message"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!newMessage.trim()}
                                className="peerconnect-befriend-btn rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0 disabled:opacity-50"
                                data-testid="button-send-group-message"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="peerconnect-nav fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-around h-16">
                        <Link href="/match" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <Users className="h-5 w-5" />
                            <span className="text-xs">Match</span>
                        </Link>
                        <Link href="/groups" className="nav-item active flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ backgroundColor: 'hsl(40 20% 94%)', color: 'hsl(340 66% 33%)' }}>
                            <UsersRound className="h-5 w-5" />
                            <span className="text-xs">Groups</span>
                        </Link>
                        <Link href="/journal" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <BookOpen className="h-5 w-5" />
                            <span className="text-xs">Journal</span>
                        </Link>
                        <Link href="/messages" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-xs">Messages</span>
                        </Link>
                        <Link href="/profile/current" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <User className="h-5 w-5" />
                            <span className="text-xs sr-only md:not-sr-only">Profile</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}
