"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Heart, Share2, ExternalLink, Volume2, VolumeX, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Poem, SpeechControl } from "@/types/poem"
import { cn } from "@/lib/utils"
import { speakText } from "@/lib/text-to-speech"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PoemCardProps {
  poem: Poem
}

export default function PoemCard({ poem }: PoemCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isReadingAloud, setIsReadingAloud] = useState(false)
  const speechControlRef = useRef<SpeechControl | null>(null)
  const [isShared, setIsShared] = useState(false)

  const toggleLike = () => setIsLiked(!isLiked)
  const toggleBookmark = () => setIsBookmarked(!isBookmarked)

  const toggleReadAloud = () => {
    if (isReadingAloud) {
      if (speechControlRef.current) {
        speechControlRef.current.stop()
      }
      setIsReadingAloud(false)
    } else {
      // Read the excerpt
      speechControlRef.current = speakText(poem.excerpt)
      setIsReadingAloud(true)

      // Listen for end of speech
      const checkIfSpeaking = setInterval(() => {
        if (speechControlRef.current && !speechControlRef.current.isSpeaking()) {
          setIsReadingAloud(false)
          clearInterval(checkIfSpeaking)
        }
      }, 500)
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
            text: poem.excerpt,
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
      const shareText = `${poem.title} - ${poem.poet}\n\n${poem.excerpt}`
      textarea.value = shareText
      textarea.style.position = "fixed" // Avoid scrolling to bottom
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border-amber-900/20 hover:border-amber-900/40 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-amber-50">{poem.title}</h3>
              <p className="text-amber-200/70 text-sm">{poem.poet}</p>
              {poem.hasEyeDescription && (
                <Badge className="mt-2 bg-primary/80 text-primary-foreground">وصف العيون</Badge>
              )}
            </div>
            <div className="flex">
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

          <div className="relative overflow-hidden">
            <p className="text-lg font-amiri leading-relaxed text-amber-50/90 line-clamp-4">{poem.excerpt}</p>

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="absolute bottom-0 left-0 right-0 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/poems/${poem.id}`}>
                <Button variant="link" className="text-primary hover:text-primary/80">
                  قراءة المزيد
                  <ExternalLink className="h-4 w-4 mr-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 border-t border-amber-900/20 flex justify-between">
          <div className="text-sm text-amber-100/60">{poem.era}</div>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleReadAloud}
              className={cn("rounded-full text-amber-50/70 hover:text-amber-50", isReadingAloud && "text-primary")}
              aria-label={isReadingAloud ? "إيقاف القراءة" : "قراءة بصوت عالٍ"}
              title={isReadingAloud ? "إيقاف القراءة" : "قراءة بصوت عالٍ"}
            >
              {isReadingAloud ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
              className={cn("rounded-full text-amber-50/70 hover:text-amber-50", isBookmarked && "text-primary")}
              aria-label={isBookmarked ? "إزالة من المحفوظات" : "حفظ القصيدة"}
              title={isBookmarked ? "إزالة من المحفوظات" : "حفظ القصيدة"}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-primary")} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full text-amber-50/70 hover:text-amber-50"
              aria-label="مشاركة"
              title="مشاركة"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          {isShared && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 text-center mb-1 text-xs text-primary"
            >
              {navigator.share && window.isSecureContext ? "تمت المشاركة!" : "تم نسخ النص إلى الحافظة!"}
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

