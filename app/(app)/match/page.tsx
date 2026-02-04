"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, UsersRound, BookOpen, MessageCircle, User, UserPlus, Check, Search } from "lucide-react";
import { motion } from "framer-motion";
import "@/styles/peerconnect.css";
import { BottomNav } from "@/components/bottom-nav";

// Mock users data - EXACTLY matching teammate's screenshot
const MOCK_USERS = [
    {
        id: "1",
        name: "Alex Chen",
        major: "Computer Science",
        year: "Junior",
        description: "International student from China. Love coding and finding my community here at ASU. Looking for friends who understand the challenges of bein...",
        interests: ["Programming", "Gaming", "Basketball"],
        profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
        id: "2",
        name: "Maria Garcia",
        major: "Psychology",
        year: "Senior",
        description: "First-gen college student from rural Arizona. Passionate about mental health advocacy and helping others navigate the college experience.",
        interests: ["Mental Health", "Reading", "Hiking"],
        profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    {
        id: "3",
        name: "James Wilson",
        major: "Business Administration",
        year: "Sophomore",
        description: "Out-of-state student from New York. Still adjusting to the Arizona heat! Looking to meet people and explore what ASU has to offer.",
        interests: ["Entrepreneurship", "Sports", "Music"],
        profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
        id: "4",
        name: "Priya Sharma",
        major: "Engineering",
        year: "Graduate",
        description: "International grad student from India. Research focus on sustainable energy. Love meeting diverse people and sharing cultural experiences.",
        interests: ["Research", "Sustainability", "Dance"],
        profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
        id: "5",
        name: "Marcus Johnson",
        major: "Communications",
        year: "Junior",
        description: "First-gen student and proud. Balancing school, work, and family.",
        interests: ["Photography", "Writing", "Community"],
        profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

export default function MatchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [friends, setFriends] = useState<string[]>([]);

    const filteredUsers = MOCK_USERS.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.interests?.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleBefriend = (userId: string) => {
        setFriends(prev => [...prev, userId]);
    };

    return (
        <div className="peerconnect-page min-h-screen" style={{ backgroundColor: 'hsl(40 30% 96%)' }}>
            <div className="pb-20 md:pt-4 md:pb-8">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    {/* Header */}
                    <motion.div
                        className="flex items-center gap-3 mb-4"
                        variants={headerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="peerconnect-header-icon"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Users className="h-5 w-5" style={{ color: 'hsl(340 66% 33%)' }} />
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: 'hsl(340 20% 15%)' }}>Find Your People</h1>
                            <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>Connect with peers who understand your journey</p>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        className="relative mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(340 10% 45%)' }} />
                        <motion.input
                            type="text"
                            placeholder="Search by name, major, or interests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="peerconnect-search w-full"
                            data-testid="input-search-match"
                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                        />
                    </motion.div>

                    {/* User Cards */}
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredUsers.map((user, index) => {
                            const isFriend = friends.includes(user.id);
                            return (
                                <motion.div
                                    key={user.id}
                                    className="peerconnect-user-card p-4"
                                    variants={itemVariants}
                                    whileHover={{
                                        y: -4,
                                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                                        transition: { duration: 0.2 }
                                    }}
                                    layout
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <Link href={`/profile/${user.id}`}>
                                            <motion.div
                                                className="peerconnect-avatar cursor-pointer"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {user.profilePhoto ? (
                                                    <img src={user.profilePhoto} alt={user.name} />
                                                ) : (
                                                    <span>{user.name?.charAt(0) || "?"}</span>
                                                )}
                                            </motion.div>
                                        </Link>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <Link href={`/profile/${user.id}`}>
                                                        <motion.h3
                                                            className="font-semibold cursor-pointer hover:underline"
                                                            style={{ color: 'hsl(340 20% 15%)' }}
                                                            data-testid={`user-name-${user.id}`}
                                                            whileHover={{ color: 'hsl(340 66% 33%)' }}
                                                        >
                                                            {user.name}
                                                        </motion.h3>
                                                    </Link>
                                                    <p className="text-sm" style={{ color: 'hsl(340 10% 45%)' }}>
                                                        {user.major} • {user.year}
                                                    </p>
                                                </div>

                                                {/* Befriend Button */}
                                                {isFriend ? (
                                                    <motion.button
                                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md"
                                                        style={{ backgroundColor: 'hsl(40 20% 94%)', color: 'hsl(340 10% 45%)' }}
                                                        disabled
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                        Friends
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        className="peerconnect-befriend-btn"
                                                        onClick={() => handleBefriend(user.id)}
                                                        data-testid={`befriend-${user.id}`}
                                                        whileHover={{ scale: 1.05, boxShadow: "0 4px 15px hsl(340 66% 33% / 0.3)" }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                        Befriend
                                                    </motion.button>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-sm mt-2 line-clamp-2" style={{ color: 'hsl(340 10% 45%)' }}>
                                                {user.description}
                                            </p>

                                            {/* Interest Badges */}
                                            {user.interests && user.interests.length > 0 && (
                                                <motion.div
                                                    className="flex flex-wrap gap-2 mt-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 + index * 0.1 }}
                                                >
                                                    {user.interests.slice(0, 3).map((interest, idx) => (
                                                        <motion.span
                                                            key={idx}
                                                            className="peerconnect-badge"
                                                            whileHover={{ scale: 1.1, y: -2 }}
                                                            transition={{ type: "spring", stiffness: 400 }}
                                                        >
                                                            {interest}
                                                        </motion.span>
                                                    ))}
                                                    {user.interests.length > 3 && (
                                                        <span className="peerconnect-badge-outline">
                                                            +{user.interests.length - 3}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
