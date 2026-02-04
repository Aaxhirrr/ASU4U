"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mood, CheckIn, findMatchingCapsule, Capsule } from "@/lib/sim/capsule-state";
import { CapsuleReveal } from "./capsule-reveal";

interface DailyCheckInProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DailyCheckIn({ isOpen, onClose }: DailyCheckInProps) {
    const [step, setStep] = useState<"mood" | "processing" | "result">("mood");
    const [moodScore, setMoodScore] = useState(3);
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [foundCapsule, setFoundCapsule] = useState<Capsule | null>(null);

    const MOODS: { label: string; value: Mood; emoji: string }[] = [
        { label: "Stressed", value: "stressed", emoji: "😰" },
        { label: "Lonely", value: "lonely", emoji: "😔" },
        { label: "Tired", value: "tired", emoji: "😴" },
        { label: "Anxious", value: "anxious", emoji: "😬" },
        { label: "Motivated", value: "motivated", emoji: "🔥" },
        { label: "Hopeful", value: "hopeful", emoji: "✨" },
    ];

    const handleCheckIn = () => {
        if (!selectedMood) return;

        setStep("processing");

        // Simulate processing
        setTimeout(() => {
            const checkIn: CheckIn = {
                mood: selectedMood,
                moodScore: moodScore,
                tags: [],
                timestamp: Date.now()
            };

            const match = findMatchingCapsule(checkIn);
            setFoundCapsule(match);
            setStep("result");
        }, 1500);
    };

    if (step === "result" && foundCapsule) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <CapsuleReveal capsule={foundCapsule} onClose={onClose} />
            </div>
        );
    }

    if (step === "result" && !foundCapsule) {
        // Fallback if no match found (or error)
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
                <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-xl font-bold mb-2">Check-in Complete</h3>
                    <p className="text-gray-500 mb-6">Thanks for logging your mood. No capsules found for you right now, but check back later!</p>
                    <button onClick={onClose} className="w-full py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">Close</button>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] overflow-hidden shadow-2xl"
                    >
                        {step === "mood" && (
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">How are you?</h2>
                                        <p className="text-gray-500">Your check-in is private.</p>
                                    </div>
                                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Mood Slider */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        <span>Terrible</span>
                                        <span>Okay</span>
                                        <span>Great</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={moodScore}
                                        onChange={(e) => setMoodScore(parseInt(e.target.value))}
                                        className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8C1C46]"
                                    />
                                    <div className="flex justify-center mt-2 text-2xl">
                                        {moodScore === 1 && "😫"}
                                        {moodScore === 2 && "😕"}
                                        {moodScore === 3 && "😐"}
                                        {moodScore === 4 && "🙂"}
                                        {moodScore === 5 && "🤩"}
                                    </div>
                                </div>

                                {/* Mood Chips */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {MOODS.map((m) => (
                                        <button
                                            key={m.value}
                                            onClick={() => setSelectedMood(m.value)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                                                selectedMood === m.value
                                                    ? "border-[#8C1C46] bg-[#8C1C46]/5"
                                                    : "border-gray-100 hover:border-gray-200"
                                            )}
                                        >
                                            <span className="text-2xl">{m.emoji}</span>
                                            <span className={cn("font-medium", selectedMood === m.value ? "text-[#8C1C46]" : "text-gray-600")}>
                                                {m.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    disabled={!selectedMood}
                                    onClick={handleCheckIn}
                                    className="w-full py-4 rounded-2xl bg-[#8C1C46] text-white font-bold text-lg hover:bg-[#7a183d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#8C1C46]/20"
                                >
                                    Check In
                                </button>
                            </div>
                        )}

                        {step === "processing" && (
                            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 rounded-full border-4 border-[#8C1C46]/30 border-t-[#8C1C46] mb-8"
                                />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Finding a connection...</h3>
                                <p className="text-center text-gray-500">Matching your energy with the campus ocean.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
