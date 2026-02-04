"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Settings, ChevronRight, Heart, Bell, Shield, LogOut, Edit, Camera, Sparkles, Share2, CircleUser, Zap, MessageCircle, Flame, CalendarCheck, Smile, Frown, TrendingUp, Lock, Eye, Ear, Send, Bookmark, Grid, User, BookOpen, UsersRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/peerconnect.css";
import { cn } from "@/lib/utils";
import { getMyCapsules, Capsule } from "@/lib/sim/capsule-state";
import { CapsuleReveal } from "@/components/capsule-reveal";
import { BottomNav } from "@/components/bottom-nav";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"posts" | "capsules" | "groups" | "saved">("posts");
    const [myCapsules, setMyCapsules] = useState<{ sent: Capsule[], received: Capsule[] }>({ sent: [], received: [] });
    const [viewingCapsule, setViewingCapsule] = useState<Capsule | null>(null);

    // Initial load
    useState(() => {
        setMyCapsules(getMyCapsules("current-user"));
    });

    return (
        <div className="peerconnect-page min-h-screen" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
            <div className="pb-20 md:pt-4 md:pb-8">
                <div className="max-w-4xl mx-auto px-4 py-6">

                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>My Profile</h1>
                        <Link
                            href="/settings"
                            className="h-10 w-10 rounded-lg flex items-center justify-center border bg-white hover:bg-gray-50 transition-colors"
                            style={{ borderColor: 'hsl(40 15% 80%)' }}
                        >
                            <Settings className="h-5 w-5" style={{ color: 'hsl(340 10% 45%)' }} />
                        </Link>
                    </div>

                    {/* Identity Card */}
                    <motion.div
                        initial="hidden" animate="visible" variants={containerVariants}
                        className="peerconnect-user-card mb-6"
                    >
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="peerconnect-avatar w-28 h-28 text-3xl shadow-sm border-2 border-white">
                                        <img src="/images/user-pfp.jpg" alt="Profile" />
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Link href="/create-profile" className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md border bg-white hover:bg-gray-50" style={{ borderColor: 'hsl(40 15% 80%)', color: 'hsl(340 10% 45%)' }}>
                                            <Edit className="h-3 w-3" /> Edit
                                        </Link>
                                        <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md border bg-white hover:bg-gray-50" style={{ borderColor: 'hsl(40 15% 80%)', color: 'hsl(340 10% 45%)' }}>
                                            <Share2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div>
                                        <h2 className="text-2xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Aashir J.</h2>
                                        <p style={{ color: 'hsl(340 10% 45%)' }}>@aashirj • Computer Science '26</p>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100/50 text-green-700 border border-green-200/50">
                                            <div className="w-2 h-2 rounded-full bg-green-500" /> Open to chat
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/50 text-blue-700 border border-blue-200/50">
                                            Prefer listening
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-lg bg-[hsl(40,30%,98%)] border border-[hsl(40,15%,90%)]">
                                        <p className="text-sm italic mb-2" style={{ color: 'hsl(340 20% 15%)' }}>
                                            "Tech enthusiast, late-night coder, and coffee addict. ☕ Just trying to survive finals week."
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'hsl(340 66% 33%)' }}>
                                            <Zap className="w-3 h-3" />
                                            Here for: Finding friends & consistency
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Soulful Stats */}
                    <motion.div
                        initial="hidden" animate="visible" variants={itemVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
                    >
                        <div className="peerconnect-user-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                            <Heart className="w-6 h-6 mb-2" style={{ color: 'hsl(340 66% 33%)' }} />
                            <span className="text-2xl font-black" style={{ color: 'hsl(340 20% 15%)' }}>142</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'hsl(340 10% 45%)' }}>Support Given</span>
                        </div>
                        <div className="peerconnect-user-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                            <Send className="w-6 h-6 mb-2 text-blue-500" />
                            <span className="text-2xl font-black" style={{ color: 'hsl(340 20% 15%)' }}>38</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'hsl(340 10% 45%)' }}>Capsules Sent</span>
                        </div>
                        <div className="peerconnect-user-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                            <UsersRound className="w-6 h-6 mb-2 text-purple-500" />
                            <span className="text-2xl font-black" style={{ color: 'hsl(340 20% 15%)' }}>8</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'hsl(340 10% 45%)' }}>Groups</span>
                        </div>
                        <div className="peerconnect-user-card p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow relative overflow-hidden ring-2 ring-[hsl(45,100%,58%)] ring-opacity-50">
                            <Flame className="w-6 h-6 mb-2 text-orange-500 fill-orange-500" />
                            <span className="text-2xl font-black" style={{ color: 'hsl(340 20% 15%)' }}>12</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'hsl(340 10% 45%)' }}>Day Streak</span>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial="hidden" animate="visible" variants={itemVariants}
                        className="grid grid-cols-3 gap-3 mb-6"
                    >
                        <button className="peerconnect-user-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(40,30%,98%)] transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CalendarCheck className="w-5 h-5 text-green-700" />
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Check-in</span>
                        </button>
                        <button className="peerconnect-user-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(40,30%,98%)] transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Zap className="w-5 h-5 text-purple-700" />
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Drop Capsule</span>
                        </button>
                        <button className="peerconnect-user-card p-4 flex flex-col items-center justify-center gap-2 hover:bg-[hsl(40,30%,98%)] transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-5 h-5 text-blue-700" />
                            </div>
                            <span className="text-xs font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Find Buddy</span>
                        </button>
                    </motion.div>

                    {/* Impact Card */}
                    <motion.div variants={itemVariants} className="peerconnect-user-card mb-6 overflow-hidden">
                        <div className="bg-[hsl(340,66%,33%)] p-4 text-white flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-[hsl(45,100%,58%)]" /> Your Impact
                            </h3>
                            <span className="text-xs font-medium text-white/80">This Month</span>
                        </div>
                        <div className="p-5 flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>12</p>
                                <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>People Helped</p>
                            </div>
                            <div className="w-px h-10 bg-[hsl(40,15%,90%)]" />
                            <div className="text-center">
                                <p className="text-sm font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Stressed → Better</p>
                                <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>Top Vibe Shift</p>
                            </div>
                            <div className="w-px h-10 bg-[hsl(40,15%,90%)]" />
                            <div className="text-center">
                                <p className="text-2xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>48</p>
                                <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>"Relates"</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Support Preferences */}
                    <motion.div variants={itemVariants} className="peerconnect-user-card mb-6">
                        <div className="p-5 border-b border-[hsl(40,15%,90%)] flex items-center gap-2">
                            <Shield className="w-5 h-5 text-[hsl(340,66%,33%)]" />
                            <h3 className="font-bold" style={{ color: 'hsl(340 20% 15%)' }}>My Support Style</h3>
                        </div>
                        <div className="p-5 grid gap-6">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'hsl(340 10% 45%)' }}>I'm okay talking about</h4>
                                <div className="flex flex-wrap gap-2">
                                    {["School Stress", "Anxiety", "Future Plans", "Family"].map(tag => (
                                        <span key={tag} className="peerconnect-badge text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'hsl(340 10% 45%)' }}>Best way to support me</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="peerconnect-badge-outline inline-flex items-center gap-1.5 bg-white">
                                        <Ear className="w-3 h-3" /> Just Listen
                                    </span>
                                    <span className="peerconnect-badge-outline inline-flex items-center gap-1.5 bg-white">
                                        <Grid className="w-3 h-3" /> Distractions
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tabs Section */}
                    <div className="flex border-b border-[hsl(40,15%,85%)] mb-6">
                        {(["posts", "capsules", "groups", "saved"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "flex-1 py-3 text-sm font-bold capitalize border-b-2 transition-colors",
                                    activeTab === tab
                                        ? "border-[hsl(340,66%,33%)] text-[hsl(340,66%,33%)]"
                                        : "border-transparent text-[hsl(340,10%,45%)] hover:text-[hsl(340,20%,15%)]"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Mock Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="min-h-[200px]"
                    >
                        {activeTab === "posts" && (
                            <div className="peerconnect-user-card p-8 text-center">
                                <div className="mx-auto w-12 h-12 bg-[hsl(40,20%,94%)] rounded-full flex items-center justify-center mb-3">
                                    <Edit className="w-5 h-5 text-[hsl(340,10%,45%)]" />
                                </div>
                                <p className="font-medium" style={{ color: 'hsl(340 20% 15%)' }}>No posts yet</p>
                                <p className="text-sm mt-1" style={{ color: 'hsl(340 10% 45%)' }}>Share what's on your mind.</p>
                            </div>
                        )}

                        {activeTab === "capsules" && (
                            <div className="space-y-6">
                                {/* Received */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">Received Capsules</h4>
                                    {myCapsules.received.length === 0 ? (
                                        <div className="text-center p-6 bg-white/50 border border-dashed border-gray-200 rounded-xl">
                                            <p className="text-sm text-gray-400 italic">No capsules received yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            {myCapsules.received.map((cap: Capsule) => (
                                                <button
                                                    key={cap.id}
                                                    onClick={() => setViewingCapsule(cap)}
                                                    className="w-full text-left p-4 rounded-xl peerconnect-user-card hover:shadow-md transition-all flex items-center gap-4 group"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-xl shadow-inner">📦</div>
                                                    <div>
                                                        <div className="font-bold text-[hsl(340,20%,15%)] group-hover:text-[hsl(340,66%,33%)] transition-colors">
                                                            From {cap.identityMode === "anonymous" ? "Someone" : cap.sender.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">Opened just now • Tap to read</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Sent */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">My Drops</h4>
                                    {myCapsules.sent.length === 0 ? (
                                        <div className="text-center p-6 bg-white/50 border border-dashed border-gray-200 rounded-xl">
                                            <p className="text-sm text-gray-400 italic">You haven't dropped any capsules.</p>
                                            <Link href="/time-capsule" className="text-xs font-bold text-[#8C1C46] mt-2 block hover:underline">Drop one now</Link>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            {myCapsules.sent.map((cap: Capsule) => (
                                                <div key={cap.id} className="w-full text-left p-4 rounded-xl peerconnect-user-card opacity-80 flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">☁️</div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 capitalize">{cap.type} Capsule</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">Sent on {new Date(cap.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "groups" && (
                            <div className="peerconnect-user-card p-8 text-center">
                                <div className="mx-auto w-12 h-12 bg-[hsl(40,20%,94%)] rounded-full flex items-center justify-center mb-3">
                                    <UsersRound className="w-5 h-5 text-[hsl(340,10%,45%)]" />
                                </div>
                                <p className="font-medium" style={{ color: 'hsl(340 20% 15%)' }}>8 Groups</p>
                                <Link href="/groups" className="text-xs font-bold text-[#8C1C46] mt-2 block hover:underline">View All Groups</Link>
                            </div>
                        )}

                        {activeTab === "saved" && (
                            <div className="peerconnect-user-card p-8 text-center">
                                <div className="mx-auto w-12 h-12 bg-[hsl(40,20%,94%)] rounded-full flex items-center justify-center mb-3">
                                    <Bookmark className="w-5 h-5 text-[hsl(340,10%,45%)]" />
                                </div>
                                <p className="font-medium" style={{ color: 'hsl(340 20% 15%)' }}>No saved items</p>
                            </div>
                        )}
                    </motion.div>
                </div>
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
