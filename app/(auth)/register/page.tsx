"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shuffle, UserPlus } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import "@/styles/peerconnect.css";

const USERNAME_ADJECTIVES = [
    "Sunny", "Radiant", "Golden", "Swift", "Bold", "Bright", "Clever", "Daring",
    "Eager", "Fierce", "Gentle", "Happy", "Jazzy", "Keen", "Lively", "Merry",
    "Noble", "Proud", "Quick", "Serene", "Vibrant", "Wise", "Zesty", "Cosmic"
];

const USERNAME_NOUNS = [
    "Devil", "Sunburst", "Phoenix", "Cactus", "Scholar", "Pioneer", "Trailblazer",
    "Explorer", "Innovator", "Champion", "Achiever", "Dreamer", "Creator", "Builder",
    "Seeker", "Voyager", "Maverick", "Spark", "Star", "Force", "Spirit"
];

function generateRandomUsername(): string {
    const adj = USERNAME_ADJECTIVES[Math.floor(Math.random() * USERNAME_ADJECTIVES.length)];
    const noun = USERNAME_NOUNS[Math.floor(Math.random() * USERNAME_NOUNS.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    return `${adj}${noun}${num}`;
}

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState(generateRandomUsername());
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const randomizeUsername = () => {
        setUsername(generateRandomUsername());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || username.length < 3) {
            alert("Username must be at least 3 characters");
            return;
        }

        if (!password || password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!email || !email.toLowerCase().endsWith("@asu.edu")) {
            alert("Must use an ASU email address (@asu.edu)");
            return;
        }

        setIsRegistering(true);
        setTimeout(() => {
            router.push("/create-profile");
        }, 500);
    };

    return (
        <div className="peerconnect-page min-h-screen flex items-center justify-center p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, hsl(340 66% 33% / 0.1) 0%, hsl(40 30% 96%) 50%, hsl(45 100% 58% / 0.1) 100%)' }}>
            {/* Animated Background Orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
                style={{ background: 'hsl(45 100% 58% / 0.4)', top: '-10%', right: '-10%' }}
                animate={{
                    x: [0, -50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
                style={{ background: 'hsl(340 66% 33% / 0.3)', bottom: '-5%', left: '-5%' }}
                animate={{
                    x: [0, 40, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 11,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="peerconnect-user-card w-full max-w-md relative z-10"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div
                    className="text-center p-6 pb-2 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <motion.div
                        className="flex justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <Image src="/assets/peerconnect-logo.png" alt="PeerConnect" width={80} height={80} className="h-20 w-20" />
                    </motion.div>
                    <motion.h1
                        className="text-2xl font-bold"
                        style={{ color: 'hsl(340 66% 33%)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                    >
                        Create Account
                    </motion.h1>
                    <motion.p
                        className="text-sm"
                        style={{ color: 'hsl(340 10% 45%)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        Join the ASU PeerConnect community
                    </motion.p>
                </motion.div>

                <motion.div
                    className="p-6 pt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            <label htmlFor="username" className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Username</label>
                            <div className="flex gap-2">
                                <motion.input
                                    id="username"
                                    data-testid="input-register-username"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    className="peerconnect-search flex-1 pl-3"
                                    whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                />
                                <motion.button
                                    type="button"
                                    onClick={randomizeUsername}
                                    data-testid="button-randomize-username"
                                    title="Generate random username"
                                    className="px-3 py-2 rounded-md border hover:bg-gray-50"
                                    style={{ borderColor: 'hsl(40 15% 80%)' }}
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Shuffle className="h-4 w-4" style={{ color: 'hsl(340 10% 45%)' }} />
                                </motion.button>
                            </div>
                            <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>Min 3 characters</p>
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                        >
                            <label htmlFor="password" className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Password</label>
                            <div className="relative">
                                <motion.input
                                    id="password"
                                    data-testid="input-register-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="peerconnect-search w-full pl-3 pr-10"
                                    whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                />
                                <motion.button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ color: 'hsl(340 10% 45%)' }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </motion.button>
                            </div>
                            <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>Min 6 characters</p>
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.65, duration: 0.4 }}
                        >
                            <label htmlFor="confirm-password" className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>Confirm Password</label>
                            <motion.input
                                id="confirm-password"
                                data-testid="input-register-confirm-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                className="peerconnect-search w-full pl-3"
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                            />
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                        >
                            <label htmlFor="email" className="text-sm font-medium" style={{ color: 'hsl(340 20% 15%)' }}>
                                Email <span style={{ color: 'hsl(0 72% 48%)' }}>*</span>
                            </label>
                            <motion.input
                                id="email"
                                data-testid="input-register-email"
                                type="email"
                                required
                                placeholder="your.email@asu.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="peerconnect-search w-full pl-3"
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                            />
                            <p className="text-xs" style={{ color: 'hsl(340 10% 45%)' }}>Must be an ASU email address (@asu.edu)</p>
                        </motion.div>

                        <motion.button
                            type="submit"
                            data-testid="button-register-submit"
                            className="peerconnect-befriend-btn w-full justify-center py-2.5"
                            disabled={isRegistering}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75, duration: 0.4 }}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px hsl(340 66% 33% / 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isRegistering ? "Creating account..." : (
                                <>
                                    <UserPlus className="h-4 w-4" />
                                    Create Account
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.div
                        className="mt-6 text-center text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                    >
                        <span style={{ color: 'hsl(340 10% 45%)' }}>Already have an account? </span>
                        <motion.button
                            className="font-medium hover:underline"
                            style={{ color: 'hsl(340 66% 33%)' }}
                            onClick={() => router.push("/login")}
                            data-testid="link-to-login"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign in
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
