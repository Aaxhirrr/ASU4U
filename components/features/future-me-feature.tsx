"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Type, Image as ImageIcon, Video, Send, Calendar, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ContentMode = "voice" | "text" | "photo" | "video";
type TriggerMode = "date" | "mood" | "milestone";

export function FutureMeFeature({ isFullScreen = false, onClose }: { isFullScreen?: boolean; onClose?: () => void }) {
    const [mode, setMode] = useState<ContentMode>("voice");
    const [step, setStep] = useState<"create" | "trigger" | "done">("create");

    // Voice state
    const [recording, setRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [voiceSaved, setVoiceSaved] = useState(false);

    // Text state
    const [textContent, setTextContent] = useState("");

    // Photo/Video state
    const [photoSelected, setPhotoSelected] = useState(false);
    const [videoSelected, setVideoSelected] = useState(false);

    // Trigger state
    const [triggerMode, setTriggerMode] = useState<TriggerMode>("date");
    const [triggerDate, setTriggerDate] = useState("");
    const [triggerMood, setTriggerMood] = useState("");

    useEffect(() => {
        let interval: any;
        if (recording) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        } else if (!recording && timer > 0) {
            // Recording stopped with content
        }
        return () => clearInterval(interval);
    }, [recording]);

    const handleToggleRecord = () => {
        if (recording) {
            setRecording(false);
            setVoiceSaved(true);
        } else {
            setRecording(true);
            setTimer(0);
            setVoiceSaved(false);
        }
    };

    const canProceed = () => {
        if (mode === "voice") return voiceSaved;
        if (mode === "text") return textContent.trim().length > 10;
        if (mode === "photo") return photoSelected;
        if (mode === "video") return videoSelected;
        return false;
    };

    const handleNext = () => {
        if (step === "create" && canProceed()) {
            setStep("trigger");
        } else if (step === "trigger") {
            setStep("done");
        }
    };

    const handleSeal = () => {
        setStep("done");
        setTimeout(() => {
            if (onClose) onClose();
        }, 2500);
    };

    const modes = [
        { id: "voice" as const, icon: Mic, label: "Voice" },
        { id: "text" as const, icon: Type, label: "Letter" },
        { id: "photo" as const, icon: ImageIcon, label: "Photo" },
        { id: "video" as const, icon: Video, label: "Video" },
    ];

    const moodOptions = ["Stressed", "Lonely", "Anxious", "Need a Win", "Tired"];

    return (
        <div className={cn("flex flex-col items-center justify-center h-full pt-16 pb-8 px-6", isFullScreen ? "bg-[#0a0a0a]" : "")}>

            {/* Mode Tabs - Sleek pill selector */}
            {step === "create" && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-1 p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    {modes.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => {
                                setMode(m.id);
                                setVoiceSaved(false);
                                setTextContent("");
                            }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                                mode === m.id
                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                            )}
                        >
                            <m.icon className="w-4 h-4" />
                            {m.label}
                        </button>
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* === CREATE STEP === */}
                {step === "create" && (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center"
                    >
                        {/* VOICE MODE - Original sick UI */}
                        {mode === "voice" && (
                            <>
                                <div className="relative group cursor-pointer" onClick={handleToggleRecord}>
                                    <div className={cn(
                                        "absolute inset-0 blur-[100px] rounded-full transition-all duration-500",
                                        recording ? "bg-red-500/40 scale-150 animate-pulse" : "bg-blue-500/30 group-hover:bg-blue-500/40 group-hover:scale-110"
                                    )} />
                                    <div className={cn(
                                        "w-56 h-56 rounded-full border border-white/10 bg-gradient-to-br backdrop-blur-2xl flex items-center justify-center relative shadow-2xl transition-all duration-500",
                                        recording ? "from-red-900/50 to-black scale-110" : "from-white/5 to-transparent group-hover:scale-105"
                                    )}>
                                        <div className={cn(
                                            "w-40 h-40 rounded-full bg-gradient-to-br flex items-center justify-center shadow-inner shadow-black/50 transition-all duration-300",
                                            recording ? "from-red-500 to-red-700" : "from-blue-500 to-indigo-600"
                                        )}>
                                            {recording ? (
                                                <div className="w-14 h-14 bg-white rounded-xl animate-pulse" />
                                            ) : (
                                                <Mic className="w-16 h-16 text-white" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 text-center space-y-2">
                                    {recording ? (
                                        <>
                                            <div className="text-red-400 font-mono text-2xl tracking-widest flex items-center gap-3 justify-center">
                                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                                00:{timer.toString().padStart(2, '0')} / 01:00
                                            </div>
                                            <div className="text-white/40 text-sm">Recording... Tap to stop</div>
                                        </>
                                    ) : voiceSaved ? (
                                        <div className="text-emerald-400 font-bold text-lg flex items-center gap-2 justify-center">
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                            Voice Note Ready!
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-white font-mono text-sm tracking-[0.3em] opacity-50">TAP TO RECORD</div>
                                            <div className="text-blue-400 font-bold text-xs uppercase tracking-wider">Max 60 Seconds</div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* TEXT MODE - Beautiful letter writing */}
                        {mode === "text" && (
                            <div className="w-full max-w-md">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-3xl rounded-3xl" />
                                    <textarea
                                        value={textContent}
                                        onChange={(e) => setTextContent(e.target.value)}
                                        placeholder="Dear Future Me..."
                                        className="relative w-full h-64 p-6 rounded-3xl bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-xl text-lg leading-relaxed"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between items-center text-sm">
                                    <span className={cn("transition-colors", textContent.length > 10 ? "text-emerald-400" : "text-white/30")}>
                                        {textContent.length} characters
                                    </span>
                                    <span className="text-white/30">Min 10 characters</span>
                                </div>
                            </div>
                        )}

                        {/* PHOTO MODE */}
                        {mode === "photo" && (
                            <div className="w-full max-w-md">
                                <div
                                    onClick={() => {
                                        // Simulate file selection
                                        setPhotoSelected(true);
                                    }}
                                    className={cn(
                                        "relative cursor-pointer group",
                                        photoSelected ? "" : ""
                                    )}
                                >
                                    <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl rounded-3xl" />
                                    {photoSelected ? (
                                        <div className="relative w-full h-64 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex flex-col items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400')] bg-cover bg-center opacity-60" />
                                            <div className="relative z-10 text-emerald-400 font-bold text-lg flex items-center gap-2">
                                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                Photo Ready!
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setPhotoSelected(false); }}
                                                className="relative z-10 mt-3 text-white/50 text-sm hover:text-white/80"
                                            >
                                                Change photo
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-64 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-all">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <ImageIcon className="w-10 h-10 text-purple-400" />
                                            </div>
                                            <div className="text-white/70 font-medium mb-1">Tap to add a photo</div>
                                            <div className="text-white/40 text-sm">Capture a memory for future you</div>
                                        </div>
                                    )}
                                </div>
                                {photoSelected && (
                                    <textarea
                                        placeholder="Add a caption... (optional)"
                                        className="w-full mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        rows={2}
                                    />
                                )}
                            </div>
                        )}

                        {/* VIDEO MODE */}
                        {mode === "video" && (
                            <div className="w-full max-w-md">
                                <div
                                    onClick={() => setVideoSelected(true)}
                                    className="relative cursor-pointer group"
                                >
                                    <div className="absolute -inset-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 blur-3xl rounded-3xl" />
                                    {videoSelected ? (
                                        <div className="relative w-full h-64 rounded-3xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex flex-col items-center justify-center">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
                                                <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent ml-1.5" />
                                            </div>
                                            <div className="text-emerald-400 font-bold text-lg flex items-center gap-2">
                                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                                Video Ready!
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setVideoSelected(false); }}
                                                className="mt-4 text-white/50 text-sm hover:text-white/80 transition-colors"
                                            >
                                                Record again
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-64 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-red-500/50 hover:bg-red-500/5 transition-all">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Video className="w-10 h-10 text-red-400" />
                                            </div>
                                            <div className="text-white/70 font-medium mb-1">Tap to record a video</div>
                                            <div className="text-white/40 text-sm">Max 60 seconds</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Next Button */}
                        {canProceed() && (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleNext}
                                className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all"
                            >
                                Choose Delivery Time →
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* === TRIGGER STEP === */}
                {step === "trigger" && (
                    <motion.div
                        key="trigger"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full max-w-md space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">When should I deliver this?</h3>
                            <p className="text-white/50 text-sm">Pick a time or trigger</p>
                        </div>

                        {/* Trigger Mode Selector */}
                        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl">
                            {[
                                { id: "date" as const, icon: Calendar, label: "Date" },
                                { id: "mood" as const, icon: Heart, label: "Mood" },
                                { id: "milestone" as const, icon: Clock, label: "Milestone" },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTriggerMode(t.id)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all",
                                        triggerMode === t.id
                                            ? "bg-white/10 text-white"
                                            : "text-white/40 hover:text-white/70"
                                    )}
                                >
                                    <t.icon className="w-4 h-4" />
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Trigger Options */}
                        <div className="space-y-3">
                            {triggerMode === "date" && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["Finals Week", "End of Semester", "My Birthday", "Next Monday"].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => setTriggerDate(opt)}
                                                className={cn(
                                                    "p-4 rounded-2xl border text-left transition-all",
                                                    triggerDate === opt
                                                        ? "bg-blue-500/20 border-blue-500/50 text-white"
                                                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                                )}
                                            >
                                                <span className="font-medium">{opt}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        onChange={(e) => setTriggerDate(e.target.value)}
                                    />
                                </>
                            )}

                            {triggerMode === "mood" && (
                                <div className="flex flex-wrap gap-2">
                                    {moodOptions.map((mood) => (
                                        <button
                                            key={mood}
                                            onClick={() => setTriggerMood(mood)}
                                            className={cn(
                                                "px-5 py-2.5 rounded-full border text-sm font-medium transition-all",
                                                triggerMood === mood
                                                    ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                            )}
                                        >
                                            {mood}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {triggerMode === "milestone" && (
                                <input
                                    type="text"
                                    placeholder="e.g. When I finish my thesis"
                                    className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            )}
                        </div>

                        {/* Seal Button */}
                        <motion.button
                            onClick={handleSeal}
                            className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Seal & Send to Future
                        </motion.button>

                        <button onClick={() => setStep("create")} className="w-full py-3 text-white/40 text-sm hover:text-white/60 transition-colors">
                            ← Go Back
                        </button>
                    </motion.div>
                )}

                {/* === DONE STEP === */}
                {step === "done" && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/30 blur-[80px] rounded-full animate-pulse" />
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative">
                                <Send className="w-14 h-14 text-white" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mt-8 mb-2">Message Sealed! ✨</h3>
                        <p className="text-white/50 max-w-xs">
                            Your message is safely stored. We'll deliver it when the time is right.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
