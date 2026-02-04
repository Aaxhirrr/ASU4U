"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, PhoneCall, MessageSquareText, Users, ChevronRight, Sparkles, Shield, Clock, Stethoscope, Bot, GraduationCap, X, Mic, History, ArrowLeft, Send, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/peerconnect.css";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/bottom-nav";
import { BOT_STUDENTS, BotStudent } from "@/lib/sim/bots";
import { useRouter } from "next/navigation";

const SUPPORT_OPTIONS = [
    {
        id: "human-chat",
        icon: MessageSquareText,
        color: "from-green-500/10 to-emerald-500/10",
        border: "border-green-500/20",
        title: "24/7 Chat with a Human",
        subtitle: "ASU Counseling Services",
        description: "Connect instantly with a real person from ASU who can listen and help, any time of day or night.",
        action: "Start Chat Now",
        stats: "Available Now",
        waitTime: null,
        highlight: true
    },
    {
        id: "therapists",
        icon: Stethoscope,
        color: "from-blue-500/10 to-indigo-500/10",
        border: "border-white/10",
        title: "Licensed Therapists",
        subtitle: "Professional Care",
        description: "Connect with certified counselors for confidential mental health support and crisis intervention.",
        action: "Book Session",
        stats: "Mon-Fri 9-5",
        waitTime: "~15-30 min wait"
    },
    {
        id: "peer-listeners",
        icon: GraduationCap,
        color: "from-amber-500/10 to-orange-500/10",
        border: "border-white/10",
        title: "Trained Peer Listeners",
        subtitle: "Student Support",
        description: "Chat with trained student peers who can provide empathetic, non-judgmental support for daily stress.",
        action: "Start Chat",
        stats: "12 Online",
        waitTime: "~5-10 min wait"
    },
    {
        id: "dr-morgan",
        icon: Bot,
        color: "from-fuchsia-500/10 to-purple-500/10",
        border: "border-white/10",
        title: "Dr. Morgan",
        subtitle: "AI Wellness Compass",
        description: "Your 24/7 personal wellness companion. Available anytime to listen and help you process.",
        action: "Open Hub",
        stats: "Always Active",
        waitTime: null
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as const }
};

interface MemoryItem {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
}

