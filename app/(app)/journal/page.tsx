"use client";

import { useState, useEffect } from "react";
import { Bell, Camera, Video, Mic, Sparkles, Send, MessageCircle, Bookmark, MoreHorizontal, ChevronDown, ChevronUp, Loader2, RefreshCw, Users, TrendingUp, Heart, Globe, UserCircle, Puzzle, Zap, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BottomNav } from "@/components/bottom-nav";
import { CampusDial, VibeMapModal, TimeCapsuleModal, FutureMeModal, SOSModal, GhostModeModal } from "@/components/campus-dial";
import { DailyCheckIn } from "@/components/daily-check-in";
import { seedCapsules } from "@/lib/sim/capsule-state";
import { FutureMeTab } from "@/components/features/future-me/future-me-tab";
import "@/styles/peerconnect.css";

// Hardcoded current user
const CURRENT_USER = {
    id: "current-user",
    name: "Aashir",
    username: "AashirJ",
    year: "Sophomore",
    major: "Computer Science",
    profilePhoto: "/images/user-pfp.jpg",
};

// Post types for quick chips
const POST_TYPES = [
    { id: "vent", label: "Vent", emoji: "😤" },
    { id: "win", label: "Win", emoji: "🎉" },
    { id: "question", label: "Question", emoji: "❓" },
    { id: "support", label: "Need support", emoji: "🫂" },
    { id: "advice", label: "Advice", emoji: "💡" },
    { id: "looking", label: "Looking for people", emoji: "👋" },
];

// Quick reply options
const QUICK_REPLIES = [
    { id: "relate", label: "I relate", emoji: "🤝" },
    { id: "advice", label: "Want advice?", emoji: "💭" },
    { id: "proud", label: "Proud of you", emoji: "💪" },
    { id: "dm", label: "DM me", emoji: "💌" },
];

// Trending data
const TRENDING_FEELINGS = [
    { feeling: "stressed", emoji: "😰", count: 234 },
    { feeling: "motivated", emoji: "🔥", count: 189 },
    { feeling: "lonely", emoji: "😔", count: 156 },
    { feeling: "tired", emoji: "😴", count: 142 },
    { feeling: "hopeful", emoji: "✨", count: 98 },
];

const TRENDING_TOPICS = [
    { topic: "midterms", count: 312 },
    { topic: "roommate", count: 178 },
    { topic: "career fair", count: 145 },
    { topic: "homesick", count: 123 },
];

const LIVE_GROUPS = [
    { name: "CSE 110", members: 45, active: true },
    { name: "First-Gen", members: 89, active: true },
    { name: "International", members: 67, active: false },
];

// Interfaces
interface Post {
    id: string;
    author: {
        name: string;
        photo: string;
        major?: string;
        year?: string;
    };
    content: string;
    type: string;
    feedType: "pulse" | "journal";
    privacy: "campus" | "circle" | "group";
    timestamp: string;
    tags: string[];
    mood?: string;
    media?: { type: "photo" | "video" | "reel"; url: string; thumbnail?: string }[];
    relates: number;
    replies: number;
    saves: number;
    hasRelated?: boolean;
    hasSaved?: boolean;
    comments?: { author: string; content: string; photo?: string; timestamp?: string }[];
    topReply?: { author: string; content: string };
}

