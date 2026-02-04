"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, Send, ArrowLeft, Search, MoreHorizontal, Users, UsersRound, BookOpen, User, Loader2, Play, Compass, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/bottom-nav";
import "@/styles/peerconnect.css";
import { BOT_STUDENTS, getRandomBots } from "@/lib/sim/bots";
import { getMyCapsules, Capsule } from "@/lib/sim/capsule-state";
import { CapsuleReveal } from "@/components/capsule-reveal";

// Use the bot definition from lib
interface ChatFriend {
    id: string;
    name: string;
    major: string;
    profilePhoto: string;
    unreadCount: number;
    lastMessageTime: string;
}

const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
} as const;

const messageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
} as const;


export default function MessagesPage() {
    const [selectedFriend, setSelectedFriend] = useState<ChatFriend | null>(null);
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tab State
    const [activeTab, setActiveTab] = useState<"chats" | "groups">("chats");
    const [myCapsules, setMyCapsules] = useState<{ sent: Capsule[], received: Capsule[] }>({ sent: [], received: [] });
    const [viewingCapsule, setViewingCapsule] = useState<Capsule | null>(null);

    // Store messages by friend ID
    const [messages, setMessages] = useState<Record<string, any[]>>({});

    // Friend list
    const [friends, setFriends] = useState<ChatFriend[]>([]);

    const filteredFriends = friends.filter(f =>
        f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.major?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMyCapsules(getMyCapsules("current-user"));
        scrollToBottom();
    }, [messages, selectedFriend, isTyping, activeTab]);

    useEffect(() => {
        // Load random bots - increased to 20 to fill page
        const bots = getRandomBots(20).map(bot => ({
            id: bot.id,
            name: bot.name,
            major: bot.major,
            profilePhoto: bot.profilePhoto,
            unreadCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0, // 30% chance of unread messages
            lastMessageTime: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString() // Random time within last 3 days
        }));

        // Sort by unread count first, then time
        bots.sort((a, b) => {
            if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
            if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
            return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });

        setFriends(bots);

        // Initialize messages
        const initialMsgs: Record<string, any[]> = {};
        bots.forEach(f => {
            initialMsgs[f.id] = [
                {
                    id: `init-${f.id}`,
                    senderId: f.id,
                    content: "Hey! How's your semester going?",
                    timestamp: f.lastMessageTime
                }
            ];
        });
        setMessages(prev => ({ ...prev, ...initialMsgs }));
    }, []);

    const handleSend = async () => {
        if (!message.trim() || !selectedFriend) return;

        const currentFriendId = selectedFriend.id;
        const userMsgContent = message.trim();

        const newMessage = {
            id: Date.now().toString(),
            senderId: "current",
            content: userMsgContent,
            timestamp: new Date().toISOString(),
        };

        // Optimistic update
        setMessages(prev => ({
            ...prev,
            [currentFriendId]: [...(prev[currentFriendId] || []), newMessage],
        }));
        setMessage("");
        setIsTyping(true);

        // Call API for bot reply
        try {
            const history = (messages[currentFriendId] || []).map(m => ({
                role: m.senderId === "current" ? "user" : "model",
                content: m.content
            }));

            const res = await fetch(`/api/dm/${currentFriendId}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userMessage: userMsgContent,
                    botId: currentFriendId,
                    previousMessages: history
                })
            });

            const data = await res.json();

            if (data.success && data.reply) {
                const botMessage = {
                    id: (Date.now() + 1).toString(),
                    senderId: currentFriendId,
                    content: data.reply,
                    timestamp: new Date().toISOString(),
                };

                setMessages(prev => ({
                    ...prev,
                    [currentFriendId]: [...(prev[currentFriendId] || []), botMessage],
                }));
            }
        } catch (error) {
            console.error("Failed to get reply", error);
        } finally {
            setIsTyping(false);
        }
    };

    const currentMessages = selectedFriend ? (messages[selectedFriend.id] || []) : [];

    return (
        <div className="peerconnect-page h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
            <div className="max-w-6xl mx-auto px-4 py-4 w-full flex-1 flex flex-col overflow-hidden pb-20">
                <motion.div
                    className="flex gap-4 flex-1 min-h-0 h-[calc(100vh-140px)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Friends List - Hidden on mobile when chat is open */}
                    <motion.div
                        className={`peerconnect-user-card w-full md:w-80 shrink-0 flex flex-col overflow-hidden ${selectedFriend ? "hidden md:flex" : "flex"}`}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="py-4 px-4 border-b shrink-0 space-y-4 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <motion.div whileHover={{ rotate: 15 }}>
                                        <MessageCircle className="h-5 w-5 text-[#8C1C46]" />
                                    </motion.div>
                                    <span className="font-semibold text-[#8C1C46]">Messaging</span>
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    placeholder="Search messages"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="peerconnect-search w-full h-9 text-sm pl-9"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex gap-2 mb-4 px-1">
                                <button
                                    onClick={() => setActiveTab("chats")}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === "chats" ? "bg-[#8C1C46]/10 text-[#8C1C46]" : "text-gray-500 hover:bg-gray-50"}`}
                                >
                                    Direct Messages
                                </button>
                                <button
                                    onClick={() => setActiveTab("groups")}
                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeTab === "groups" ? "bg-[#8C1C46]/10 text-[#8C1C46]" : "text-gray-500 hover:bg-gray-50"}`}
                                >
                                    Group Chats
                                </button>
                            </div>

                            {activeTab === "chats" ? (
                                filteredFriends.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <p>No conversations found</p>
                                    </div>
                                ) : (
                                    <motion.div variants={listVariants} initial="hidden" animate="visible">
                                        {filteredFriends.map((friend) => (
                                            <motion.button
                                                key={friend.id}
                                                variants={itemVariants}
                                                onClick={() => {
                                                    setSelectedFriend(friend);
                                                    // Clear unread on click
                                                    setFriends(prev => prev.map(f => f.id === friend.id ? { ...f, unreadCount: 0 } : f));
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors border-b border-gray-50 ${selectedFriend?.id === friend.id ? "bg-amber-50/50 border-l-4 border-l-[#8C1C46]" : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                <div className="relative">
                                                    <div className="peerconnect-avatar w-12 h-12 shrink-0 overflow-hidden bg-gray-200">
                                                        {friend.profilePhoto ? (
                                                            <img src={friend.profilePhoto} alt={friend.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            friend.name?.charAt(0) || "?"
                                                        )}
                                                    </div>
                                                    {friend.unreadCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8C1C46] text-[10px] font-bold text-white ring-2 ring-white">
                                                            {friend.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-0.5">
                                                        <p className={`truncate text-gray-900 ${friend.unreadCount > 0 ? "font-bold" : "font-medium"}`}>{friend.name}</p>
                                                        <span className={`text-[10px] ${friend.unreadCount > 0 ? "text-[#8C1C46] font-bold" : "text-gray-400"}`}>
                                                            {new Date(friend.lastMessageTime).getHours()}:{new Date(friend.lastMessageTime).getMinutes().toString().padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs truncate ${friend.unreadCount > 0 ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
                                                        {friend.unreadCount > 0 ? "Sent you a message" : friend.major}
                                                    </p>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )
                            ) : (
                                // GROUPS TAB
                                <div className="space-y-1">
                                    {[
                                        { id: "1", name: "International Students", members: "1.2k members", icon: "🌍" },
                                        { id: "2", name: "First-Gen Scholars", members: "856 members", icon: "🎓" },
                                        { id: "3", name: "CSE 110 Study Group", members: "45 members", icon: "💻" },
                                        { id: "5", name: "Sun Devil Hiking", members: "3.5k members", icon: "🥾" },
                                    ].map((group) => (
                                        <Link
                                            key={group.id}
                                            href={`/groups`}
                                            className="w-full flex items-center gap-3 px-4 py-4 text-left transition-colors border-b border-gray-50 hover:bg-gray-50"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-xl shrink-0 border border-amber-100">
                                                {group.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <p className="font-medium truncate text-gray-900">{group.name}</p>
                                                    <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">ACTIVE</span>
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">{group.members} • 5 new messages</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </Link>
                                    ))}

                                    <div className="p-4 mt-4">
                                        <Link href="/groups" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-[#8C1C46] hover:text-[#8C1C46] transition-colors font-medium text-sm">
                                            <UsersRound className="w-4 h-4" />
                                            Discover More Groups
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Chat Area */}
                    <AnimatePresence mode="wait">
                        {selectedFriend ? (
                            <motion.div
                                key="chat-window"
                                className="peerconnect-user-card flex-1 flex flex-col h-full overflow-hidden"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Chat Header */}
                                <div className="py-3 px-4 border-b shrink-0 bg-white shadow-sm z-10 flex items-center gap-3">
                                    <button onClick={() => setSelectedFriend(null)} className="md:hidden p-2 -ml-2 text-gray-500">
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <div className="peerconnect-avatar w-10 h-10 overflow-hidden bg-gray-200">
                                        {selectedFriend.profilePhoto ? (
                                            <img src={selectedFriend.profilePhoto} alt={selectedFriend.name} className="w-full h-full object-cover" />
                                        ) : (
                                            selectedFriend.name?.charAt(0) || "?"
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{selectedFriend.name}</h3>
                                        <p className="text-xs text-gray-500">{selectedFriend.major}</p>
                                    </div>
                                </div>

                                {/* Messages Feed */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF9]" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                    {currentMessages.map((msg, idx) => {
                                        const isOwn = msg.senderId === "current";
                                        return (
                                            <motion.div
                                                key={msg.id || idx}
                                                variants={messageVariants}
                                                initial="hidden"
                                                animate="visible"
                                                className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                                            >
                                                {!isOwn && (
                                                    <div className="peerconnect-avatar w-8 h-8 shrink-0 overflow-hidden bg-gray-200 mt-auto">
                                                        {selectedFriend.profilePhoto ? (
                                                            <img src={selectedFriend.profilePhoto} alt={selectedFriend.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            selectedFriend.name?.charAt(0) || "?"
                                                        )}
                                                    </div>
                                                )}
                                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${isOwn
                                                    ? "bg-[#8C1C46] text-white rounded-br-sm"
                                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-3"
                                        >
                                            <div className="peerconnect-avatar w-8 h-8 bg-gray-200 mt-auto overflow-hidden">
                                                {selectedFriend.profilePhoto ? (
                                                    <img src={selectedFriend.profilePhoto} alt={selectedFriend.name} className="w-full h-full object-cover" />
                                                ) : null}
                                            </div>
                                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm">
                                                <div className="flex gap-1">
                                                    <motion.div
                                                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    />
                                                    <motion.div
                                                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                    />
                                                    <motion.div
                                                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Type a message..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                            className="peerconnect-search flex-1 rounded-full h-11 px-4 bg-gray-50 focus:bg-white transition-colors"
                                            disabled={isTyping}
                                        />
                                        <motion.button
                                            onClick={handleSend}
                                            disabled={!message.trim() || isTyping}
                                            className="h-11 w-11 rounded-full bg-[#8C1C46] text-white flex items-center justify-center disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Send className="h-5 w-5 ml-0.5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty-state"
                                className="hidden md:flex flex-1 items-center justify-center bg-white/50 m-4 rounded-3xl border border-dashed border-gray-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="text-center p-8 max-w-sm">
                                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageCircle className="h-10 w-10 text-amber-500/50" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Messages</h3>
                                    <p className="text-gray-500">Select a conversation to start chatting with your peers.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Capsule Viewer */}
            <AnimatePresence>
                {viewingCapsule && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <CapsuleReveal capsule={viewingCapsule} onClose={() => setViewingCapsule(null)} />
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
