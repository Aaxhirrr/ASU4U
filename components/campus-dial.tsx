"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Mic, Heart, Ghost, Plus, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Verify this path
import { useRouter } from "next/navigation";

// Define the feature components - MAKE SURE THESE ARE IMPORTED
import { VibeMapFeature } from "@/components/features/vibe-map-feature";
import { CapsuleCreator } from "@/components/features/time-capsule-feature";
import { FutureMeFeature } from "@/components/features/future-me-feature";
import { SOSFeature } from "@/components/features/sos-feature";
import { GhostModeFeature } from "@/components/features/ghost-mode-feature";

interface CampusDialProps {
    onOpenVibeMap: () => void;
    onOpenTimeCapsule: () => void;
    onOpenFutureMe: () => void;
    onOpenSOS: () => void;
    onOpenGhostMode: () => void;
}

// === MAIN DIAL COMPONENT ===
export function CampusDial({
    onOpenVibeMap,
    onOpenTimeCapsule,
    onOpenFutureMe,
    onOpenSOS,
    onOpenGhostMode,
}: CampusDialProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);

    const items = [
        { id: "vibe-map", icon: MapPin, label: "Vibe Map" },
        { id: "time-capsule", icon: Clock, label: "Capsule" },
        { id: "future-me", icon: Mic, label: "Future Me" },
        { id: "ghost", icon: Ghost, label: "Ghost" },
    ];

    const handleClick = (id: string) => {
        setIsOpen(false);
        setTimeout(() => {
            if (id === "vibe-map") onOpenVibeMap();
            if (id === "time-capsule") onOpenTimeCapsule();
            if (id === "future-me") onOpenFutureMe();
            if (id === "ghost") onOpenGhostMode();
        }, 200);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />
                )}
            </AnimatePresence>

            <div className="fixed bottom-24 right-8 z-[70] pointer-events-none">
                <AnimatePresence>
                    {isOpen && items.map((item, i) => {
                        const angle = 180 + (90 / (items.length - 1)) * i;
                        const radius = 160;
                        const rad = (angle * Math.PI) / 180;
                        const x = Math.cos(rad) * radius;
                        const y = Math.sin(rad) * radius;

                        return (
                            <motion.button
                                key={item.id}
                                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                                animate={{ x, y, scale: 1, opacity: 1 }}
                                exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.03 }}
                                onClick={() => handleClick(item.id)}
                                onMouseEnter={() => setHovered(item.id)}
                                onMouseLeave={() => setHovered(null)}
                                className={cn(
                                    "absolute bottom-4 right-4 w-16 h-16 rounded-full pointer-events-auto",
                                    "flex flex-col items-center justify-center gap-1",
                                    "bg-white shadow-xl border border-gray-100",
                                    "hover:scale-110 active:scale-95 transition-transform duration-200",
                                    hovered === item.id ? "z-20 scale-125" : "z-10"
                                )}
                            >
                                <item.icon className="w-6 h-6 text-[#8C1C46]" strokeWidth={2} />
                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{item.label}</span>
                            </motion.button>
                        );
                    })}
                </AnimatePresence>

                {/* Main Toggle Button */}
                <div className="absolute bottom-0 right-0 pointer-events-auto">
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className={cn(
                            "w-20 h-20 rounded-full flex items-center justify-center",
                            "bg-gradient-to-br from-gray-900 to-black text-white",
                            "shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/10",
                            "relative z-50 overflow-hidden"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                        <Plus className="w-8 h-8 relative z-10" strokeWidth={2} />
                    </motion.button>
                </div>
            </div>
        </>
    );
}

// === PREMIUM MODAL CONTAINER ===
function DialModal({ isOpen, onClose, children, title, subtitle, theme = "dark", fullScreenPath }: any) {
    const router = useRouter();
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose} />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={cn(
                            "relative w-full max-w-5xl h-[85vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl",
                            theme === "dark"
                                ? "bg-[#0a0a0a] border border-white/10 text-white"
                                : "bg-white border border-gray-200 text-gray-900"
                        )}
                    >
                        {/* Glass Header */}
                        <div className="absolute top-0 left-0 right-0 px-8 py-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                            <div className="pointer-events-auto">
                                <h2 className={cn("text-3xl font-bold tracking-tight", theme === "light" && "text-gray-900")}>{title}</h2>
                                <p className={cn("text-sm font-medium opacity-60", theme === "light" ? "text-gray-500" : "text-gray-300")}>{subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2 pointer-events-auto">
                                {fullScreenPath && (
                                    <button
                                        onClick={() => router.push(fullScreenPath)}
                                        className={cn(
                                            "p-3 rounded-full backdrop-blur-md transition-all hover:scale-110",
                                            theme === "dark" ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"
                                        )}
                                        title="Full Screen"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className={cn(
                                        "p-3 rounded-full backdrop-blur-md transition-all hover:scale-110",
                                        theme === "dark" ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-black"
                                    )}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 relative z-10">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// === VIBE MAP IMPLEMENTATION ===
export function VibeMapModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <DialModal isOpen={isOpen} onClose={onClose} title="Vibe Map" subtitle="Live Energy Heatmap" theme="dark" fullScreenPath="/vibe-map">
            <VibeMapFeature />
        </DialModal>
    );
}

// === CAPSULE CREATOR ===
export function TimeCapsuleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <DialModal isOpen={isOpen} onClose={onClose} title="Drop a Capsule" subtitle="Send support to the campus ocean" theme="dark" fullScreenPath="/time-capsule">
            <CapsuleCreator onClose={onClose} />
        </DialModal>
    );
}

// === SOS MODAL ===
export function SOSModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <DialModal isOpen={isOpen} onClose={onClose} title="Priority Support" subtitle="Immediate connections." theme="light" fullScreenPath="/sos">
            <SOSFeature />
        </DialModal>
    );
}

// === GHOST MODE ===
export function GhostModeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; onPost?: any }) {
    return (
        <DialModal isOpen={isOpen} onClose={onClose} title="Ghost Mode" subtitle="Encrypted. Anonymous. Safe." theme="dark" fullScreenPath="/ghost-mode">
            <GhostModeFeature onClose={onClose} />
        </DialModal>
    );
}

export function FutureMeModal({ isOpen, onClose }: any) {
    return (
        <DialModal isOpen={isOpen} onClose={onClose} title="Future Me" subtitle="Send a message to your future self." theme="dark" fullScreenPath="/future-me">
            <FutureMeFeature onClose={onClose} />
        </DialModal>
    );
}
