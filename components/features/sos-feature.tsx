"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, Radio, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SOSFeature({ isFullScreen = false }: { isFullScreen?: boolean }) {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    return (
        <div className={cn("h-full pb-8 p-8", isFullScreen ? "bg-white pt-28" : "pt-24")}>
            <AnimatePresence mode="wait">
                {!activeTab ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full"
                    >
                        {[
                            { id: "mentor", title: "Peer Mentor", desc: "Connect with trained students.", icon: Users, color: "bg-blue-50 text-blue-600", btn: "Find Mentor" },
                            { id: "distract", title: "Distraction", desc: "Watch clips, breathe, chill.", icon: Zap, color: "bg-purple-50 text-purple-600", btn: "Open Feed" },
                            { id: "plan", title: "Action Plan", desc: "Get unstuck in 10 mins.", icon: Radio, color: "bg-rose-50 text-rose-600", btn: "Start Plan" },
                        ].map((item, i) => (
                            <div key={i} className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", item.color)}>
                                    <item.icon className="w-8 h-8" strokeWidth={2} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed max-w-[200px] mb-8">{item.desc}</p>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className="mt-auto px-8 py-3 rounded-full bg-gray-900 text-white font-bold text-sm tracking-wide group-hover:scale-105 transition-transform"
                                >
                                    {item.btn}
                                </button>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="h-full flex flex-col bg-white rounded-[2.5rem] border border-gray-100 p-12 text-center items-center justify-center relative"
                    >
                        <button onClick={() => setActiveTab(null)} className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100"><ChevronRight className="w-6 h-6 rotate-180" /></button>

                        {activeTab === "mentor" && (
                            <>
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6"><Users className="w-10 h-10 text-blue-600" /></div>
                                <h3 className="text-3xl font-bold text-gray-900">Finding a Peer...</h3>
                                <p className="text-gray-500 mt-2 max-w-md">We're looking for a peer mentor who matches your vibe. Estimated wait: 2 mins.</p>
                                <div className="mt-8 w-64 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full" />
                                </div>
                            </>
                        )}
                        {activeTab === "distract" && (
                            <>
                                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6"><Zap className="w-10 h-10 text-purple-600" /></div>
                                <h3 className="text-3xl font-bold text-gray-900">Opening Chill Feed...</h3>
                                <p className="text-gray-500 mt-2">Loading calming visuals and satisfying clips.</p>
                            </>
                        )}
                        {activeTab === "plan" && (
                            <>
                                <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6"><Radio className="w-10 h-10 text-rose-600" /></div>
                                <h3 className="text-3xl font-bold text-gray-900">Let's Break It Down</h3>
                                <p className="text-gray-500 mt-2">What is the ONE thing stressing you out right now?</p>
                                <input placeholder="Ex: Math test tomorrow" className="mt-6 w-full max-w-md p-4 bg-gray-50 rounded-xl border-none text-center font-medium" />
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
