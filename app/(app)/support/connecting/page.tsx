"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function ConnectingPage() {
    const router = useRouter();
    const [status, setStatus] = useState("Connecting to secure server...");

    useEffect(() => {
        const timers = [
            setTimeout(() => setStatus("Verifying student eligibility..."), 1500),
            setTimeout(() => setStatus("Matching with available counselor..."), 3000),
            setTimeout(() => setStatus("Establishing secure line..."), 4500),
            // In a real app, this would eventually connect or show a number
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="min-h-[100dvh] bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center space-y-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center relative"
            >
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                <Phone className="w-10 h-10 text-blue-400" />
            </motion.div>

            <div className="space-y-4 max-w-md">
                <h1 className="text-2xl font-bold tracking-tight">
                    Connecting you with a counselor
                </h1>
                <p className="text-white/60 text-lg animate-pulse">
                    {status}
                </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-sm w-full">
                <p className="text-sm text-white/40 mb-2">Estimated wait time</p>
                <p className="text-xl font-bold text-white">~2 minutes</p>
            </div>

            <button
                onClick={() => router.back()}
                className="mt-8 text-sm text-white/40 hover:text-white transition-colors"
            >
                Cancel request
            </button>
        </div>
    );
}
