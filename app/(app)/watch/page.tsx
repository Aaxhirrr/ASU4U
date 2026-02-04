"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Heart, MessageCircle, Share2, Users, UsersRound, BookOpen, Search, User, Compass, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/peerconnect.css";

import { VIDEOS } from "@/lib/data/mock-videos";
import { BottomNav } from "@/components/bottom-nav";

// ...

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 } as const
    }
};

export default function WatchPage() {
    const [filter, setFilter] = useState("For You");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="peerconnect-page min-h-screen bg-black text-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black/90 to-transparent backdrop-blur-md px-4 pt-6 pb-6 flex items-center justify-between pointer-events-none">
                {/* Pointer events auto for interactive elements */}
                <div className="relative pointer-events-auto">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2"
                    >
                        <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D4D] via-[#F9CB28] to-[#8C1C46] pb-1">
                            {filter}
                        </h1>
                        <ChevronDown className={`w-6 h-6 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                            >
                                {['For You', 'Following', 'Top', 'Latest'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setFilter(option);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${filter === option ? 'text-[#8C1C46] bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative bg-white/10 p-2 rounded-full backdrop-blur-md pointer-events-auto">
                    <Search className="w-5 h-5 text-white" />
                </div>
            </div>

            {/* Grid */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[1px] bg-black pb-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {VIDEOS.map((item, i) => (
                    <Link href={`/watch/feed?index=${i}`} key={item.id}>
                        <motion.div
                            className="aspect-[9/16] relative group cursor-pointer overflow-hidden rounded-sm bg-gray-900"
                            variants={itemVariants}
                            whileHover={{ scale: 0.98 }}
                        >
                            {/* Placeholder Content (Fallback) */}
                            <div
                                className="absolute inset-0 flex items-center justify-center text-black/20 font-bold text-4xl uppercase"
                                style={{ backgroundColor: item.color }}
                            >
                                Video {i + 1}
                            </div>

                            {/* Video Content */}
                            <div className="absolute inset-0">
                                <video
                                    src={item.videoSrc}
                                    className="w-full h-full object-cover"
                                    muted
                                    autoPlay
                                    playsInline
                                    loop
                                    onMouseOver={(e) => e.currentTarget.play().catch(() => { })}
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 flex flex-col justify-end p-3">
                                <div className="flex items-center gap-1 text-xs font-medium mb-1 drop-shadow-md text-white/80">
                                    <Play className="w-3 h-3 fill-white/80" />
                                    {(item.views / 1000).toFixed(1)}k
                                </div>
                                <p className="text-white text-sm font-semibold tracking-wide leading-tight drop-shadow-lg line-clamp-2">{item.title}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                        <img src={item.profilePhoto} alt={item.user} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-white/90 font-medium">{item.user}</span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>

            {/* Navigation (Dark Mode Version) */}
            <BottomNav />
        </div>
    );
}
