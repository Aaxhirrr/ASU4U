"use client";

import { SOSFeature } from "@/components/features/sos-feature";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SOSPage() {
    return (
        <div className="h-screen w-full bg-white overflow-hidden relative">
            <header className="absolute top-0 left-0 w-full p-4 z-50 flex items-center gap-4 bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
                <Link href="/journal" className="p-3 rounded-full bg-black/5 hover:bg-black/10 backdrop-blur-md pointer-events-auto transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Priority Support</h1>
            </header>
            <SOSFeature isFullScreen={true} />
        </div>
    );
}