export default function JournalPage() {
    const [feedType, setFeedType] = useState<"campus" | "circle">("campus");
    const [feedTab, setFeedTab] = useState<"pulse" | "journal" | "future">("pulse");
    const [postContent, setPostContent] = useState("");
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
    const [isRewriting, setIsRewriting] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState<string | null>(null);
    const [supportMessage, setSupportMessage] = useState("");
    const [refreshingPulse, setRefreshingPulse] = useState(false);
    const [replyTexts, setReplyTexts] = useState<Record<string, string>>({}); // Track replies per post

    // Campus Dial modals
    const [showVibeMap, setShowVibeMap] = useState(false);
    const [showTimeCapsule, setShowTimeCapsule] = useState(false);
    const [showFutureMe, setShowFutureMe] = useState(false);
    const [showSOS, setShowSOS] = useState(false);
    const [showGhostMode, setShowGhostMode] = useState(false);

    // Daily Check In
    const [showCheckIn, setShowCheckIn] = useState(false);

    useEffect(() => {
        seedCapsules();
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/feed?limit=20");
            const data = await res.json();
            if (data.posts) {
                const transformedPosts: Post[] = data.posts.map((p: any, idx: number) => ({
                    id: p.id || `post-${idx}`,
                    author: {
                        name: p.bot_name || "Anonymous",
                        photo: p.bot_photo || "",
                        major: p.major,
                        year: p.year,
                    },
                    content: p.text,
                    type: p.post_type || "vent",
                    feedType: p.text.length > 200 ? "journal" : "pulse",
                    privacy: ["campus", "circle", "group"][Math.floor(Math.random() * 3)] as any,
                    timestamp: `${p.minutes_ago || 0}m ago`,
                    tags: extractTags(p.text),
                    mood: getMoodEmoji(p.post_type),
                    relates: Math.floor(Math.random() * 50) + 5,
                    replies: (p.comments || []).length,
                    saves: Math.floor(Math.random() * 20),
                    hasRelated: false,
                    hasSaved: false,
                    comments: (p.comments || []).map((c: any) => ({
                        author: c.bot_name,
                        content: c.text,
                        photo: c.bot_photo,
                        timestamp: `${c.minutes_after_post}m ago`
                    })),
                    topReply: p.comments?.[0] ? {
                        author: p.comments[0].bot_name,
                        content: p.comments[0].text,
                    } : undefined,
                    media: p.image ? [{ type: 'photo', url: p.image }] : undefined
                }));
                setPosts(transformedPosts);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    const extractTags = (text: string): string[] => {
        const keywords = ["midterms", "homesick", "first-gen", "stressed", "career", "roommate", "lonely", "proud"];
        return keywords.filter(k => text.toLowerCase().includes(k)).slice(0, 3).map(k => `#${k}`);
    };

    const getMoodEmoji = (type: string): string => {
        const moods: Record<string, string> = {
            vent: "😤", win: "🎉", question: "🤔", support: "🫂", advice: "💡", looking: "👋"
        };
        return moods[type] || "💭";
    };

    const getPrivacyIcon = (privacy: string) => {
        switch (privacy) {
            case "campus": return <Globe className="h-3 w-3" />;
            case "circle": return <Users className="h-3 w-3" />;
            case "group": return <Puzzle className="h-3 w-3" />;
            default: return <Globe className="h-3 w-3" />;
        }
    };

    const handlePost = async () => {
        if (!postContent.trim()) return;
        setIsPosting(true);

        const newPost: Post = {
            id: `user-${Date.now()}`,
            author: { name: "You", photo: "" },
            content: postContent,
            type: selectedType || "vent",
            feedType: postContent.length > 150 ? "journal" : "pulse",
            privacy: feedType === "campus" ? "campus" : "circle",
            timestamp: "Just now",
            tags: extractTags(postContent),
            mood: getMoodEmoji(selectedType || "vent"),
            relates: 0,
            replies: 0,
            saves: 0,
        };

        setPosts(prev => [newPost, ...prev]);
        setPostContent("");
        setSelectedType(null);
        setIsPosting(false);
    };

    const handleRewriteGently = async () => {
        if (!postContent.trim()) return;
        setIsRewriting(true);
        await new Promise(r => setTimeout(r, 1000));
        const gentler = postContent
            .replace(/hate/gi, "find it difficult")
            .replace(/stupid/gi, "frustrating")
            .replace(/awful/gi, "challenging")
            .replace(/!+/g, ".") + " 💭";
        setPostContent(gentler);
        setIsRewriting(false);
    };

    const handleRelate = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    hasRelated: !post.hasRelated,
                    relates: post.hasRelated ? post.relates - 1 : post.relates + 1,
                };
            }
            return post;
        }));
    };

    const handleSave = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return { ...post, hasSaved: !post.hasSaved };
            }
            return post;
        }));
    };

    const handleSendSupport = (postId: string) => {
        setShowSupportModal(postId);
    };

    const sendSupportMessage = () => {
        // In real app, this would send a private message
        console.log("Sending support:", supportMessage);
        setShowSupportModal(null);
        setSupportMessage("");
    };

    const refreshPulse = async () => {
        setRefreshingPulse(true);
        await new Promise(r => setTimeout(r, 1500));
        await fetchPosts();
        setRefreshingPulse(false);
    };

    const filteredPosts = posts.filter(p => p.feedType === feedTab);

    return (
        <div className="peerconnect-page min-h-screen pb-20" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
            {/* Header */}
            <motion.header
                className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b"
                style={{ borderColor: 'hsl(40 15% 90%)' }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#8C1C46] flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-[#FFC627]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2v20M12 2l-4 5h8l-4-5zM8 7v4M16 7v4M4 7l4-3M20 7l-4-3M4 4v6M20 4v6" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight" style={{ color: '#8C1C46', fontFamily: 'system-ui, -apple-system, sans-serif' }}>ASU<span className="text-[#FFC627]">4</span>U</span>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setFeedType("campus")}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${feedType === "campus" ? "bg-white text-[#8C1C46] shadow-sm" : "text-gray-500"
                                }`}
                        >
                            🌍 Campus
                        </button>
                        <button
                            onClick={() => setFeedType("circle")}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${feedType === "circle" ? "bg-white text-[#8C1C46] shadow-sm" : "text-gray-500"
                                }`}
                        >
                            👥 Circle
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={() => setShowCheckIn(true)}
                            className="p-2 rounded-full hover:bg-gray-100 bg-gray-50 text-[#8C1C46]"
                            whileTap={{ scale: 0.95 }}
                        >
                            <Sparkles className="h-5 w-5" />
                        </motion.button>

                        <motion.button className="relative p-2 rounded-full hover:bg-gray-100" whileTap={{ scale: 0.95 }}>
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <div className="max-w-2xl mx-auto px-4 py-4">
                {/* Composer */}
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border mb-4 overflow-hidden"
                    style={{ borderColor: 'hsl(40 15% 90%)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="p-4 pb-3">
                        <div className="flex gap-3">
                            <img src={CURRENT_USER.profilePhoto} alt={CURRENT_USER.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind today?"
                                className="flex-1 resize-none text-gray-800 placeholder:text-gray-400 focus:outline-none text-sm min-h-[50px]"
                                rows={2}
                            />
                        </div>
                    </div>

                    <div className="px-4 pb-2">
                        <div className="flex gap-1.5 flex-wrap">
                            {POST_TYPES.map((type) => (
                                <motion.button
                                    key={type.id}
                                    onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${selectedType === type.id ? "bg-[#8C1C46] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>{type.emoji}</span>
                                    <span>{type.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: 'hsl(40 15% 92%)' }}>
                        <div className="flex items-center gap-0.5">
                            <motion.button className="p-2 rounded-full hover:bg-gray-100" whileTap={{ scale: 0.95 }} title="Photo">
                                <Camera className="h-4 w-4 text-gray-500" />
                            </motion.button>
                            <motion.button className="p-2 rounded-full hover:bg-gray-100" whileTap={{ scale: 0.95 }} title="Video">
                                <Video className="h-4 w-4 text-gray-500" />
                            </motion.button>
                            <motion.button className="p-2 rounded-full hover:bg-gray-100" whileTap={{ scale: 0.95 }} title="Voice">
                                <Mic className="h-4 w-4 text-gray-500" />
                            </motion.button>
                            <motion.button
                                onClick={handleRewriteGently}
                                disabled={isRewriting || !postContent.trim()}
                                className="p-2 rounded-full hover:bg-purple-50 disabled:opacity-50"
                                whileTap={{ scale: 0.95 }}
                                title="Rewrite gently"
                            >
                                {isRewriting ? <Loader2 className="h-4 w-4 text-purple-500 animate-spin" /> : <Sparkles className="h-4 w-4 text-purple-400" />}
                            </motion.button>
                        </div>
                        <motion.button
                            onClick={handlePost}
                            disabled={!postContent.trim() || isPosting}
                            className="px-4 py-1.5 rounded-full bg-[#8C1C46] text-white text-xs font-medium disabled:opacity-50 flex items-center gap-1.5"
                            whileTap={{ scale: 0.97 }}
                        >
                            {isPosting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            <span>Post</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Feed Tabs: Pulse / Journal */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                        <motion.button
                            onClick={() => setFeedTab("pulse")}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${feedTab === "pulse"
                                ? "bg-gradient-to-r from-[#8C1C46] to-[#a82255] text-white shadow-md"
                                : "bg-white text-gray-600 border"
                                }`}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Zap className="h-4 w-4" />
                            Pulse
                        </motion.button>
                        <motion.button
                            onClick={() => setFeedTab("journal")}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${feedTab === "journal"
                                ? "bg-gradient-to-r from-[#8C1C46] to-[#a82255] text-white shadow-md"
                                : "bg-white text-gray-600 border"
                                }`}
                            whileTap={{ scale: 0.97 }}
                        >
                            <BookOpen className="h-4 w-4" />
                            Journal
                        </motion.button>
                        <motion.button
                            onClick={() => setFeedTab("future")}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${feedTab === "future"
                                ? "bg-gradient-to-r from-[#8C1C46] to-[#a82255] text-white shadow-md"
                                : "bg-white text-gray-600 border"
                                }`}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Sparkles className="h-4 w-4" />
                            Future Me
                        </motion.button>
                    </div>
                    {feedTab === "pulse" && (
                        <motion.button
                            onClick={refreshPulse}
                            disabled={refreshingPulse}
                            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#8C1C46] px-3 py-1.5 rounded-full bg-white border"
                            whileTap={{ scale: 0.95 }}
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshingPulse ? 'animate-spin' : ''}`} />
                            Refresh Pulse
                        </motion.button>
                    )}
                </div>

                {/* Future Me Tab Content */}
                {feedTab === "future" ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border p-4 min-h-[500px]"
                    >
                        <FutureMeTab />
                    </motion.div>
                ) : (
                    <>
                        {/* Campus Pulse Panel - Only show on Pulse tab */}
                        {feedTab === "pulse" && (
                            <motion.div
                                className="bg-white rounded-2xl shadow-sm border mb-4 p-4"
                                style={{ borderColor: 'hsl(40 15% 90%)' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-[#8C1C46]" />
                                    Campus Pulse
                                </h3>

                                <div className="space-y-3">
                                    {/* Trending Feelings */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1.5 font-medium">Trending feelings</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {TRENDING_FEELINGS.slice(0, 4).map((f) => (
                                                <span key={f.feeling} className="text-xs bg-gray-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    {f.emoji} {f.feeling}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trending Topics */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1.5 font-medium">Trending topics</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {TRENDING_TOPICS.map((t) => (
                                                <span key={t.topic} className="text-xs bg-[#8C1C46]/10 text-[#8C1C46] px-2.5 py-1 rounded-full">
                                                    #{t.topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Live Groups */}
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1.5 font-medium">Live groups</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {LIVE_GROUPS.map((g) => (
                                                <span key={g.name} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    {g.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {/* Feed */}
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 text-[#8C1C46] animate-spin" />
                            </div>
                        ) : (
                            <motion.div className="space-y-4">
                                {filteredPosts.map((post) => (
                                    <motion.div
                                        key={post.id}
                                        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                                        style={{ borderColor: 'hsl(40 15% 90%)' }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {/* Post Header */}
                                        <div className="p-4 pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-3">
                                                    {post.author.photo ? (
                                                        <img src={post.author.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8C1C46] to-[#6B1535] flex items-center justify-center text-white font-medium">
                                                            {post.author.name[0]}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-semibold text-sm text-gray-900">{post.author.name}</span>
                                                            {post.mood && <span className="text-sm">{post.mood}</span>}
                                                            <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                                                                {getPrivacyIcon(post.privacy)}
                                                                <span className="ml-0.5">{post.privacy}</span>
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {post.author.major && <span>{post.author.major} • </span>}
                                                            {post.author.year && <span>{post.author.year} • </span>}
                                                            {post.timestamp}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="p-1 hover:bg-gray-100 rounded-full">
                                                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="px-4 pb-2">
                                            <p className={`text-gray-800 text-sm leading-relaxed ${!expandedPosts.has(post.id) && post.content.length > 200 ? 'line-clamp-3' : ''
                                                }`}>
                                                {post.content}
                                            </p>

                                            {/* Render Media */}
                                            {post.media && post.media.length > 0 && (
                                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                                                    <img src={post.media[0].url} alt="Post content" className="w-full h-auto object-cover max-h-96" />
                                                </div>
                                            )}
                                            {post.content.length > 200 && (
                                                <button
                                                    onClick={() => {
                                                        const next = new Set(expandedPosts);
                                                        next.has(post.id) ? next.delete(post.id) : next.add(post.id);
                                                        setExpandedPosts(next);
                                                    }}
                                                    className="text-xs text-[#8C1C46] font-medium mt-1"
                                                >
                                                    {expandedPosts.has(post.id) ? 'Show less' : 'Read more'}
                                                </button>
                                            )}

                                            {/* Tags */}
                                            {post.tags.length > 0 && (
                                                <div className="flex gap-1.5 mt-2 flex-wrap">
                                                    {post.tags.map(tag => (
                                                        <span key={tag} className="text-xs text-[#8C1C46]/70 bg-[#8C1C46]/5 px-2 py-0.5 rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="px-4 py-2 border-t" style={{ borderColor: 'hsl(40 15% 92%)' }}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <motion.button
                                                        onClick={() => toggleComments(post.id)}
                                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100"
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                        <span>Reply</span>
                                                        {post.replies > 0 && <span className="text-gray-400">({post.replies})</span>}
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleRelate(post.id)}
                                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs ${post.hasRelated ? 'bg-amber-50 text-amber-600' : 'text-gray-500 hover:bg-gray-100'
                                                            }`}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <span>🤝</span>
                                                        <span>Relate</span>
                                                        {post.relates > 0 && <span className="text-gray-400">({post.relates})</span>}
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleSendSupport(post.id)}
                                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-pink-50 hover:text-pink-600"
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <span>🫶</span>
                                                        <span>Support</span>
                                                    </motion.button>
                                                </div>
                                                <motion.button
                                                    onClick={() => handleSave(post.id)}
                                                    className={`p-1.5 rounded-lg ${post.hasSaved ? 'text-[#8C1C46]' : 'text-gray-400 hover:text-gray-600'}`}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Bookmark className={`h-4 w-4 ${post.hasSaved ? 'fill-current' : ''}`} />
                                                </motion.button>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1.5 italic">You can reply publicly or privately</p>
                                        </div>

                                        {/* Top Reply Preview */}
                                        {post.topReply && !expandedComments.has(post.id) && (
                                            <div className="px-4 py-2 bg-gray-50/50 border-t" style={{ borderColor: 'hsl(40 15% 94%)' }}>
                                                <p className="text-[10px] text-gray-500 mb-1">Most supportive reply</p>
                                                <p className="text-xs text-gray-700">
                                                    <span className="font-medium">{post.topReply.author}</span>: {post.topReply.content.slice(0, 80)}...
                                                </p>
                                            </div>
                                        )}

                                        {/* Quick Replies */}
                                        <AnimatePresence>
                                            {expandedComments.has(post.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t bg-gray-50/50 overflow-hidden"
                                                    style={{ borderColor: 'hsl(40 15% 92%)' }}
                                                >
                                                    <div className="p-3">
                                                        {/* Comments List */}
                                                        {post.comments && post.comments.length > 0 && (
                                                            <div className="space-y-3 mb-4 pl-1">
                                                                {post.comments.map((comment, i) => (
                                                                    <div key={i} className="flex gap-2">
                                                                        {comment.photo ? (
                                                                            <img src={comment.photo} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                                                                        ) : (
                                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                                                                {comment.author[0]}
                                                                            </div>
                                                                        )}
                                                                        <div className="bg-white border rounded-xl rounded-tl-none p-2 px-3 shadow-sm max-w-[85%]">
                                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                                <span className="font-semibold text-xs">{comment.author}</span>
                                                                                <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-700">{comment.content}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex gap-2 mb-3 flex-wrap">
                                                            {QUICK_REPLIES.map((qr) => (
                                                                <motion.button
                                                                    key={qr.id}
                                                                    onClick={() => setReplyTexts(prev => ({
                                                                        ...prev,
                                                                        [post.id]: (prev[post.id] ? prev[post.id] + " " : "") + qr.label
                                                                    }))}
                                                                    className="text-xs bg-white border px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-gray-50"
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    {qr.emoji} {qr.label}
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={replyTexts[post.id] || ""}
                                                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                placeholder="Add a supportive reply..."
                                                                className="flex-1 text-xs px-3 py-2 rounded-full border bg-white focus:outline-none focus:ring-1 focus:ring-[#8C1C46]"
                                                            />
                                                            <motion.button
                                                                className="px-3 py-2 bg-[#8C1C46] text-white rounded-full"
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <Send className="h-3.5 w-3.5" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                    </>
                )}
            </div>

            {/* Support Modal */}
            <AnimatePresence>
                {showSupportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSupportModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-5 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-bold text-lg mb-1">Send Support 🫶</h3>
                            <p className="text-sm text-gray-500 mb-4">Your message will be sent privately</p>
                            <textarea
                                value={supportMessage}
                                onChange={(e) => setSupportMessage(e.target.value)}
                                placeholder="You got this! I believe in you..."
                                className="w-full p-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#8C1C46]"
                                rows={3}
                            />
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => setShowSupportModal(null)}
                                    className="flex-1 py-2 rounded-xl border text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    onClick={sendSupportMessage}
                                    className="flex-1 py-2 rounded-xl bg-[#8C1C46] text-white text-sm font-medium"
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Send 💌
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Campus Dial */}
            <CampusDial
                onOpenVibeMap={() => setShowVibeMap(true)}
                onOpenTimeCapsule={() => setShowTimeCapsule(true)}
                onOpenFutureMe={() => setShowFutureMe(true)}
                onOpenSOS={() => setShowSOS(true)}
                onOpenGhostMode={() => setShowGhostMode(true)}
            />

            {/* Campus Dial Modals */}
            <DailyCheckIn isOpen={showCheckIn} onClose={() => setShowCheckIn(false)} />
            <VibeMapModal isOpen={showVibeMap} onClose={() => setShowVibeMap(false)} />
            <TimeCapsuleModal isOpen={showTimeCapsule} onClose={() => setShowTimeCapsule(false)} />
            <FutureMeModal isOpen={showFutureMe} onClose={() => setShowFutureMe(false)} />
            <SOSModal isOpen={showSOS} onClose={() => setShowSOS(false)} />
            <GhostModeModal
                isOpen={showGhostMode}
                onClose={() => setShowGhostMode(false)}
                onPost={(content: string, level: string) => {
                    // Add ghost post to feed
                    const ghostPost: Post = {
                        id: `ghost-${Date.now()}`,
                        author: { name: "Anonymous", photo: "" },
                        content,
                        type: "vent",
                        feedType: "pulse",
                        privacy: level as any,
                        timestamp: "Just now",
                        tags: [],
                        mood: "👻",
                        relates: 0,
                        replies: 0,
                        saves: 0,
                    };
                    setPosts(prev => [ghostPost, ...prev]);
                }}
            />

            <BottomNav />
        </div >
    );

    function toggleComments(postId: string) {
        setExpandedComments(prev => {
            const next = new Set(prev);
            next.has(postId) ? next.delete(postId) : next.add(postId);
            return next;
        });
    }
}
