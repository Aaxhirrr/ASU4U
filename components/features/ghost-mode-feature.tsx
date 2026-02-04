"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ghost, Lock } from "lucide-react";

export function GhostModeFeature({ isFullScreen = false, onClose }: { isFullScreen?: boolean; onClose?: () => void }) {
    const [posted, setPosted] = useState(false);
    const [text, setText] = useState("");

    const handlePost = () => {
        if (!text.trim()) return;
        setPosted(true);
        setTimeout(() => {
            setPosted(false);
            setText("");
            if (onClose) onClose();
        }, 2000);
    };

    return (
        <div className="flex h-full p-12 pt-24 max-w-4xl mx-auto flex-col relative">
            <AnimatePresence>
                {posted && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center rounded-3xl"
                    >
                        <Ghost className="w-20 h-20 text-white animate-bounce mb-6" />
                        <h3 className="text-2xl font-bold text-white">Vanished into the void...</h3>
                        <p className="text-white/50">Your thought has been anonymously released.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col">
                <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10 shadow-lg">
                        <Ghost className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-white font-bold">Anonymous Student</div>
                        <div className="text-xs text-white/40 font-mono">ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-2">
                            <Lock className="w-3 h-3" />
                            ENCRYPTED
                        </div>
                    </div>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 bg-transparent border-none text-2xl text-white/90 placeholder:text-white/20 focus:ring-0 resize-none leading-relaxed"
                    placeholder="What's happening? Your identity is protected..."
                />
            </div>

            <div className="h-24 mt-6 flex items-center justify-between">
                <div className="flex gap-4">
                    {['Campus Wide', 'Group Only', 'Mentors'].map((scope, i) => (
                        <button key={i} className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-medium text-white/60 hover:text-white transition-all">
                            {scope}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handlePost}
                    disabled={!text.trim()}
                    className="px-10 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:scale-100"
                >
                    PUBLISH
                </button>
            </div>
        </div>
    );
}
