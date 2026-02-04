"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Mic, Image as ImageIcon, Video, Type, ChevronRight, Sparkles, X, Clock, AlertCircle, CheckCircle2, Heart } from "lucide-react";
import { FutureMessage, FutureMessageTrigger, FutureMessageTriggerType } from "./future-me-types";
import { cn } from "@/lib/utils";

// Mock save function
const saveFutureMessage = async (msg: FutureMessage) => {
    // In a real app, this would be an API call
    console.log("Saving future message:", msg);
    return new Promise(resolve => setTimeout(resolve, 1500));
};

export function CreateFutureMessage({ onClose, onSuccess, isEmbedded = false }: { onClose?: () => void; onSuccess?: () => void; isEmbedded?: boolean }) {
    const [step, setStep] = useState<"type" | "content" | "trigger" | "review" | "success">("type");
    const [messageType, setMessageType] = useState<"text" | "voice" | "photo" | "video">("text");
    const [content, setContent] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [triggerType, setTriggerType] = useState<FutureMessageTriggerType>("scheduled");
    const [triggerDate, setTriggerDate] = useState<string>("");
    const [triggerMood, setTriggerMood] = useState<string>("");
    const [isSaving, setIsSaving] = useState(false);

    // Audio recording state
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const recordingInterval = useRef<NodeJS.Timeout | null>(null);

    const handleNext = () => {
        if (step === "type") setStep("content");
        else if (step === "content") setStep("trigger");
        else if (step === "trigger") setStep("review");
    };

    const handleBack = () => {
        if (step === "content") setStep("type");
        else if (step === "trigger") setStep("content");
        else if (step === "review") setStep("trigger");
    };

    const handleSave = async () => {
        setIsSaving(true);
        const newMessage: FutureMessage = {
            id: `msg-${Date.now()}`,
            createdAt: new Date().toISOString(),
            type: messageType,
            content: content,
            // Mock media URL
            mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : undefined,
            trigger: {
                type: triggerType,
                date: triggerDate,
                mood: triggerMood
            },
            status: "pending",
            isFromPast: true
        };

        await saveFutureMessage(newMessage);
        setIsSaving(false);
        setStep("success");
        setTimeout(() => {
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (recordingInterval.current) clearInterval(recordingInterval.current);
        };
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            if (recordingInterval.current) clearInterval(recordingInterval.current);
            // Simulate saving audio
            setContent("Voice note recorded");
        } else {
            setIsRecording(true);
            setTimer(0);
            recordingInterval.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn("flex flex-col h-full overflow-y-auto", isEmbedded ? "bg-transparent" : "bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100")}>
            {/* Header - Only show if not embedded */}
            {!isEmbedded && (
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#8C1C46]" />
                        Future Me
                    </h2>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}

            {/* Progress Bar */}
            {step !== "success" && (
                <div className={cn("w-full h-1 shrink-0", isEmbedded ? "bg-white/5" : "bg-gray-100 dark:bg-white/5")}>
                    <motion.div
                        className="h-full bg-[#8C1C46]"
                        initial={{ width: "0%" }}
                        animate={{
                            width: step === "type" ? "25%" :
                                step === "content" ? "50%" :
                                    step === "trigger" ? "75%" : "100%"
                        }}
                    />
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SELECT TYPE */}
                    {step === "type" && (
                        <motion.div
                            key="type"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-2">What do you want to send?</h3>
                                <p className="text-gray-500 dark:text-gray-400">Choose a format for your future self.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: "text", icon: Type, label: "Letter", desc: "Write a note" },
                                    { id: "voice", icon: Mic, label: "Voice Note", desc: "Speak your mind" },
                                    { id: "photo", icon: ImageIcon, label: "Photo", desc: "Capture the moment" },
                                    { id: "video", icon: Video, label: "Video", desc: "Record a message" }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => {
                                            setMessageType(type.id as any);
                                            handleNext();
                                        }}
                                        className="flex flex-col items-center justify-center p-6 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-[#8C1C46] transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#8C1C46]/0 to-[#8C1C46]/0 group-hover:from-[#8C1C46]/5 group-hover:to-[#8C1C46]/20 transition-all duration-500" />

                                        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#8C1C46] group-hover:scale-110 transition-all duration-300 relative z-10 shadow-lg group-hover:shadow-[#8C1C46]/50">
                                            <type.icon className="w-7 h-7 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="font-bold mb-1 relative z-10 text-lg">{type.label}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 relative z-10">{type.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: CREATE CONTENT */}
                    {step === "content" && (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="h-full flex flex-col"
                        >
                            <h3 className="text-xl font-bold mb-4">
                                {messageType === "text" && "Write your letter"}
                                {messageType === "voice" && "Record voice note"}
                                {(messageType === "photo" || messageType === "video") && "Upload or Capture"}
                            </h3>

                            <div className="flex-1">
                                {messageType === "text" && (
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Dear Future Me, today I was feeling..."
                                        className="w-full h-64 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none resize-none focus:ring-2 focus:ring-[#8C1C46] focus:outline-none"
                                    />
                                )}

                                {messageType === "voice" && (
                                    <div className="flex flex-col items-center justify-center h-64">
                                        <div className="text-4xl font-mono local-font mb-8">
                                            {formatTime(timer)}
                                        </div>
                                        <button
                                            onClick={toggleRecording}
                                            className={cn(
                                                "w-20 h-20 rounded-full flex items-center justify-center transition-all",
                                                isRecording ? "bg-red-500 animate-pulse" : "bg-[#8C1C46]"
                                            )}
                                        >
                                            {isRecording ? (
                                                <div className="w-8 h-8 bg-white rounded-md" />
                                            ) : (
                                                <Mic className="w-8 h-8 text-white" />
                                            )}
                                        </button>
                                        <p className="mt-4 text-gray-500">
                                            {isRecording ? "Recording..." : "Tap to record"}
                                        </p>
                                    </div>
                                )}

                                {(messageType === "photo" || messageType === "video") && (
                                    <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl h-64 flex flex-col items-center justify-center text-gray-500">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4">
                                            {messageType === "photo" ? <ImageIcon className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                                        </div>
                                        <p>Drag and drop or click to upload</p>
                                        <button className="mt-4 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium">
                                            Select File
                                        </button>
                                        {/* Hidden input for real implementation */}
                                        <input type="file" className="hidden" />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={messageType === "text" && !content.trim()}
                                    className="flex-1 px-6 py-3 rounded-xl bg-[#8C1C46] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next Step
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SET TRIGGER */}
                    {step === "trigger" && (
                        <motion.div
                            key="trigger"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold mb-4">When should this be delivered?</h3>

                            <div className="space-y-4">
                                {/* Trigger Type Tabs */}
                                <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                                    {["scheduled", "mood", "milestone"].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTriggerType(t as any)}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                                                triggerType === t ? "bg-white dark:bg-white/10 shadow-sm text-[#8C1C46]" : "text-gray-500"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {/* Trigger Content */}
                                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    {triggerType === "scheduled" && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-[#8C1C46] font-medium mb-2">
                                                <Clock className="w-5 h-5" />
                                                Specific Date
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="p-3 bg-white dark:bg-black rounded-xl border text-left hover:border-[#8C1C46] transition-colors">
                                                    <span className="block text-xs text-gray-500">Popular</span>
                                                    <span className="font-medium">End of Semester</span>
                                                </button>
                                                <button className="p-3 bg-white dark:bg-black rounded-xl border text-left hover:border-[#8C1C46] transition-colors">
                                                    <span className="block text-xs text-gray-500">Popular</span>
                                                    <span className="font-medium">Finals Week</span>
                                                </button>
                                                <button className="p-3 bg-white dark:bg-black rounded-xl border text-left hover:border-[#8C1C46] transition-colors">
                                                    <span className="block text-xs text-gray-500">Time</span>
                                                    <span className="font-medium">My Birthday</span>
                                                </button>
                                                <button className="p-3 bg-white dark:bg-black rounded-xl border text-left hover:border-[#8C1C46] transition-colors">
                                                    <span className="block text-xs text-gray-500">Quick</span>
                                                    <span className="font-medium">Next Monday</span>
                                                </button>
                                            </div>
                                            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                                                <label className="block text-sm font-medium mb-2">Or pick a custom date</label>
                                                <input
                                                    type="date"
                                                    value={triggerDate}
                                                    onChange={(e) => setTriggerDate(e.target.value)}
                                                    className="w-full p-3 bg-white dark:bg-black border rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {triggerType === "mood" && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-[#8C1C46] font-medium mb-2">
                                                <Heart className="w-5 h-5" />
                                                Mood Trigger
                                            </div>
                                            <p className="text-sm text-gray-500">We'll deliver this when you check in with a specific mood.</p>
                                            <div className="flex flex-wrap gap-2">
                                                {["Stressed", "Lonely", "Anxious", "Need Support", "Tired"].map(mood => (
                                                    <button
                                                        key={mood}
                                                        onClick={() => setTriggerMood(mood)}
                                                        className={cn(
                                                            "px-4 py-2 rounded-full border text-sm transition-all",
                                                            triggerMood === mood
                                                                ? "bg-[#8C1C46] text-white border-[#8C1C46]"
                                                                : "bg-white dark:bg-black border-gray-200 hover:border-[#8C1C46]"
                                                        )}
                                                    >
                                                        {mood}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {triggerType === "milestone" && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-[#8C1C46] font-medium mb-2">
                                                <AlertCircle className="w-5 h-5" />
                                                Milestone
                                            </div>
                                            <p className="text-sm text-gray-500">Deliver when you reach a goal or milestone.</p>
                                            <input
                                                type="text"
                                                placeholder="e.g. When I complete my thesis"
                                                className="w-full p-3 bg-white dark:bg-black border rounded-xl"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex-1 px-6 py-3 rounded-xl bg-[#8C1C46] text-white font-bold"
                                >
                                    Review
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: REVIEW */}
                    {step === "review" && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-bold mb-4">Ready to send to the future?</h3>

                            <div className="bg-[#8C1C46]/5 dark:bg-[#8C1C46]/10 p-6 rounded-2xl border border-[#8C1C46]/20">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-[#8C1C46] rounded-full flex items-center justify-center shrink-0">
                                        {messageType === "text" && <Type className="w-6 h-6 text-white" />}
                                        {messageType === "voice" && <Mic className="w-6 h-6 text-white" />}
                                        {(messageType === "photo" || messageType === "video") && <ImageIcon className="w-6 h-6 text-white" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Future Message</h4>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {messageType === "text" && "Text Letter"}
                                            {messageType === "voice" && "Voice Note"}
                                            {messageType === "photo" && "Photo Memory"}
                                            {messageType === "video" && "Video Message"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-[#8C1C46]" />
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs uppercase font-bold">Deliver When</span>
                                            <span className="font-medium capitalize">
                                                {triggerType}
                                                {triggerType === "scheduled" && triggerDate && ` (${new Date(triggerDate).toLocaleDateString()})`}
                                                {triggerType === "mood" && triggerMood && ` (Feeling ${triggerMood})`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-sm text-gray-500">
                                This message will be locked in the Journal until the trigger condition is met.
                            </p>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleBack}
                                    className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 px-6 py-3 rounded-xl bg-[#8C1C46] text-white font-bold flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>Saving...</>
                                    ) : (
                                        <>Confirm & Seal <CheckCircle2 className="w-5 h-5" /></>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: SUCCESS */}
                    {step === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center p-6"
                        >
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                                <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Message Sealed!</h3>
                            <p className="text-gray-500 max-w-xs">
                                Your message has been safely stored. We'll deliver it to you when the time is right.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
