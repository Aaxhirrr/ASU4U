"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, MessageCircle, Settings, Edit, Users, UsersRound, BookOpen, User } from "lucide-react";
import "@/styles/peerconnect.css";

// Mock user data
const MOCK_USERS: Record<string, {
    id: string;
    name: string;
    username: string;
    major: string;
    year: string;
    age: number;
    description: string;
    interests: string[];
    courses: string[];
    profilePhoto: string;
}> = {
    "1": {
        id: "1",
        name: "Alex Chen",
        username: "AlexChen123",
        major: "Computer Science",
        year: "Junior",
        age: 21,
        description: "International student from China. Love coding and finding my community here at ASU. Looking for friends who understand the challenges of being far from home!",
        interests: ["Programming", "Gaming", "Basketball", "Photography"],
        courses: ["CSE 340", "CSE 310", "MAT 343"],
        profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    "2": {
        id: "2",
        name: "Maria Garcia",
        username: "MariaG456",
        major: "Psychology",
        year: "Senior",
        age: 22,
        description: "First-gen college student from rural Arizona. Passionate about mental health advocacy and helping others navigate the college experience.",
        interests: ["Mental Health", "Reading", "Hiking", "Volunteering"],
        courses: ["PSY 290", "PSY 314", "SOC 101"],
        profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    "3": {
        id: "3",
        name: "James Wilson",
        username: "JamesW789",
        major: "Business Administration",
        year: "Sophomore",
        age: 20,
        description: "Out-of-state student from New York. Still adjusting to the Arizona heat! Looking to meet people and explore what ASU has to offer.",
        interests: ["Entrepreneurship", "Sports", "Music", "Networking"],
        courses: ["WPC 301", "ECN 211", "MGT 300"],
        profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
};

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const user = MOCK_USERS[userId];
    const isOwnProfile = userId === "current";

    if (!user && !isOwnProfile) {
        return (
            <div className="peerconnect-page min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
                <div className="peerconnect-user-card max-w-sm text-center p-6">
                    <h2 className="text-xl font-semibold mb-2" style={{ color: 'hsl(340 20% 15%)' }}>User not found</h2>
                    <p className="mb-4" style={{ color: 'hsl(340 10% 45%)' }}>This profile doesn't exist.</p>
                    <button className="peerconnect-befriend-btn" onClick={() => router.back()}>Go back</button>
                </div>
            </div>
        );
    }

    const displayUser = user || {
        id: "current",
        name: "Aashir",
        username: "AashirJ",
        major: "Computer Science",
        year: "Sophomore",
        age: 20,
        description: "CS student at ASU, building cool stuff 🚀",
        interests: ["Coding", "AI", "Hackathons"],
        courses: ["CSE 110", "CSE 205"],
        profilePhoto: "/images/user-pfp.jpg",
    };

    return (
        <div className="peerconnect-page min-h-screen" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
            <div className="pb-20 md:pt-4 md:pb-8">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-gray-100"
                            data-testid="button-back-profile"
                        >
                            <ArrowLeft className="h-5 w-5" style={{ color: 'hsl(340 10% 45%)' }} />
                        </button>
                        <h1 className="text-xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Profile</h1>
                        {isOwnProfile && (
                            <button className="ml-auto h-10 w-10 rounded-lg flex items-center justify-center border" style={{ borderColor: 'hsl(40 15% 80%)' }} data-testid="button-settings">
                                <Settings className="h-5 w-5" style={{ color: 'hsl(340 10% 45%)' }} />
                            </button>
                        )}
                    </div>

                    <div className="peerconnect-user-card">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="peerconnect-avatar w-28 h-28 text-3xl">
                                        {displayUser.profilePhoto ? (
                                            <img src={displayUser.profilePhoto} alt={displayUser.name} />
                                        ) : (
                                            displayUser.name?.charAt(0) || "?"
                                        )}
                                    </div>
                                    {isOwnProfile ? (
                                        <button className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border" style={{ borderColor: 'hsl(40 15% 80%)', color: 'hsl(340 10% 45%)' }} data-testid="button-edit-profile">
                                            <Edit className="h-4 w-4" />
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <Link href={`/messages`}>
                                            <button className="peerconnect-befriend-btn mt-4" data-testid="button-message">
                                                <MessageCircle className="h-4 w-4" />
                                                Message
                                            </button>
                                        </Link>
                                    )}
                                </div>

                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div>
                                        <h2 className="text-2xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>{displayUser.name || "Anonymous"}</h2>
                                        <p style={{ color: 'hsl(340 10% 45%)' }}>@{displayUser.username}</p>
                                    </div>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        <span className="peerconnect-badge flex items-center gap-1">
                                            <GraduationCap className="h-3 w-3" />
                                            {displayUser.major}
                                        </span>
                                        <span className="peerconnect-badge-outline">{displayUser.year}</span>
                                        {displayUser.age > 0 && <span className="peerconnect-badge-outline">{displayUser.age} years old</span>}
                                    </div>

                                    {displayUser.description && (
                                        <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>{displayUser.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {displayUser.interests && displayUser.interests.length > 0 && (
                        <div className="peerconnect-user-card mt-4">
                            <div className="p-4">
                                <h3 className="font-semibold mb-3" style={{ color: 'hsl(340 20% 15%)' }}>Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {displayUser.interests.map((interest, idx) => (
                                        <span key={idx} className="peerconnect-badge">{interest}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {displayUser.courses && displayUser.courses.length > 0 && (
                        <div className="peerconnect-user-card mt-4">
                            <div className="p-4">
                                <h3 className="font-semibold mb-3" style={{ color: 'hsl(340 20% 15%)' }}>Current Courses</h3>
                                <div className="flex flex-wrap gap-2">
                                    {displayUser.courses.map((course, idx) => (
                                        <span key={idx} className="peerconnect-badge-outline">{course}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="peerconnect-nav fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-around h-16">
                        <Link href="/match" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <Users className="h-5 w-5" />
                            <span className="text-xs">Match</span>
                        </Link>
                        <Link href="/groups" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <UsersRound className="h-5 w-5" />
                            <span className="text-xs">Groups</span>
                        </Link>
                        <Link href="/journal" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <BookOpen className="h-5 w-5" />
                            <span className="text-xs">Journal</span>
                        </Link>
                        <Link href="/messages" className="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ color: 'hsl(340 10% 45%)' }}>
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-xs">Messages</span>
                        </Link>
                        <Link href="/profile/current" className="nav-item active flex flex-col items-center gap-1 py-2 px-4 rounded-lg" style={{ backgroundColor: 'hsl(40 20% 94%)', color: 'hsl(340 66% 33%)' }}>
                            <User className="h-5 w-5" />
                            <span className="text-xs sr-only md:not-sr-only">Profile</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}
