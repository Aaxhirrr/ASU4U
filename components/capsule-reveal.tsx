"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Heart, MessageCircle } from "lucide-react";
import { Capsule } from "@/lib/sim/capsule-state";
import { cn } from "@/lib/utils";

export function CapsuleReveal({ capsule, onClose }: { capsule: Capsule; onClose: () => void }) {
    const [isOpened, setIsOpened] = useState(false);
    const [isRevealed, setIsRevealed] = useState(capsule.identityMode === "named");

    if (!capsule) return null;

    return (
        <div className="w-full max-w-lg mx-auto perspective-1000">
            <AnimatePresence mode="wait">
                {!isOpened ? (
                    <motion.div
                        key="sealed"
                        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        className="bg-white rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden cursor-pointer"
                        onClick={() => setIsOpened(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500" />

                        <motion.div
                            className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl shadow-inner"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            📦
                        </motion.div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">A Capsule Found You</h2>
                        <p className="text-gray-500 mb-8">Someone left this for a day like today.</p>

                        <div className="inline-block px-6 py-3 bg-black text-white rounded-full font-bold text-sm tracking-wide uppercase">
                            Tap to Open
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="opened"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative"
                    >
                        {/* Header Image (if snapshot) */}
                        {capsule.type === "snapshot" && capsule.mediaUrl && (
                            <div className="h-64 w-full bg-gray-100 relative">
                                <img src={capsule.mediaUrl} alt="Capsule" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        )}

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white",
                                        isRevealed ? "bg-blue-500" : "bg-gray-400"
                                    )}>
                                        {isRevealed ? (capsule.sender.photo ? <img src={capsule.sender.photo} className="w-full h-full rounded-full object-cover" /> : capsule.sender.name[0]) : "?"}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {isRevealed ? capsule.sender.name : "Anonymous Student"}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {isRevealed ? capsule.sender.major : "Unknown Major"}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="prose prose-lg text-gray-700 mb-8">
                                <p className="font-medium text-xl leading-relaxed">
                                    "{capsule.content}"
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3">
                                {capsule.identityMode === "revealable" && !isRevealed && (
                                    <button
                                        onClick={() => setIsRevealed(true)}
                                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-gray-300 hover:text-gray-700 font-medium transition-colors mb-2"
                                    >
                                        Reveal Identity
                                    </button>
                                )}

                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 text-gray-700">
                                        <Heart className="w-4 h-4" /> Save
                                    </button>
                                    {(isRevealed || capsule.identityMode !== "anonymous") && (
                                        <button className="flex-1 py-3 bg-[#8C1C46] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#7a183d]">
                                            <MessageCircle className="w-4 h-4" /> Reply
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
