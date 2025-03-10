"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.color = `rgba(${215 + Math.random() * 40}, ${175 + Math.random() * 40}, ${0 + Math.random() * 50}, ${0.1 + Math.random() * 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width

        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    init()
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Set up event listener for the About button
  useEffect(() => {
    // This will be handled by the Header component which contains the About modal
    const handleOpenAbout = () => {
      // This is just a fallback in case the Header component doesn't catch the event
      console.log("About button clicked")
    }

    window.addEventListener("openAboutModal", handleOpenAbout)

    return () => {
      window.removeEventListener("openAboutModal", handleOpenAbout)
    }
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black z-10" />

      <div className="container relative z-20 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-amber-50 mb-6 animate-glow">ديوان الشعر العربي</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
          <p className="text-xl md:text-2xl text-amber-100/80 max-w-3xl mx-auto mb-8 leading-relaxed">
            استكشف روائع الشعر العربي عبر العصور، من المعلقات إلى الشعر المعاصر، في تجربة تفاعلية فريدة
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/poems">
            <Button className="bg-primary/90 hover:bg-primary text-primary-foreground text-lg px-8 py-6 group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                استكشف القصائد
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 transform group-hover:translate-x-1"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </span>
              <span className="absolute inset-0 bg-primary/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-primary/50 text-amber-50 hover:bg-primary/10 hover:text-primary text-lg px-8 py-6"
            onClick={() => {
              // Dispatch a custom event that the Header component will listen for
              const aboutEvent = new CustomEvent("openAboutModal")
              window.dispatchEvent(aboutEvent)
            }}
          >
            عن المشروع
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToContent}
          className="rounded-full border border-amber-50/30 hover:bg-primary/20 hover:border-primary/50"
        >
          <ArrowDown className="h-6 w-6 text-amber-50" />
        </Button>
      </motion.div>
    </div>
  )
}

