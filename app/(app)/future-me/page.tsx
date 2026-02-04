"use client";

import { FutureMeFeature } from "@/components/features/future-me-feature";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FutureMePage() {
    const router = useRouter();
    return (
        <div className="h-screen w-full bg-[#0a0a0a] text-white overflow-hidden relative">
            <header className="absolute top-0 left-0 w-full p-4 z-50 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <Link href="/journal" className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md pointer-events-auto transition-colors">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-xl font-bold">Future Audio</h1>
            </header>
            <FutureMeFeature isFullScreen={true} onClose={() => router.push('/journal')} />
        </div>
    );
}
