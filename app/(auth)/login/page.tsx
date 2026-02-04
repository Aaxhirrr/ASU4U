"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import "@/styles/peerconnect.css";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            return;
        }

        // Hardcoded credentials
        if (username === "AashirJ" && password === "Aashir123") {
            setIsLoggingIn(true);
            setTimeout(() => {
                router.push("/journal");
            }, 500);
        } else {
            alert("Invalid credentials. Use AashirJ / Aashir123");
        }
    };

    return (
        <div className="peerconnect-page min-h-screen flex items-center justify-center p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, hsl(340 66% 33% / 0.1) 0%, hsl(40 30% 96%) 50%, hsl(45 100% 58% / 0.1) 100%)' }}>
            {/* Animated Background Orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
                style={{ background: 'hsl(340 66% 33% / 0.3)', top: '-10%', left: '-10%' }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
                style={{ background: 'hsl(45 100% 58% / 0.4)', bottom: '-5%', right: '-5%' }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-15"
                style={{ background: 'hsl(340 66% 50% / 0.3)', top: '50%', right: '20%' }}
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, -30, 20, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Login Card */}
            <motion.div
                className="peerconnect-user-card w-full max-w-md relative z-10"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1] // Custom spring-like easing
                }}
            >
                <motion.div
                    className="text-center p-6 pb-2 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <motion.div
                        className="flex justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
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
                        Welcome Back
                    </motion.h1>
                    <motion.p
                        className="text-sm"
                        style={{ color: 'hsl(340 10% 45%)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        Sign in to your PeerConnect account
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
                            <motion.input
                                id="username"
                                data-testid="input-login-username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                className="peerconnect-search w-full pl-3"
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                transition={{ duration: 0.2 }}
                            />
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
                                    data-testid="input-login-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="peerconnect-search w-full pl-3 pr-10"
                                    whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px hsl(340 66% 33% / 0.1)" }}
                                    transition={{ duration: 0.2 }}
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
                        </motion.div>

                        <motion.button
                            type="submit"
                            data-testid="button-login-submit"
                            className="peerconnect-befriend-btn w-full justify-center py-2.5"
                            disabled={isLoggingIn}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 25px hsl(340 66% 33% / 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoggingIn ? (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Signing in...
                                </motion.span>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    <motion.div
                        className="mt-6 text-center text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                    >
                        <span style={{ color: 'hsl(340 10% 45%)' }}>Don't have an account? </span>
                        <motion.button
                            className="font-medium hover:underline"
                            style={{ color: 'hsl(340 66% 33%)' }}
                            onClick={() => router.push("/register")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign up
                        </motion.button>
                    </motion.div>

                    {/* Subtle Professional Login Options */}
                    <motion.div
                        className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-4 text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                    >
                        <button
                            className="text-gray-400 hover:text-[#8C1C46] transition-colors font-medium"
                            onClick={() => alert("Redirecting to Therapist Portal...")}
                        >
                            Log in as Licensed Therapist
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            className="text-gray-400 hover:text-[#FFC627] transition-colors font-medium"
                            onClick={() => alert("Redirecting to Peer Listener Portal...")}
                        >
                            Log in as Peer Listener
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
