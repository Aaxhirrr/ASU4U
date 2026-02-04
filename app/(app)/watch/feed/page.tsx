"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Music2, UserPlus, Play, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/peerconnect.css";

// Placeholder data for 5 feed items
import { VIDEOS } from "@/lib/data/mock-videos";

export default function WatchFeedPage() {
    const searchParams = useSearchParams();
    const initialIndex = Number(searchParams?.get("index")) || 0;

    const [isMuted, setIsMuted] = useState(false);
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [hasLoaded, setHasLoaded] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        // Scroll to initial video on load
        if (initialIndex > 0 && videoRefs.current[initialIndex] && !hasLoaded) {
            const element = videoRefs.current[initialIndex]?.closest('.video-container');
            if (element) {
                element.scrollIntoView({ behavior: 'auto' });
            }
            setActiveIndex(initialIndex);
            setHasLoaded(true);
        }
    }, [initialIndex, hasLoaded]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6 // Video must be 60% visible to be "active"
        };

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.getAttribute('data-index'));
                    setActiveIndex(index);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        // Observe all video containers
        document.querySelectorAll('.video-container').forEach((el) => {
            observer.observe(el);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    // Effect to handle Play/Pause based on active index
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (!video) return;

            if (index === activeIndex) {
                video.play().catch(() => { }); // Play active video
            } else {
                video.pause(); // Pause others
                video.currentTime = 0; // Optional: Reset non-active videos
            }
        });
    }, [activeIndex]);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    return (
        <div className="h-[100dvh] w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide">

            {/* Back Button */}
            <Link href="/watch" className="fixed top-6 left-4 z-50 p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
                <ArrowLeft className="w-6 h-6" />
            </Link>

            {VIDEOS.map((item, i) => (
                <div
                    key={item.id}
                    data-index={i}
                    className="video-container h-[100dvh] w-full snap-start relative flex items-center justify-center bg-black"
                >
                    {/* Fallback Placeholder (shows if video missing) */}
                    <div
                        className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-9xl uppercase overflow-hidden -z-10"
                        style={{ backgroundColor: item.color }}
                    >
                        {i + 1}
                    </div>

                    {/* Video Content */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black">
                        <video
                            ref={el => { videoRefs.current[i] = el; }}
                            src={item.videoSrc}
                            className="w-full h-full object-contain pointer-events-auto max-h-[100dvh] bg-black"
                            loop
                            muted={isMuted}
                            playsInline
                            onClick={toggleMute}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Sound Toggle (Top Right) */}
                    <button
                        onClick={toggleMute}
                        className="absolute top-6 right-4 z-50 p-2 bg-black/20 backdrop-blur-md rounded-full text-white"
                    >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>

                    {/* Right Action Bar */}
                    <div className="absolute right-2 bottom-20 flex flex-col items-center gap-6 z-20">
                        <div className="relative group cursor-pointer">
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-tr from-purple-500 to-orange-500" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#8C1C46] rounded-full p-0.5">
                                <UserPlus className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <Heart className="w-8 h-8 text-white fill-white/80" />
                            </div>
                            <span className="text-white text-xs font-bold drop-shadow-md">{(item.likes / 1000).toFixed(1)}k</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <MessageCircle className="w-8 h-8 text-white fill-white/80" />
                            </div>
                            <span className="text-white text-xs font-bold drop-shadow-md">{item.comments}</span>
                        </div>

                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                            <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                <Share2 className="w-8 h-8 text-white fill-white/80" />
                            </div>
                            <span className="text-white text-xs font-bold drop-shadow-md">{item.shares}</span>
                        </div>

                        <div className="cursor-pointer">
                            <MoreHorizontal className="w-8 h-8 text-white/80" />
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 z-10 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="max-w-[400px] mx-auto w-full md:max-w-[500px]">
                            <h3 className="text-white font-bold text-lg mb-2 shadow-black drop-shadow-md">{item.user}</h3>
                            <p className="text-white/90 text-sm mb-4 leading-relaxed line-clamp-2">{item.description}</p>
                            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                                <Music2 className="w-4 h-4 animate-spin-slow" />
                                <div className="w-32 overflow-hidden whitespace-nowrap">
                                    <div className="animate-marquee">{item.song}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
