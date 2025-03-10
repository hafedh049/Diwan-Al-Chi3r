"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { poems } from "@/data/poems"

export default function PoemsHero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [filteredPoems, setFilteredPoems] = useState<typeof poems>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  // Filter poems based on search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim().length > 1) {
      const results = poems.filter(
        (poem) =>
          poem.title.toLowerCase().includes(query.toLowerCase()) ||
          poem.poet.toLowerCase().includes(query.toLowerCase()) ||
          poem.era.toLowerCase().includes(query.toLowerCase()) ||
          poem.description.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredPoems(results)
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    // Navigate to poems page with search query
    router.push(`/poems?search=${encodeURIComponent(searchQuery)}`)
  }

  // Handle selecting a specific poem
  const handleSelectPoem = (poemId: string) => {
    router.push(`/poems/${poemId}`)
    setShowResults(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showResults && !(event.target as Element).closest("form")) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showResults])

  return (
    <div className="relative py-20 overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 to-black/90 z-0"></div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-amber-50 mb-6 animate-glow">Explore Arabic Poetry</h1>

          <p className="text-lg md:text-xl text-amber-100/80 mb-8 leading-relaxed">
            Discover the beauty and wisdom of Arabic poetry through the ages, from pre-Islamic odes to modern verses
          </p>

          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: isFocused ? "105%" : "100%" }}
            transition={{ duration: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <form
              onSubmit={handleSearch}
              className="relative w-full"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              <Input
                type="text"
                placeholder="ابحث عن قصيدة، شاعر، أو موضوع..."
                className="bg-black/50 border-amber-900/30 focus:border-primary pr-12 py-6 text-lg rounded-full text-right dir-rtl"
                value={searchQuery}
                onChange={handleSearchChange}
                dir="rtl"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-50/50 h-5 w-5" />
              <Button
                type="submit"
                className="absolute left-1 top-1 bottom-1 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full px-6 transition-all duration-300 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  بحث
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="w-4 h-4 flex items-center justify-center"
                  >
                    🔍
                  </motion.div>
                </span>
                <span className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-300"></span>
              </Button>
            </form>
            {showResults && filteredPoems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-2 w-full bg-black/90 border border-amber-900/30 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
              >
                <ul className="py-2 text-right">
                  {filteredPoems.slice(0, 5).map((poem) => (
                    <li
                      key={poem.id}
                      className="px-4 py-3 hover:bg-amber-900/20 cursor-pointer transition-colors"
                      onClick={() => handleSelectPoem(poem.id)}
                    >
                      <div className="font-bold text-amber-50">{poem.title}</div>
                      <div className="text-sm text-amber-200/70 flex justify-between">
                        <span>{poem.era}</span>
                        <span>{poem.poet}</span>
                      </div>
                    </li>
                  ))}
                  {filteredPoems.length > 5 && (
                    <li className="px-4 py-2 text-center text-primary text-sm border-t border-amber-900/20">
                      +{filteredPoems.length - 5} نتائج أخرى
                    </li>
                  )}
                </ul>
              </motion.div>
            )}

            {showResults && filteredPoems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-2 w-full bg-black/90 border border-amber-900/30 rounded-lg shadow-lg z-50 py-4 text-center"
              >
                <p className="text-amber-200/70">لا توجد نتائج مطابقة</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
      ></motion.div>
    </div>
  )
}

