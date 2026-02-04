"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, UsersRound, BookOpen, MessageCircle, Compass, Home, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();
    const isDarkMode = pathname.startsWith("/watch");

    const navItems = [
        { href: "/journal", label: "Home", icon: Home },
        { href: "/support", label: "Support", icon: Heart },
        { href: "/watch", label: "Explore", icon: Compass },
        { href: "/messages", label: "Messages", icon: MessageCircle },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <motion.nav
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 border-t h-16 flex items-center justify-around px-4 pb-safe",
                isDarkMode
                    ? "bg-black border-white/10 text-gray-400"
                    : "bg-white border-gray-200 text-gray-500"
            )}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="w-full max-w-md mx-auto flex items-center justify-around">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link href={item.href} key={item.href} className="w-full">
                            <motion.div
                                className={cn(
                                    "flex flex-col items-center gap-1 py-1 rounded-lg transition-colors relative",
                                    isActive
                                        ? (isDarkMode ? "text-[#8C1C46]" : "text-[#8C1C46]")
                                        : "hover:bg-black/5 dark:hover:bg-white/10"
                                )}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Active Indicator Background (Optional, subtle) */}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className={cn(
                                            "absolute inset-0 rounded-lg -z-10",
                                            isDarkMode ? "bg-white/10" : "bg-[#8C1C46]/5"
                                        )}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                                <span className={cn(
                                    "text-[10px] font-medium",
                                    isActive ? "font-bold" : "font-normal"
                                )}>
                                    {item.label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}
