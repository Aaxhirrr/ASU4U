"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UsersRound, Search, Filter, Plus, ChevronRight, User, MessageCircle, BookOpen, Users, Loader2, Sparkles, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/bottom-nav";
import "@/styles/peerconnect.css";

// Interface for API data
interface ChatMessage {
    bot_id: string;
    bot_handle: string;
    bot_name: string;
    bot_photo: string;
    text: string;
    minutes_ago: number;
}

const GROUPS_DATA = [
    // Mental Health at top
    { id: "mh1", name: "Mental Health Support 💚", members: 2340, category: "Mental Health", campus: "All", description: "A safe, judgment-free space for students navigating stress, anxiety, or just need someone to talk to.", active: true },
    { id: "mh2", name: "Anxiety & Stress Relief", members: 1890, category: "Mental Health", campus: "Tempe", description: "Share coping strategies and support each other through tough times.", active: true },
    { id: "mh3", name: "Wellness Warriors", members: 1240, category: "Mental Health", campus: "Downtown Phoenix", description: "Mindfulness, meditation, and mental wellness practices.", active: false },

    // Cultural Groups (reduced)
    { id: "c1", name: "International Students @ ASU", members: 3240, category: "Cultural", campus: "Tempe", description: "A home for students from around the world.", active: true },
    { id: "c2", name: "Indian Students Association", members: 1856, category: "Cultural", campus: "Tempe", description: "Celebrating Indian culture, festivals, and traditions.", active: true },
    { id: "c3", name: "Black Student Union", members: 1450, category: "Cultural", campus: "Downtown Phoenix", description: "Empowering Black excellence at ASU.", active: true },
    { id: "c4", name: "Latino/Latina Unidos", members: 1680, category: "Cultural", campus: "West Valley", description: "¡Bienvenidos! Celebrating Hispanic heritage together.", active: true },
    { id: "c5", name: "Asian Pacific Islander Coalition", members: 2100, category: "Cultural", campus: "Tempe", description: "Celebrating AAPI culture and community.", active: false },

    // Identity Groups
    { id: "i1", name: "First-Gen Scholars", members: 1856, category: "Identity", campus: "All", description: "Navigating college as the first in our families.", active: true },
    { id: "i2", name: "LGBTQ+ Devils", members: 1200, category: "Identity", campus: "Tempe", description: "Pride, support, and community for LGBTQ+ Sun Devils.", active: true },
    { id: "i3", name: "Women in STEM", members: 2100, category: "Identity", campus: "Polytechnic", description: "Empowering women in science, tech, engineering & math.", active: true },
    { id: "i4", name: "Veterans @ ASU", members: 680, category: "Identity", campus: "Downtown Phoenix", description: "Supporting student veterans in their academic journey.", active: false },

    // Academic Groups
    { id: "a1", name: "CSE 110 Study Group", members: 145, category: "Academic", campus: "Tempe", description: "Help with Java assignments and exam prep!", active: false },
    { id: "a2", name: "Pre-Med Society", members: 1250, category: "Academic", campus: "Tempe", description: "MCAT prep, research opportunities & med school advice.", active: true },
    { id: "a3", name: "Barrett Honors College", members: 3210, category: "Academic", campus: "Tempe", description: "The Barrett community hub.", active: true },
    { id: "a4", name: "Business Majors Network", members: 2800, category: "Academic", campus: "Downtown Phoenix", description: "W.P. Carey students networking and career prep.", active: true },
    { id: "a5", name: "Engineering Club", members: 1900, category: "Academic", campus: "Polytechnic", description: "Fulton Engineering students connect here.", active: true },

    // Social & Interest Groups
    { id: "s1", name: "Sun Devil Hiking", members: 4500, category: "Social", campus: "All", description: "Exploring Arizona's best trails together.", active: true },
    { id: "s2", name: "ASU Photography Club", members: 720, category: "Social", campus: "West Valley", description: "Photo walks, critiques, and gear talk.", active: false },
    { id: "s3", name: "Gaming Devils", members: 2100, category: "Social", campus: "Online", description: "PC, console, and board game enthusiasts.", active: true },
    { id: "s4", name: "Fitness & Gym Buddies", members: 1560, category: "Social", campus: "Tempe", description: "Find workout partners and share fitness tips.", active: true },
    { id: "s5", name: "Movie & TV Club", members: 890, category: "Social", campus: "Downtown Phoenix", description: "Weekly watch parties and discussions.", active: false },
];

const CATEGORIES = ["All", "Mental Health", "Cultural", "Identity", "Academic", "Social"];
const CAMPUSES = ["All", "Tempe", "Downtown Phoenix", "West Valley", "Polytechnic", "Online"];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

