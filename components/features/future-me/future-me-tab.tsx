"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Lock, Calendar, Heart, AlertCircle, Clock, Volume2, Image as ImageIcon, Video, FileText, ChevronRight } from "lucide-react";
import { FutureMessage } from "./future-me-types";
import { CreateFutureMessage } from "./create-future-message";

// Mock Data
const MOCK_MESSAGES: FutureMessage[] = [
    {
        id: "msg-1",
        createdAt: "2023-10-15T10:00:00Z",
        type: "text",
        content: "Remember how stressed you were about midterms? You got through it. You always do.",
        trigger: { type: "scheduled", date: "2023-12-15T10:00:00Z" },
        status: "delivered",
        isFromPast: true
    },
    {
        id: "msg-2",
        createdAt: "2023-11-01T14:30:00Z",
        type: "voice",
        content: "Voice note from a good day",
        duration: 45,
        trigger: { type: "mood", mood: "Stressed" },
        status: "pending",
        isFromPast: true
    },
    {
        id: "msg-3",
        createdAt: "2023-11-10T09:15:00Z",
        type: "photo",
        content: "Look at this sunset",
        mediaUrl: "/placeholder-sunset.jpg",
        trigger: { type: "milestone", milestoneLabel: "Finish Thesis" },
        status: "pending",
        isFromPast: true
    }
];

export function FutureMeTab() {
    const [activeTab, setActiveTab] = useState<"pending" | "delivered">("delivered");
    const [isCreating, setIsCreating] = useState(false);
    const [messages, setMessages] = useState<FutureMessage[]>(MOCK_MESSAGES);
    const [selectedMessage, setSelectedMessage] = useState<FutureMessage | null>(null);

    const pendingMessages = messages.filter(m => m.status === "pending");
    const deliveredMessages = messages.filter(m => m.status === "delivered" || m.status === "read");

    const getIcon = (type: string) => {
        switch (type) {
            case "voice": return <Volume2 className="w-4 h-4" />;
            case "photo": return <ImageIcon className="w-4 h-4" />;
            case "video": return <Video className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getTriggerLabel = (msg: FutureMessage) => {
        if (msg.trigger.type === "scheduled" && msg.trigger.date) {
            return `Unlocks ${new Date(msg.trigger.date).toLocaleDateString()}`;
        }
        if (msg.trigger.type === "mood") {
            return `Unlocks when ${msg.trigger.mood}`;
        }
        if (msg.trigger.type === "milestone") {
            return `Unlocks: ${msg.trigger.milestoneLabel}`;
        }
        return "Unknown trigger";
    };

    if (isCreating) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl shadow-sm border overflow-hidden min-h-[500px]"
            >
                <CreateFutureMessage onClose={() => setIsCreating(false)} />
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header / Tabs */}
            <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("delivered")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "delivered" ? "bg-white text-[#8C1C46] shadow-sm" : "text-gray-500"}`}
                    >
                        Delivered ({deliveredMessages.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("pending")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "pending" ? "bg-white text-[#8C1C46] shadow-sm" : "text-gray-500"}`}
                    >
                        Pending ({pendingMessages.length})
                    </button>
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8C1C46] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#6e1636] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Letter
                </button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {activeTab === "pending" ? (
                    pendingMessages.length > 0 ? (
                        pendingMessages.map(msg => (
                            <motion.div
                                key={msg.id}
                                layout
                                className="bg-white p-4 rounded-xl border border-gray-100 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Lock className="w-12 h-12 text-[#8C1C46]" />
                                </div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                            Letter to Future Me
                                            <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mobile-font">Locked</span>
                                        </h4>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                            {msg.trigger.type === "scheduled" && <Calendar className="w-3.5 h-3.5" />}
                                            {msg.trigger.type === "mood" && <Heart className="w-3.5 h-3.5" />}
                                            {msg.trigger.type === "milestone" && <AlertCircle className="w-3.5 h-3.5" />}
                                            {getTriggerLabel(msg)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No pending messages.</p>
                        </div>
                    )
                ) : (
                    deliveredMessages.length > 0 ? (
                        deliveredMessages.map(msg => (
                            <motion.button
                                key={msg.id}
                                layout
                                className="w-full text-left bg-white p-4 rounded-xl border border-gray-100 hover:border-[#8C1C46]/30 hover:shadow-md transition-all group"
                                onClick={() => setSelectedMessage(msg)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#8C1C46]/10 flex items-center justify-center shrink-0 text-[#8C1C46]">
                                        {getIcon(msg.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900 mb-1">
                                                From Past You
                                            </h4>
                                            <span className="text-xs text-gray-400">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {msg.content}
                                        </p>
                                        <div className="mt-2 text-xs text-[#8C1C46] font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            Open Message <ChevronRight className="w-3 h-3 ml-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No delivered messages yet.</p>
                        </div>
                    )
                )}
            </div>

            {/* Message Detail Modal would go here - handled roughly for now or added as another component */}
            <AnimatePresence>
                {selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-[#8C1C46] p-6 text-white text-center pb-12 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />
                                <h3 className="text-xl font-bold relative z-10">Past you wrote this...</h3>
                                <p className="opacity-80 text-sm relative z-10">...on a better day.</p>
                            </div>

                            <div className="px-6 -mt-8 relative z-10">
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[200px] flex flex-col">
                                    <div className="flex items-center gap-3 mb-4 text-gray-400 text-xs uppercase tracking-wider font-bold">
                                        <Clock className="w-3 h-3" />
                                        Sent {new Date(selectedMessage.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="flex-1 text-gray-800 leading-relaxed font-serif text-lg">
                                        {selectedMessage.content}
                                    </div>

                                    {selectedMessage.type !== "text" && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                                            [Media Content Placeholder]
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 flex gap-3">
                                <button
                                    className="flex-1 py-3 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
                                    onClick={() => setSelectedMessage(null)}
                                >
                                    Close
                                </button>
                                <button className="flex-1 py-3 rounded-xl bg-[#8C1C46] text-white font-bold shadow-md hover:bg-[#6e1636] transition-colors">
                                    Save to Vault
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