export default function SupportPage() {
    const router = useRouter();
    const [isMorganHubOpen, setIsMorganHubOpen] = useState(false);
    const [morganMode, setMorganMode] = useState<"hub" | "voice" | "chat" | "memory">("hub");
    const [memoryItems, setMemoryItems] = useState<MemoryItem[]>([]);
    const [chatMessage, setChatMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<MemoryItem[]>([]);

    // Peer Support State
    const [isPeerModalOpen, setIsPeerModalOpen] = useState(false);
    const [selectedPeer, setSelectedPeer] = useState<BotStudent | null>(null);
    const [isPeerChatOpen, setIsPeerChatOpen] = useState(false);

    useEffect(() => {
        if (isMorganHubOpen) {
            const stored = localStorage.getItem("dr_morgan_history");
            if (stored) {
                const parsed = JSON.parse(stored);
                setMemoryItems(parsed);
                setChatHistory(parsed);
            }
        }
    }, [isMorganHubOpen]);

    const handleSaveTranscript = () => {
        const transcript = "Session Analysis: User discussed academic stress. Recommended breathing exercises.";

        const newMessage = {
            id: Date.now().toString(),
            senderId: "dr-morgan",
            content: transcript,
            timestamp: new Date().toISOString()
        };

        const existingHistory = localStorage.getItem("dr_morgan_history");
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        const updatedHistory = [...history, newMessage];
        localStorage.setItem("dr_morgan_history", JSON.stringify(updatedHistory));
        setMemoryItems(updatedHistory);
    };

    const [isTyping, setIsTyping] = useState(false);

    const handleSendChat = async () => {
        if (!chatMessage.trim()) return;

        const newUserMsg: MemoryItem = {
            id: Date.now().toString(),
            senderId: "current",
            content: chatMessage,
            timestamp: new Date().toISOString()
        };

        const updatedHistory = [...chatHistory, newUserMsg];
        setChatHistory(updatedHistory);
        setChatMessage(""); // Clear input immediately
        setIsTyping(true); // Start typing indicator

        // Determine API and Payload based on mode
        const isPeerChat = isPeerChatOpen && selectedPeer;
        const apiUrl = isPeerChat ? `/api/dm/dm_${selectedPeer.id}/send` : "/api/morgan/chat";

        const payload = isPeerChat ? {
            userMessage: chatMessage,
            botId: selectedPeer.id,
            previousMessages: updatedHistory.map(m => ({
                role: m.senderId === 'current' ? 'user' : 'assistant',
                content: m.content
            }))
        } : {
            message: chatMessage,
            history: updatedHistory.slice(-10)
        };

        // Call API
        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            const content = data.reply || data.response;

            if (content) {
                const aiMsg: MemoryItem = {
                    id: (Date.now() + 1).toString(),
                    senderId: isPeerChat && selectedPeer ? selectedPeer.id : "dr-morgan",
                    content: content,
                    timestamp: new Date().toISOString()
                };

                const withReply = [...updatedHistory, aiMsg];
                setChatHistory(withReply);
                if (!isPeerChat) {
                    localStorage.setItem("dr_morgan_history", JSON.stringify(withReply));
                    setMemoryItems(withReply);
                }
            } else {
                throw new Error("No response from AI");
            }

        } catch (error) {
            console.error("Failed to get response:", error);
            // Fallback if API fails
            const replyMsg: MemoryItem = {
                id: (Date.now() + 1).toString(),
                senderId: isPeerChat && selectedPeer ? selectedPeer.id : "dr-morgan",
                content: "I'm having trouble connecting right now, but I'm still here. Can you say that again?",
                timestamp: new Date().toISOString()
            };
            setChatHistory(prev => [...prev, replyMsg]);
        } finally {
            setIsTyping(false); // Stop typing indicator
        }
    };

    return (
        <div className="peerconnect-page min-h-screen pb-24 text-[hsl(var(--foreground))] flex flex-col bg-gradient-to-br from-[#F5F5F4] to-[#E7E5E4]">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b px-4 py-3 flex items-center gap-3" style={{ borderColor: 'hsl(40 15% 90%)' }}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center border border-pink-500/20">
                    <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">Support</h1>
                </div>
            </div>

            {/* Content - Horizontal Carousel */}
            <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <motion.div
                    className="flex gap-6 overflow-x-auto px-6 py-8 snap-x snap-mandatory scrollbar-hide items-center justify-start sm:justify-center h-full"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {SUPPORT_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isMorgan = option.id === 'dr-morgan';

                        // All cards now use the "Morgan" dark aesthetic as requested
                        return (
                            <motion.div
                                key={option.id}
                                variants={itemVariants}
                                className={cn(
                                    "min-w-[85vw] sm:min-w-[320px] max-w-[360px] h-[460px] snap-center shrink-0",
                                    "relative rounded-[2.5rem] overflow-hidden",
                                    "bg-[#0A0A0A] border border-white/10", // Dark base for all
                                    "shadow-[0_8px_40px_rgba(0,0,0,0.2)]", // Stronger shadow
                                    "flex flex-col justify-between p-8 group",
                                    "hover:bg-black transition-colors duration-500"
                                )}
                            >
                                {/* Subtle Glow based on type */}
                                <div className={cn(
                                    "absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[80px] opacity-20",
                                    isMorgan ? "bg-fuchsia-500" : option.id === 'therapists' ? "bg-blue-500" : "bg-amber-500"
                                )} />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center mb-8">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="font-bold text-3xl mb-2 text-white tracking-tight">
                                        {option.title}
                                    </h3>
                                    <p className="text-xs font-bold uppercase tracking-widest mb-6 text-white/40">
                                        {option.subtitle}
                                    </p>

                                    <p className="text-base leading-relaxed font-medium text-white/70">
                                        {option.description}
                                    </p>
                                </div>

                                <div className="space-y-5 z-10">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full w-fit backdrop-blur-md border border-white/10 bg-white/5 text-white/60">
                                            <Clock className="w-3.5 h-3.5" />
                                            {option.stats}
                                        </div>
                                        {option.waitTime && (
                                            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                {option.waitTime}
                                            </div>
                                        )}
                                        {(option as any).highlight && (
                                            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                No wait
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (option.id === 'dr-morgan') {
                                                setIsMorganHubOpen(true);
                                                setMorganMode("hub");
                                            } else if (option.id === 'human-chat') {
                                                // Direct to ASU Counseling Services chat
                                                window.open('https://eoss.asu.edu/counseling/services/open-call-and-open-chat', '_blank');
                                            } else if (option.id === 'therapists') {
                                                // Redirect to internal connecting page
                                                router.push('/support/connecting');
                                            } else if (option.id === 'peer-listeners') {
                                                // Open Peer Chooser Modal
                                                setIsPeerModalOpen(true);
                                            }
                                        }}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98]",
                                            (option as any).highlight
                                                ? "bg-green-500 text-white hover:bg-green-400 shadow-green-500/20"
                                                : "bg-white text-black hover:bg-white/90 shadow-white/5"
                                        )}
                                    >
                                        {option.action}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Subtle Crisis Line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-md mx-auto mt-12 mb-8 text-center"
                >
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                        <p className="text-white/60 text-sm mb-1">In a crisis?</p>
                        <p className="text-white/80 font-medium text-sm">
                            Call or text <span className="text-red-400 font-bold">988</span> or call EMPACT at <a href="tel:4809211006" className="text-red-400 font-bold hover:underline">480-921-1006</a>
                        </p>
                    </div>
                </motion.div>

                <BottomNav />
            </div>

            {/* Dr. Morgan Hub Modal */}
            <AnimatePresence>
                {isMorganHubOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#000000] flex flex-col text-white"
                    >
                        {/* Minimalist Header */}
                        <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                {morganMode !== "hub" && (
                                    <button onClick={() => setMorganMode("hub")} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                                        <ArrowLeft className="w-5 h-5 text-white" />
                                    </button>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-semibold text-lg tracking-tight">Dr. Morgan</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsMorganHubOpen(false);
                                    if (morganMode === 'voice') handleSaveTranscript();
                                }}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>
                        </div>

                        {/* HUB MAIN VIEW - Minimalist Side-by-Side */}
                        {morganMode === "hub" && (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
                                    {/* Voice Option */}
                                    <button
                                        onClick={() => setMorganMode("voice")}
                                        className="group relative aspect-[4/3] rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                            <Mic className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold">Voice Call</h3>
                                            <p className="text-sm text-white/40 mt-1">Real-time conversation</p>
                                        </div>
                                    </button>

                                    {/* Text Option */}
                                    <button
                                        onClick={() => setMorganMode("chat")}
                                        className="group relative aspect-[4/3] rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                                            <MessageSquareText className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold">Text Chat</h3>
                                            <p className="text-sm text-white/40 mt-1">Message history</p>
                                        </div>
                                    </button>
                                </div>

                                {/* Memory Link - Subtle */}
                                <button
                                    onClick={() => setMorganMode("memory")}
                                    className="flex items-center gap-2 text-sm font-medium text-white/30 hover:text-white/60 transition-colors px-6 py-3 rounded-full hover:bg-white/5"
                                >
                                    <Brain className="w-4 h-4" />
                                    <span>Access Memory Log</span>
                                </button>
                            </div>
                        )}

                        {/* VOICE MODE */}
                        {morganMode === "voice" && (
                            <div className="flex-1 w-full h-full bg-black relative">
                                <iframe
                                    src="https://lab.anam.ai/frame/Q2IgP4QPvHQoTrleqbYvs"
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="microphone"
                                    title="Dr. Morgan AI"
                                />
                            </div>
                        )}

                        {/* MEMORY MODE */}
                        {morganMode === "memory" && (
                            <div className="flex-1 w-full max-w-2xl mx-auto p-6 overflow-hidden flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold">Memory Log</h2>
                                    {memoryItems.length > 0 && (
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("dr_morgan_history");
                                                setMemoryItems([]);
                                                setChatHistory([]);
                                            }}
                                            className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10"
                                        >
                                            Clear History
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                    {memoryItems.length === 0 ? (
                                        <div className="text-center text-white/20 py-12">
                                            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No accumulated memories yet.</p>
                                        </div>
                                    ) : (
                                        memoryItems.filter(m => m.senderId === 'dr-morgan').map((item, i) => (
                                            <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                <p className="text-base text-white/80 font-light leading-relaxed">{item.content}</p>
                                                <div className="flex items-center gap-2 mt-4 text-xs text-white/30 font-mono uppercase tracking-wider">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CHAT MODE */}
                        {morganMode === "chat" && (
                            <div className="flex-1 flex flex-col h-full bg-[#000000] w-full max-w-2xl mx-auto">
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {chatHistory.map((item, i) => {
                                        const isOwn = item.senderId === "current";
                                        return (
                                            <div key={i} className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}>
                                                <div className={cn(
                                                    "max-w-[85%] p-5 rounded-2xl text-base font-light leading-relaxed",
                                                    isOwn
                                                        ? "bg-white text-black rounded-br-none"
                                                        : "bg-white/10 text-white rounded-bl-none"
                                                )}>
                                                    {item.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {isTyping && (
                                        <div className="flex w-full justify-start animate-fade-in">
                                            <div className="bg-white/10 text-white rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="relative flex items-center">
                                        <input
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                            placeholder="Message..."
                                            className="w-full bg-white/10 border-none rounded-full pl-6 pr-14 h-14 text-white placeholder:text-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                                        />
                                        <button
                                            onClick={handleSendChat}
                                            disabled={!chatMessage.trim()}
                                            className="absolute right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-black disabled:opacity-50 disabled:bg-white/20 disabled:text-white/50 transition-all hover:scale-105"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Peer Selection Modal */}
            <AnimatePresence>
                {isPeerModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6"
                    >
                        <div className="w-full max-w-4xl h-full max-h-[85vh] flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Peer Listeners</h2>
                                    <p className="text-white/60">Choose a student to chat with</p>
                                </div>
                                <button
                                    onClick={() => setIsPeerModalOpen(false)}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                                {BOT_STUDENTS.map(bot => (
                                    <div
                                        key={bot.id}
                                        className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-4 rounded-xl flex items-center gap-4 cursor-pointer group"
                                        onClick={() => {
                                            setSelectedPeer(bot);
                                            setIsPeerModalOpen(false);
                                            setIsPeerChatOpen(true);
                                            setChatHistory([]); // Start fresh for peer chat
                                            // Optional: load history if you implemented peer history persistence
                                        }}
                                    >
                                        <img src={bot.profilePhoto} alt={bot.name} className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-amber-400 transition-all" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white truncate">{bot.name}</h3>
                                            <p className="text-xs text-white/50 truncate mb-1">{bot.major} • {bot.year}</p>
                                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white/70">
                                                {bot.voice} Listener
                                            </span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-amber-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Peer Chat Modal */}
            <AnimatePresence>
                {isPeerChatOpen && selectedPeer && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/50 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setIsPeerChatOpen(false)} className="p-2 -ml-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div className="relative">
                                    <img src={selectedPeer.profilePhoto} className="w-10 h-10 rounded-full" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base leading-none mb-1">{selectedPeer.name}</h3>
                                    <p className="text-xs text-white/50 font-medium">Peer Listener • Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {chatHistory.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <MessageSquareText className="w-8 h-8 text-white/50" />
                                    </div>
                                    <p className="text-center text-white/50 text-sm max-w-xs">{`Start a conversation with ${selectedPeer.name}. They are here to listen.`}</p>
                                </div>
                            )}

                            {chatHistory.map((item, i) => {
                                const isOwn = item.senderId === "current";
                                return (
                                    <div key={i} className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[85%] p-5 rounded-2xl text-base font-light leading-relaxed",
                                            isOwn
                                                ? "bg-white text-black rounded-br-none"
                                                : "bg-white/10 text-white rounded-bl-none"
                                        )}>
                                            {item.content}
                                        </div>
                                    </div>
                                );
                            })}

                            {isTyping && (
                                <div className="flex w-full justify-start animate-fade-in">
                                    <div className="bg-white/10 text-white rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-black/50 backdrop-blur-md">
                            <div className="relative flex items-center max-w-3xl mx-auto">
                                <input
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    placeholder={`Message ${selectedPeer.name}...`}
                                    className="w-full bg-white/10 border-none rounded-full pl-6 pr-14 h-14 text-white placeholder:text-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all"
                                />
                                <button
                                    onClick={handleSendChat}
                                    disabled={!chatMessage.trim()}
                                    className="absolute right-2 w-10 h-10 rounded-full bg-white flex items-center justify-center text-black disabled:opacity-50 disabled:bg-white/20 disabled:text-white/50 transition-all hover:scale-105"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
