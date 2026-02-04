"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Type, Image as ImageIcon, Sparkles, ChevronRight, RefreshCw, X, Fingerprint, Disc } from "lucide-react";
import { cn } from "@/lib/utils";
import { dropCapsule, Capsule, Mood } from "@/lib/sim/capsule-state";

export function CapsuleCreator({ onClose }: { onClose?: () => void }) {
    const [step, setStep] = useState<"type" | "content" | "meta">("type");
    const [type, setType] = useState<"letter" | "snapshot" | "voice" | null>(null);
    const [content, setContent] = useState("");
    const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [isDropping, setIsDropping] = useState(false);

    // Dynamic background based on type/step
    const getBackgroundGradient = () => {
        if (step === "type") return "from-slate-900 via-purple-950 to-slate-900";
        if (type === "letter") return "from-orange-950/40 via-slate-900 to-slate-900";
        if (type === "snapshot") return "from-blue-950/40 via-slate-900 to-slate-900";
        if (type === "voice") return "from-green-950/40 via-slate-900 to-slate-900";
        return "from-slate-900 via-purple-950 to-slate-900";
    };

    const MOOD_CHIPS: { label: string; value: Mood; emoji: string; color: string }[] = [
        { label: "Stressed", value: "stressed", emoji: "😰", color: "border-red-500/30 bg-red-500/10 text-red-200" },
        { label: "Lonely", value: "lonely", emoji: "😔", color: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200" },
        { label: "Motivated", value: "motivated", emoji: "🔥", color: "border-orange-500/30 bg-orange-500/10 text-orange-200" },
        { label: "Tired", value: "tired", emoji: "😴", color: "border-purple-500/30 bg-purple-500/10 text-purple-200" },
        { label: "Hopeful", value: "hopeful", emoji: "✨", color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" },
        { label: "Anxious", value: "anxious", emoji: "😬", color: "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" },
    ];

    const handleDrop = () => {
        if (!type || !content.trim()) return;
        setIsDropping(true);

        setTimeout(() => {
            const newCapsule: Capsule = {
                id: `capsule-${Date.now()}`,
                sender: { id: "current-user", name: "You" },
                type: type,
                content: content,
                tags: [],
                moods: selectedMoods.length > 0 ? selectedMoods : ["neutral"],
                identityMode: isAnonymous ? "anonymous" : "revealable",
                createdAt: new Date().toISOString(),
                isOpened: false
            };
            dropCapsule(newCapsule);

            setTimeout(() => {
                setIsDropping(false);
                if (onClose) onClose();
            }, 1000);
        }, 2000);
    };

    const toggleMood = (mood: Mood) => {
        setSelectedMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
    };

    return (
        <div className={cn("h-full w-full flex flex-col relative overflow-hidden text-white transition-colors duration-1000 bg-gradient-to-br", getBackgroundGradient())}>

            {/* Ambient Noise / Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* Glowing Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -30, 0],
                    y: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"
            />

            {/* Navigation / Progress */}
            <div className="relative z-20 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2">
                    <div className={cn("h-1.5 rounded-full transition-all duration-500", step === "type" ? "w-8 bg-white" : "w-2 bg-white/20")} />
                    <div className={cn("h-1.5 rounded-full transition-all duration-500", step === "content" ? "w-8 bg-white" : "w-1.5 bg-white/20")} />
                    <div className={cn("h-1.5 rounded-full transition-all duration-500", step === "meta" ? "w-8 bg-white" : "w-1.5 bg-white/20")} />
                </div>
                {step !== "type" && (
                    <button onClick={() => setStep(step === "meta" ? "content" : "type")} className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        Back
                    </button>
                )}
            </div>

            <div className="flex-1 relative z-10 flex flex-col">
                <AnimatePresence mode="wait">

                    {/* === STEP 1: TYPE SELECTION === */}
                    {step === "type" && (
                        <motion.div
                            key="step-type"
                            className="flex-1 flex flex-col justify-center px-4 sm:px-12"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                                Drop a Capsule.
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
                                {[
                                    { id: "letter", icon: Type, title: "Letter", sub: "Written Wisdom", color: "hover:shadow-orange-500/20 hover:border-orange-500/40" },
                                    { id: "snapshot", icon: ImageIcon, title: "Snapshot", sub: "Visual Memory", color: "hover:shadow-blue-500/20 hover:border-blue-500/40" },
                                    { id: "voice", icon: Mic, title: "Voice", sub: "Spoken Word", color: "hover:shadow-green-500/20 hover:border-green-500/40" }
                                ].map((item, i) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => { setType(item.id as any); setStep("content"); }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={cn(
                                            "group relative h-80 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl p-8 flex flex-col items-center justify-center gap-6 transition-all duration-300 shadow-2xl",
                                            item.color
                                        )}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
                                            <item.icon className="w-8 h-8 text-white/80 group-hover:text-white" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:tracking-wide transition-all">{item.title}</h3>
                                            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">{item.sub}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* === STEP 2: CONTENT CREATION === */}
                    {step === "content" && (
                        <motion.div
                            key="step-content"
                            className="flex-1 flex flex-col px-4 sm:px-12 pb-12"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                        >
                            <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full relative">

                                {/* Text Editor Area */}
                                <div className="w-full relative min-h-[40vh] flex flex-col">
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder={type === "letter" ? "Start writing..." : type === "snapshot" ? "Add a caption..." : "Transcribing..."}
                                        className="w-full h-full bg-transparent border-none focus:ring-0 p-0 text-3xl md:text-5xl font-medium placeholder:text-white/10 resize-none text-white leading-tight text-center selection:bg-white/20"
                                        autoFocus
                                    />

                                    {/* Type-Specific Visuals */}
                                    {type === "voice" && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="flex gap-1 items-center h-20">
                                                {[...Array(12)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [20, Math.random() * 80 + 20, 20] }}
                                                        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
                                                        className="w-2 bg-white/60 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {type === "snapshot" && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                            <ImageIcon className="w-48 h-48 text-white/20" />
                                        </div>
                                    )}
                                </div>

                                {/* Floating Next Button */}
                                <motion.button
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: content.trim() ? 1 : 0, scale: content.trim() ? 1 : 0 }}
                                    onClick={() => setStep("meta")}
                                    className="mt-12 group flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-110 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                                >
                                    <span>Next Step</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* === STEP 3: METADATA & SEND === */}
                    {step === "meta" && (
                        <motion.div
                            key="step-meta"
                            className="flex-1 flex flex-col items-center justify-center px-4 sm:px-12"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                        >
                            <div className="max-w-2xl w-full bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                                <h3 className="text-3xl font-bold text-center mb-2">Seal Your Capsule</h3>
                                <p className="text-white/40 text-center mb-10">Add emotional context to help it find the right home.</p>

                                {/* Moods */}
                                <div className="space-y-4 mb-10">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-2">Vibe Check</label>
                                    <div className="flex flex-wrap gap-3 justify-center">
                                        {MOOD_CHIPS.map((mood) => (
                                            <button
                                                key={mood.value}
                                                onClick={() => toggleMood(mood.value)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-2xl border text-sm font-medium transition-all duration-300 flex items-center gap-2",
                                                    selectedMoods.includes(mood.value)
                                                        ? `${mood.color} shadow-lg scale-105`
                                                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                                )}
                                            >
                                                <span>{mood.emoji}</span>
                                                {mood.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Identity Toggle */}
                                <div className="space-y-4 mb-10">
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-2">Signature</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setIsAnonymous(true)}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2",
                                                isAnonymous
                                                    ? "bg-white/10 border-white/30 text-white shadow-inner"
                                                    : "bg-transparent border-white/5 text-white/30 hover:bg-white/5"
                                            )}
                                        >
                                            <Fingerprint className="w-6 h-6" />
                                            <span className="text-sm font-bold">Anonymous</span>
                                        </button>
                                        <button
                                            onClick={() => setIsAnonymous(false)}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2",
                                                !isAnonymous
                                                    ? "bg-white/10 border-white/30 text-white shadow-inner"
                                                    : "bg-transparent border-white/5 text-white/30 hover:bg-white/5"
                                            )}
                                        >
                                            <Sparkles className="w-6 h-6" />
                                            <span className="text-sm font-bold">Revealable</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Send Button */}
                                <button
                                    onClick={handleDrop}
                                    disabled={isDropping}
                                    className="w-full relative group overflow-hidden py-5 rounded-2xl bg-white text-black font-black text-xl tracking-wide shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 opacity-transition duration-500" />
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {isDropping ? (
                                            <>
                                                <RefreshCw className="w-6 h-6 animate-spin" />
                                                Sealing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-6 h-6" />
                                                DROP CAPSULE
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
