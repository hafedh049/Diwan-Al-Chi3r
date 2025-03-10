"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Heart, Share2, Bookmark, BookmarkCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Poem, SpeechControl } from "@/types/poem"
import { cn } from "@/lib/utils"
import { speakText, preloadVoices, isSpeechSupported } from "@/lib/text-to-speech"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface FeaturedPoemProps {
  poem: Poem
}

export default function FeaturedPoem({ poem }: FeaturedPoemProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [currentVerse, setCurrentVerse] = useState(0)
  const [isReadingAloud, setIsReadingAloud] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [speechSupported, setSpeechSupported] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const speechControlRef = useRef<SpeechControl | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const verseTimerRef = useRef<NodeJS.Timeout | null>(null)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Check if speech synthesis is supported and preload voices
  useEffect(() => {
    const supported = preloadVoices()
    setSpeechSupported(supported)

    // Check again after a delay to catch any initialization issues
    setTimeout(() => {
      setSpeechSupported(isSpeechSupported())
    }, 2000)
  }, [])

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    // If we're unmuting during playback, start reading the current verse
    if (isPlaying && !newMutedState && speechSupported) {
      if (speechControlRef.current) {
        speechControlRef.current.stop()
      }

      try {
        speechControlRef.current = speakText(poem.verses[currentVerse])
        setIsReadingAloud(true)
        setErrorMessage(null)
      } catch (error) {
        console.error("Failed to start speech:", error)
        setErrorMessage("Could not start text-to-speech")
        setSpeechSupported(false)
      }
    } else if (newMutedState && speechControlRef.current) {
      // If we're muting, stop any ongoing speech
      speechControlRef.current.stop()
      setIsReadingAloud(false)
    }
  }

  const toggleLike = () => setIsLiked(!isLiked)
  const toggleBookmark = () => setIsBookmarked(!isBookmarked)

  const togglePlay = () => {
    if (isPlaying) {
      // Stop playback
      stopPlayback()
    } else {
      // Start playback
      startPlayback()
    }
  }

  const startPlayback = () => {
    setIsPlaying(true)
    setErrorMessage(null)

    // Reset progress
    setPlaybackProgress(0)

    // Start progress animation
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    const verseDuration = 3000 // 3 seconds per verse
    const updateInterval = 30 // Update progress every 30ms
    const steps = verseDuration / updateInterval
    let step = 0

    progressIntervalRef.current = setInterval(() => {
      step++
      setPlaybackProgress((step / steps) * 100)

      if (step >= steps) {
        step = 0
        setPlaybackProgress(0)
      }
    }, updateInterval)

    // If text-to-speech is enabled and not muted, read the current verse
    if (!isMuted && speechSupported) {
      try {
        if (isReadingAloud && speechControlRef.current) {
          speechControlRef.current.stop()
        }

        speechControlRef.current = speakText(poem.verses[currentVerse])
        setIsReadingAloud(true)

        // Check if speech actually started
        setTimeout(() => {
          if (speechControlRef.current && !speechControlRef.current.isSpeaking()) {
            console.warn("Speech didn't start properly")
            // Don't show an error, just continue with visual playback
          }
        }, 500)
      } catch (error) {
        console.error("Speech synthesis error:", error)
        setErrorMessage("Speech synthesis failed")
        setSpeechSupported(false)
      }
    }

    // Set up verse transition timer
    if (verseTimerRef.current) {
      clearTimeout(verseTimerRef.current)
    }

    verseTimerRef.current = setTimeout(() => {
      advanceToNextVerse()
    }, verseDuration)
  }

  const stopPlayback = () => {
    setIsPlaying(false)

    // Clear timers
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    if (verseTimerRef.current) {
      clearTimeout(verseTimerRef.current)
      verseTimerRef.current = null
    }

    // Reset progress
    setPlaybackProgress(0)

    // Stop speech if it's playing
    if (isReadingAloud && speechControlRef.current) {
      speechControlRef.current.stop()
      setIsReadingAloud(false)
    }
  }

  const advanceToNextVerse = () => {
    setCurrentVerse((prev) => {
      const nextVerse = prev >= poem.verses.length - 1 ? 0 : prev + 1

      // If we've reached the end and looped back to the beginning, stop playback
      if (nextVerse === 0) {
        stopPlayback()
        return 0
      }

      // Otherwise, continue playing the next verse
      if (!isMuted && speechSupported) {
        try {
          if (isReadingAloud && speechControlRef.current) {
            speechControlRef.current.stop()
          }

          speechControlRef.current = speakText(poem.verses[nextVerse])
          setIsReadingAloud(true)
        } catch (error) {
          console.error("Speech synthesis error:", error)
          setSpeechSupported(false)
        }
      }

      // Set up the next verse transition
      if (verseTimerRef.current) {
        clearTimeout(verseTimerRef.current)
      }

      verseTimerRef.current = setTimeout(() => {
        advanceToNextVerse()
      }, 3000)

      return nextVerse
    })
  }

  const toggleReadAloud = () => {
    if (!speechSupported) {
      setErrorMessage("Text-to-speech is not supported in your browser")
      return
    }

    if (isReadingAloud) {
      if (speechControlRef.current) {
        speechControlRef.current.stop()
      }
      setIsReadingAloud(false)
      setIsMuted(true)
    } else {
      // Read the current verse
      try {
        speechControlRef.current = speakText(poem.verses[currentVerse])
        setIsReadingAloud(true)
        setIsMuted(false)
        setErrorMessage(null)

        // Check if speech actually started
        setTimeout(() => {
          if (speechControlRef.current && !speechControlRef.current.isSpeaking()) {
            setIsReadingAloud(false)
            setErrorMessage("Speech synthesis failed to start")
          }
        }, 500)
      } catch (error) {
        console.error("Speech synthesis error:", error)
        setErrorMessage("Could not start text-to-speech")
        setSpeechSupported(false)
      }
    }
  }

  const handleShare = () => {
    // Set shared state to provide visual feedback
    setIsShared(true)
    setTimeout(() => setIsShared(false), 2000)

    // Check if Web Share API is supported and we're in a secure context
    if (navigator.share && window.isSecureContext) {
      try {
        navigator
          .share({
            title: `${poem.title} - ${poem.poet}`,
            text: poem.verses.join("\n"),
            url: window.location.href,
          })
          .catch((err) => {
            console.log("User cancelled or share failed:", err)
          })
      } catch (err) {
        console.log("Share API error:", err)
        // Fallback - copy to clipboard instead
        fallbackShare()
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    try {
      // Create a temporary textarea to copy the text
      const textarea = document.createElement("textarea")
      const shareText = `${poem.title} - ${poem.poet}\n\n${poem.verses.join("\n")}`
      textarea.value = shareText
      textarea.style.position = "fixed" // Avoid scrolling to bottom
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)

      // Show a different message for clipboard copy
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Clean up timers and speech when component unmounts
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      if (verseTimerRef.current) {
        clearTimeout(verseTimerRef.current)
      }
      if (speechControlRef.current) {
        speechControlRef.current.stop()
      }
    }
  }, [])

  // Stop text-to-speech when changing verses manually
  useEffect(() => {
    if (isReadingAloud && speechControlRef.current && !isPlaying && speechSupported) {
      speechControlRef.current.stop()
      try {
        speechControlRef.current = speakText(poem.verses[currentVerse])
      } catch (error) {
        console.error("Speech synthesis error:", error)
        setSpeechSupported(false)
      }
    }
  }, [currentVerse, isReadingAloud, poem.verses, isPlaying, speechSupported])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section ref={ref} className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">قصيدة مختارة</h2>
        <div className="h-0.5 w-24 bg-primary/50 mx-auto"></div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-black/50 backdrop-blur-sm border border-amber-900/20 rounded-xl p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-amber-50">{poem.title}</h3>
              <p className="text-amber-200/70">{poem.poet}</p>
              {poem.hasEyeDescription && (
                <Badge className="mt-2 bg-primary/80 text-primary-foreground">وصف العيون</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleBookmark}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isBookmarked ? "text-primary hover:text-primary/80" : "text-amber-50/50 hover:text-amber-50",
                )}
              >
                {isBookmarked ? <BookmarkCheck className="h-5 w-5 fill-primary" /> : <Bookmark className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLike}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isLiked ? "text-red-500 hover:text-red-400" : "text-amber-50/50 hover:text-amber-50",
                )}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} />
              </Button>
            </div>
          </div>

          <div className="relative">
            {/* Error message */}
            {errorMessage && (
              <div className="absolute -top-2 left-0 right-0 bg-amber-900/20 text-amber-200 text-xs py-1 px-2 rounded-md flex items-center justify-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errorMessage}
              </div>
            )}

            {/* Progress bar */}
            {isPlaying && (
              <div className="absolute -top-2 left-0 right-0 h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary" style={{ width: `${playbackProgress}%` }} />
              </div>
            )}

            <div className="min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentVerse}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl md:text-2xl font-amiri leading-relaxed text-amber-50 text-center animate-glow"
                >
                  {poem.verses[currentVerse]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Verse indicator dots */}
            <div className="flex justify-center mt-4 space-x-1">
              {poem.verses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    stopPlayback()
                    setCurrentVerse(index)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentVerse === index ? "bg-primary scale-125" : "bg-amber-50/30 hover:bg-amber-50/50",
                  )}
                  aria-label={`Go to verse ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className={cn("rounded-full hover:bg-amber-900/20", isMuted ? "text-amber-50/50" : "text-primary")}
              aria-label={isMuted ? "Unmute" : "Mute"}
              title={isMuted ? "Unmute" : "Mute"}
              disabled={!speechSupported}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className={cn(
                "rounded-full border-primary/50 hover:bg-primary/20 hover:border-primary relative overflow-hidden",
                isPlaying && "border-primary bg-primary/10",
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-primary relative z-10" />
              ) : (
                <Play className="h-5 w-5 text-primary relative z-10" />
              )}

              {/* Animated background effect when playing */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full hover:bg-amber-900/20"
              aria-label="Share"
              title="Share"
            >
              <Share2 className="h-5 w-5 text-amber-50/70" />
            </Button>
          </div>

          {isShared && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center mt-4 text-xs text-primary"
            >
              {navigator.share && window.isSecureContext ? "Shared successfully!" : "Copied to clipboard!"}
            </motion.div>
          )}

          {/* Visual-only playback notice */}
          {!speechSupported && isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-xs text-amber-200/70"
            >
              Playing in visual mode only (audio unavailable)
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={container} initial="hidden" animate={isInView ? "show" : "hidden"} className="space-y-4">
          <motion.div variants={item}>
            <h3 className="text-xl font-bold text-amber-50 mb-2">About the Poem</h3>
            <p className="text-amber-100/80 leading-relaxed">{poem.description}</p>
          </motion.div>

          <motion.div variants={item} className="pt-4">
            <h3 className="text-xl font-bold text-amber-50 mb-2">About the Poet</h3>
            <p className="text-amber-100/80 leading-relaxed">{poem.poetBio}</p>
          </motion.div>

          <motion.div variants={item} className="pt-4">
            <h3 className="text-xl font-bold text-amber-50 mb-2">Literary Era</h3>
            <p className="text-amber-100/80 leading-relaxed">{poem.era}</p>
          </motion.div>

          <motion.div variants={item}>
            <Link href={`/poems/${poem.id}`}>
              <Button className="mt-4 bg-primary/90 hover:bg-primary text-primary-foreground group relative overflow-hidden transition-all duration-300 px-6 py-2">
                <span className="relative z-10 flex items-center gap-2">
                  Read Full Poem
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
                <span className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