export default function GroupsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeCampus, setActiveCampus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [groupMessages, setGroupMessages] = useState<Record<string, ChatMessage[]>>({});
    const [loadingChat, setLoadingChat] = useState(false);
    const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
    const [messageInput, setMessageInput] = useState("");

    const filteredGroups = GROUPS_DATA.filter(group =>
        (activeCategory === "All" || group.category === activeCategory) &&
        (activeCampus === "All" || group.campus === activeCampus || group.campus === "All") &&
        (group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Auto-load chat and auto-join when entering a group
    useEffect(() => {
        if (selectedGroup) {
            const group = GROUPS_DATA.find(g => g.id === selectedGroup);
            if (group) {
                loadGroupChat(group.id, group.name, group.description);
                // Auto-join the user to the group
                setJoinedGroups(prev => {
                    const next = new Set(prev);
                    next.add(group.id);
                    return next;
                });
            }
        }
    }, [selectedGroup]);

    const loadGroupChat = async (groupId: string, name: string, description: string) => {
        // If we already have messages, just update state unless empty
        if (groupMessages[groupId]) return;

        setLoadingChat(true);
        try {
            const res = await fetch(`/api/groups/${groupId}/chat/autoplay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    groupName: name,
                    groupDescription: description
                })
            });
            const data = await res.json();

            if (data.success && data.messages) {
                setGroupMessages(prev => ({
                    ...prev,
                    [groupId]: data.messages
                }));
            }
        } catch (error) {
            console.error("Failed to load group chat", error);
        } finally {
            setLoadingChat(false);
        }
    };

    const handleJoinGroup = (groupId: string) => {
        setJoinedGroups(prev => {
            const next = new Set(prev);
            next.add(groupId);
            return next;
        });
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedGroup) return;

        const group = GROUPS_DATA.find(g => g.id === selectedGroup);
        if (!group) return;

        const userMessage = messageInput.trim();

        const newMessage: ChatMessage = {
            bot_id: "current",
            bot_handle: "me",
            bot_name: "You",
            bot_photo: "", // Empty for avatar fallback
            text: userMessage,
            minutes_ago: 0
        };

        // 1. Add user message immediately
        const updatedMessages = [...(groupMessages[selectedGroup] || []), newMessage];
        setGroupMessages(prev => ({
            ...prev,
            [selectedGroup]: updatedMessages
        }));

        setMessageInput("");

        // 2. Call Gemini AI for contextual responses
        try {
            const res = await fetch(`/api/groups/${selectedGroup}/chat/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userMessage: userMessage,
                    userName: "You",
                    groupContext: {
                        groupName: group.name,
                        groupDescription: group.description,
                    }
                })
            });

            const data = await res.json();
            console.log("AI Response:", data);

            if (data.responses && data.responses.length > 0) {
                // Add responses with STAGGERED delays
                data.responses.forEach((aiResponse: any, index: number) => {
                    const delay = index === 0 ? 800 : (index * 2500) + Math.random() * 1500;

                    setTimeout(() => {
                        const aiMsg: ChatMessage = {
                            bot_id: aiResponse.userId,
                            bot_handle: aiResponse.userName.toLowerCase().replace(/\s/g, '_'),
                            bot_name: aiResponse.userName,
                            bot_photo: aiResponse.userPhoto,
                            text: aiResponse.content,
                            minutes_ago: 0
                        };

                        setGroupMessages(prev => ({
                            ...prev,
                            [selectedGroup]: [...(prev[selectedGroup] || []), aiMsg]
                        }));
                    }, delay);
                });
            }
        } catch (error) {
            console.error("Failed to get AI responses:", error);
        }
    };

    return (
        <div className="peerconnect-page min-h-screen pb-20 overflow-x-hidden" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>

            {/* Detail View Overlay (Mock Group Page) */}
            <AnimatePresence>
                {selectedGroup && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        {(() => {
                            const group = GROUPS_DATA.find(g => g.id === selectedGroup)!;
                            const messages = groupMessages[group.id] || [];
                            const isJoined = joinedGroups.has(group.id);

                            return (
                                <>
                                    {/* Header */}
                                    <div className="px-4 py-4 border-b flex items-center gap-3 bg-white shadow-sm shrink-0">
                                        <button
                                            onClick={() => setSelectedGroup(null)}
                                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <ChevronRight className="h-6 w-6 rotate-180 text-gray-600" />
                                        </button>
                                        <div className="flex-1">
                                            <h2 className="font-bold text-lg text-gray-900 leading-tight">{group.name}</h2>
                                            <p className="text-xs text-gray-500">{group.members} members • {group.category}</p>
                                        </div>
                                        {!isJoined && (
                                            <motion.button
                                                onClick={() => handleJoinGroup(group.id)}
                                                className="peerconnect-befriend-btn text-xs px-4 py-2 h-auto"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Join
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* Chat Area */}
                                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                                        {loadingChat && messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <Loader2 className="h-8 w-8 animate-spin mb-2 text-[#8C1C46]" />
                                                <p className="text-sm">Loading activity...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-center py-6">
                                                    <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center mb-3">
                                                        <UsersRound className="h-8 w-8 text-amber-600" />
                                                    </div>
                                                    <p className="text-gray-500 text-sm px-8">{group.description}</p>
                                                    {!isJoined && (
                                                        <p className="text-xs text-gray-400 mt-2">Join to see older messages and participate.</p>
                                                    )}
                                                </div>

                                                {messages.map((msg, i) => {
                                                    const isOwn = msg.bot_id === "current";
                                                    return (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                                                        >
                                                            <div className="peerconnect-avatar w-8 h-8 shrink-0 overflow-hidden bg-gray-200 mt-1">
                                                                {msg.bot_photo ? (
                                                                    <img src={msg.bot_photo} alt={msg.bot_name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    msg.bot_name?.charAt(0) || "?"
                                                                )}
                                                            </div>
                                                            <div className={isOwn ? "flex flex-col items-end" : "flex flex-col items-start"}>
                                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                                    <span className="font-semibold text-xs text-gray-900">{msg.bot_name}</span>
                                                                    <span className="text-[10px] text-gray-400">
                                                                        {msg.minutes_ago === 0 ? "Just now" : `${msg.minutes_ago}m ago`}
                                                                    </span>
                                                                </div>
                                                                <div className={`px-3 py-2 rounded-2xl border shadow-sm text-sm ${isOwn
                                                                    ? "bg-[#8C1C46] text-white rounded-tr-none border-[#8C1C46]"
                                                                    : "bg-white text-gray-800 rounded-tl-none border-gray-100"
                                                                    }`}>
                                                                    {msg.text}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </>
                                        )}
                                    </div>

                                    {/* Input */}
                                    <div className="p-3 border-t bg-white shrink-0">
                                        {isJoined ? (
                                            <div className="flex gap-2">
                                                <input
                                                    placeholder="Message group..."
                                                    value={messageInput}
                                                    onChange={(e) => setMessageInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                                    className="peerconnect-search flex-1 rounded-full h-10 px-4 bg-gray-50 focus:bg-white transition-colors"
                                                />
                                                <motion.button
                                                    onClick={handleSendMessage}
                                                    disabled={!messageInput.trim()}
                                                    className="h-10 w-10 rounded-full bg-[#8C1C46] text-white flex items-center justify-center disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Sparkles className="h-4 w-4" />
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <motion.button
                                                onClick={() => handleJoinGroup(group.id)}
                                                className="w-full bg-[#8C1C46] text-white rounded-full h-10 font-medium text-sm shadow-md"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Join Group to Chat
                                            </motion.button>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="md:pt-4">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Header */}
                    <motion.div
                        className="flex items-center justify-between mb-6"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="peerconnect-header-icon"
                                style={{ backgroundColor: 'hsl(45 100% 58% / 0.2)' }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <UsersRound className="h-5 w-5" style={{ color: 'hsl(340 66% 33%)' }} />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Groups</h1>
                                <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>Find your community on campus</p>
                            </div>
                        </div>

                        <motion.button
                            className="peerconnect-befriend-btn w-9 h-9 p-0 flex items-center justify-center rounded-full"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Plus className="h-5 w-5" />
                        </motion.button>
                    </motion.div>

                    {/* Search & Filter */}
                    <motion.div
                        className="space-y-4 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(340 10% 45%)' }} />
                                <input
                                    placeholder="Search groups..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="peerconnect-search w-full pl-9"
                                />
                            </div>
                            <motion.button
                                className="peerconnect-icon-btn w-10 h-10"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Filter className="h-4 w-4" />
                            </motion.button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {CATEGORIES.map((cat, idx) => (
                                <motion.button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat
                                        ? "bg-[#8C1C46] text-white shadow-md"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {cat}
                                </motion.button>
                            ))}
                        </div>

                        {/* Campus Location Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {CAMPUSES.map((campus, idx) => (
                                <motion.button
                                    key={campus}
                                    onClick={() => setActiveCampus(campus)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCampus === campus
                                        ? "bg-[#FFC627] text-[#8C1C46] shadow-sm"
                                        : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.05 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {campus}
                                    {campus !== "All" && (
                                        <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-white/50 text-[10px]">
                                            {GROUPS_DATA.filter(g => g.campus === campus).length}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Groups Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {filteredGroups.map((group) => (
                                <motion.div
                                    key={group.id}
                                    className="peerconnect-user-card p-5 cursor-pointer relative overflow-hidden group"
                                    variants={itemVariants}
                                    layout
                                    onClick={() => setSelectedGroup(group.id)}
                                    whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {group.active && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Active</span>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <span
                                            className="text-xs font-semibold px-2 py-1 rounded bg-amber-50 text-amber-700 mb-2 inline-block"
                                        >
                                            {group.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#8C1C46] transition-colors">{group.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{group.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] bg-gray-200`}>
                                                    {["A", "B", "C"][i - 1]}
                                                </div>
                                            ))}
                                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[8px] text-gray-500 font-medium">
                                                +{group.members > 99 ? "99" : group.members}
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#8C1C46] flex items-center">
                                            {joinedGroups.has(group.id) ? "Open Chat" : "Join Group"} <ChevronRight className="h-3 w-3 ml-0.5" />
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
