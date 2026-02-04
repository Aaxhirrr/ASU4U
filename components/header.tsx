"use client"

import type React from "react"
import { useState } from "react"
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const isScrolled = true

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)

    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      setIsOpen(false)
    }
  }

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "px-4 pt-4" : ""}`}>
      <div
        className={`max-w-7xl mx-auto transition-all duration-300 rounded-2xl ${isScrolled
          ? "bg-white/70 backdrop-blur-xl border border-zinc-200 px-6 py-3"
          : "bg-background/90 backdrop-blur-md px-6 py-5"
          }`}
      >
        <div className="flex items-center justify-between">
          <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${isScrolled ? "bg-[#8C1C46]" : "bg-foreground"}`}>
              <svg className="w-4 h-4 text-[#FFC627]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 2h2v18h-2zM8 5l4-3 4 3v3H8zM6 5v4h2V6.5L6 5zM16 5v4h2V6.5L18 5z" />
              </svg>
            </div>
            <span
              className={`text-xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? "text-[#8C1C46]" : "text-foreground"}`}
            >
              ASU<span className="text-[#FFC627]">4</span>U
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#mission"
              onClick={(e) => handleSmoothScroll(e, "mission")}
              className={`text-sm transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Mission
            </a>
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "features")}
              className={`text-sm transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Features
            </a>
            <a
              href="#support"
              onClick={(e) => handleSmoothScroll(e, "support")}
              className={`text-sm transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Find Support
            </a>
            <a
              href="#stories"
              onClick={(e) => handleSmoothScroll(e, "stories")}
              className={`text-sm transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Stories
            </a>
            <a
              href="#faq"
              onClick={(e) => handleSmoothScroll(e, "faq")}
              className={`text-sm transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-1">
            <a
              href="/journal"
              className={`relative flex items-center gap-0 border rounded-full pl-5 pr-1 py-1 transition-all duration-300 group overflow-hidden ${isScrolled ? "border-zinc-300" : "border-border"
                }`}
            >
              <span
                className={`absolute inset-0 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ${isScrolled ? "bg-black" : "bg-foreground"
                  }`}
              />
              <span
                className={`text-sm pr-3 relative z-10 transition-colors duration-300 ${isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                  }`}
              >
                Get Matched
              </span>
              <span className="w-8 h-8 rounded-full flex items-center justify-center relative z-10">
                <ArrowRight
                  className={`w-4 h-4 group-hover:opacity-0 absolute transition-opacity duration-300 ${isScrolled ? "text-black" : "text-foreground"
                    }`}
                />
                <ArrowUpRight
                  className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                    }`}
                />
              </span>
            </a>
          </div>

          <button
            className={`md:hidden transition-colors duration-300 ${isScrolled ? "text-black" : "text-foreground"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav
            className={`md:hidden mt-6 pb-6 flex flex-col gap-4 border-t pt-6 ${isScrolled ? "border-zinc-200" : "border-border"
              }`}
          >
            <a
              href="#mission"
              onClick={(e) => handleSmoothScroll(e, "mission")}
              className={`transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Mission
            </a>
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "features")}
              className={`transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Features
            </a>
            <a
              href="#support"
              onClick={(e) => handleSmoothScroll(e, "support")}
              className={`transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Find Support
            </a>
            <a
              href="#stories"
              onClick={(e) => handleSmoothScroll(e, "stories")}
              className={`transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Stories
            </a>
            <a
              href="#faq"
              onClick={(e) => handleSmoothScroll(e, "faq")}
              className={`transition-colors cursor-pointer ${isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              FAQ
            </a>
            <div
              className={`flex flex-col gap-3 mt-4 pt-4 border-t ${isScrolled ? "border-zinc-200" : "border-border"}`}
            >
              <a href="/journal" className={isScrolled ? "text-black" : "text-foreground"}>
                Login
              </a>
              <a
                href="/journal"
                className={`relative flex items-center gap-0 border rounded-full pl-5 pr-1 py-1 w-fit transition-all duration-300 group overflow-hidden ${isScrolled ? "border-zinc-300" : "border-border"
                  }`}
              >
                <span
                  className={`absolute inset-0 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ${isScrolled ? "bg-black" : "bg-foreground"
                    }`}
                />
                <span
                  className={`text-sm pr-3 relative z-10 transition-colors duration-300 ${isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                    }`}
                >
                  Get Matched
                </span>
                <span className="w-8 h-8 rounded-full flex items-center justify-center relative z-10">
                  <ArrowRight
                    className={`w-4 h-4 group-hover:opacity-0 absolute transition-opacity duration-300 ${isScrolled ? "text-black" : "text-foreground"
                      }`}
                  />
                  <ArrowUpRight
                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                      }`}
                  />
                </span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
