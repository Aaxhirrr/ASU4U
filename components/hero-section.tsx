"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { AnimatedText } from "./animated-text"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  useEffect(() => {
    let rafId: number
    let currentProgress = 0

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const maxScroll = 400
        const targetProgress = Math.min(scrollY / maxScroll, 1)
        setScrollProgress(targetProgress)
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const handleStart = () => {
    setIsZoomed(true)
    // Faster navigation trigger
    setTimeout(() => {
      router.push("/login")
    }, 600)
  }

  const easeOutQuad = (t: number) => t * (2 - t)
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  const scale = 1 - easeOutQuad(scrollProgress) * 0.15
  const borderRadius = easeOutCubic(scrollProgress) * 48
  const heightVh = 100 - easeOutQuad(scrollProgress) * 37.5

  return (
    <section className="pt-32 pb-12 px-6 min-h-screen flex items-center relative overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 top-0 z-0 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div
          className="w-full overflow-hidden transition-all duration-700 shadow-2xl"
          style={{
            transform: `scale(${isZoomed ? 1.5 : scale})`,
            borderRadius: isZoomed ? "0px" : `${Math.max(borderRadius, 32)}px`,
            height: isZoomed ? "100vh" : `${heightVh * 0.9}vh`,
            filter: isZoomed ? "blur(20px)" : "none",
            opacity: isZoomed ? 0 : 1
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            suppressHydrationWarning
            src="/bg.mp4"
          />
          {/* Readability Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Main Text Content - Hides when zoomed */}
        <div className={`text-center mb-12 transition-all duration-500 ${isZoomed ? "opacity-0 translate-y-[-50px] pointer-events-none" : "opacity-100"}`}>
          <div
            className={`transition-all duration-1000 delay-[800ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <h1 className="font-serif text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] 2xl:text-[8.5rem] font-medium leading-tight mb-6 w-full px-4 max-w-6xl mx-auto text-balance text-white drop-shadow-lg shadow-black/20">
              <AnimatedText text="Find Support, Connection, and Understanding" delay={0.3} />
            </h1>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleStart}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-lg font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Let's get you help</span>
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Phone Container - Zooms to fill screen */}
        <div className="flex flex-col items-center justify-center gap-8 h-[60vh] pointer-events-none">
          <div
            className={`relative z-20 pointer-events-auto transition-all duration-[800ms] ease-in-out ${isZoomed
              ? "scale-[15] translate-y-[20vh]"
              : "scale-100 w-[240px] md:w-[360px] lg:w-[420px]"
              }`}
          >
            {/* Phone Image */}
            <div
              className={`relative w-full h-auto transition-all duration-[1500ms] ease-out delay-500 ${!isZoomed && isVisible ? "opacity-100 translate-y-0" : !isZoomed ? "opacity-0 translate-y-[400px]" : "opacity-100"}`}
            >
              <img src="/images/iphone-frame.png" alt="App Preview" className="w-full h-auto relative z-10 drop-shadow-2xl" />

              {/* Internal Screen Mockup (Behind frame) */}
              <div className="absolute top-[3%] left-[7%] w-[86%] h-[94%] bg-white rounded-[2rem] -z-10 overflow-hidden flex flex-col items-center justify-center transition-colors duration-500">
                <div className="w-full h-full bg-zinc-50 flex items-center justify-center relative">
                  <span className="text-zinc-300 font-serif text-4xl">ASU4U</span>
                  {/* White flash on zoom */}
                  <div className={`absolute inset-0 bg-white transition-opacity duration-700 ${isZoomed ? "opacity-100" : "opacity-0"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
