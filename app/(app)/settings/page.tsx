"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Shield, LogOut, ChevronRight, User, CircleUser, Lock, HelpCircle, Moon } from "lucide-react";
import "@/styles/peerconnect.css";

export default function SettingsPage() {
    const router = useRouter();

    return (
        <div className="peerconnect-page min-h-screen bg-[#FAFAF9] pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Settings</h1>
            </div>

            <div className="p-4 space-y-6 max-w-2xl mx-auto mt-4">
                {/* Account Section */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Account</h2>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <Link href="/create-profile" className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <User className="w-5 h-5 text-orange-600" />
                            </div>
                            <span className="flex-1 font-medium text-gray-900">Edit Profile</span>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </Link>
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                <CircleUser className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="flex-1 font-medium text-gray-900 text-left">Account Details</span>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </section>

                {/* Preferences */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">Preferences</h2>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="flex-1 font-medium text-gray-900 text-left">Notifications</span>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="flex-1 font-medium text-gray-900 text-left">Privacy & Security</span>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Moon className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="flex-1 font-medium text-gray-900 text-left">App Appearance</span>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </section>

                {/* Support & Logout */}
                <section>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                        <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                                <HelpCircle className="w-5 h-5 text-teal-600" />
                            </div>
                            <span className="flex-1 font-medium text-gray-900 text-left">Help & Support</span>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </button>
                        <Link href="/login" className="flex items-center gap-4 p-4 hover:bg-red-50 transition-colors group">
                            <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                <LogOut className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="flex-1 font-medium text-red-600">Log Out</span>
                        </Link>
                    </div>
                </section>

                <p className="text-center text-xs text-gray-400 mt-8">
                    ASU4U v1.0.2 • Made with ❤️ at ASU
                </p>
            </div>
        </div>
    );
}
