"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        );
    }

    const isDark = theme === "dark";

    return (
        <motion.button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`
                relative w-14 h-8 rounded-full p-1 transition-colors duration-300
                ${isDark
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                    : "bg-gradient-to-r from-amber-400 to-orange-400"
                }
                shadow-lg hover:shadow-xl
            `}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${isDark ? "bg-slate-900" : "bg-white"}
                    shadow-md
                `}
                animate={{ x: isDark ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {isDark ? (
                    <Moon className="w-4 h-4 text-indigo-300" />
                ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                )}
            </motion.div>

            {/* Stars for dark mode */}
            {isDark && (
                <>
                    <motion.span
                        className="absolute top-1.5 left-2 w-1 h-1 bg-white rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    />
                    <motion.span
                        className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white/70 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    />
                </>
            )}
        </motion.button>
    );
}
