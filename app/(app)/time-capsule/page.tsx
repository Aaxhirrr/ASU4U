"use client";

import { CapsuleCreator } from "@/components/features/time-capsule-feature";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TimeCapsulePage() {
    const router = useRouter();
    return (
        <div className="h-screen w-full bg-white overflow-hidden relative">
            <header className="absolute top-0 left-0 w-full p-4 z-50 flex items-center gap-4 bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
                <Link href="/journal" className="p-3 rounded-full bg-black/5 hover:bg-black/10 backdrop-blur-md pointer-events-auto transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-900" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Time Capsule</h1>
            </header>
            <div className="pt-20 h-full">
                <CapsuleCreator onClose={() => router.push('/journal')} />
            </div>
        </div>
    );
}
