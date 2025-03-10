"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeNavItem, setActiveNavItem] = useState("الرئيسية")
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Listen for the custom event from the Hero component to open the About modal
  useEffect(() => {
    const handleOpenAboutModal = () => {
      setIsAboutOpen(true)
      setActiveNavItem("About")
    }

    window.addEventListener("openAboutModal", handleOpenAboutModal)

    return () => {
      window.removeEventListener("openAboutModal", handleOpenAboutModal)
    }
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      // Focus search input after animation completes
      setTimeout(() => {
        const searchInput = document.getElementById("search-input")
        if (searchInput) searchInput.focus()
      }, 300)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would navigate to search results
    console.log(`Searching for: ${searchQuery}`)
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item)
    setIsMenuOpen(false)
  }

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAboutOpen(true)
    handleNavItemClick("About")
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Poems", href: "/poems" },
    { name: "Poets", href: "/poets" },
    { name: "Eras", href: "/eras" },
    { name: "About", href: "/about" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link href="/" className="text-2xl font-bold text-primary">
            ديوان
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center">
          <div className="flex space-x-1">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="px-1"
              >
                {item.name === "About" ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-md transition-all duration-300 relative flex items-center gap-2 group",
                      activeNavItem === item.name
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-amber-50 hover:bg-black/20 hover:text-primary",
                    )}
                    onClick={handleAboutClick}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      className="w-4 h-4 flex items-center justify-center"
                    >
                      ℹ️
                    </motion.div>
                    <span className="relative">
                      {item.name}
                      <span
                        className={cn(
                          "absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform origin-left transition-transform duration-300",
                          activeNavItem === item.name ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      ></span>
                    </span>
                    {activeNavItem === item.name && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-2"
                        layoutId="activeTab"
                      />
                    )}
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></span>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-0 group-hover:h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-0 group-hover:h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                      </span>
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-md transition-all duration-300 relative flex items-center gap-2 group",
                      activeNavItem === item.name
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-amber-50 hover:bg-black/20 hover:text-primary",
                    )}
                    onClick={() => handleNavItemClick(item.name)}
                  >
                    {/* Icon based on navigation item */}
                    {item.name === "Home" && (
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        ⌂
                      </motion.div>
                    )}
                    {item.name === "Poems" && (
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        📜
                      </motion.div>
                    )}
                    {item.name === "Poets" && (
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        👤
                      </motion.div>
                    )}
                    {item.name === "Eras" && (
                      <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        className="w-4 h-4 flex items-center justify-center"
                      >
                        🕰️
                      </motion.div>
                    )}

                    {/* Text with hover effect */}
                    <span className="relative">
                      {item.name}
                      <span
                        className={cn(
                          "absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform origin-left transition-transform duration-300",
                          activeNavItem === item.name ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      ></span>
                    </span>

                    {/* Active indicator */}
                    {activeNavItem === item.name && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-2"
                        layoutId="activeTab"
                      />
                    )}

                    {/* Hover glow effect */}
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></span>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-0 group-hover:h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-0 group-hover:h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-all duration-700"></span>
                      </span>
                    </span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </nav>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSearch}
            className="text-amber-50 hover:text-primary transition-colors"
          >
            <Search className="h-5 w-5" />
          </motion.button>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6 text-amber-50" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/80 backdrop-blur-md p-4"
          >
            <div className="container mx-auto">
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  id="search-input"
                  placeholder="Search for a poem or poet..."
                  className="flex-1 bg-muted/50 border-primary/50 focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="mr-2 bg-primary/90 hover:bg-primary text-primary-foreground">
                  Search
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleSearch} className="mr-2">
                  <X className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 z-50 md:hidden"
          >
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-6 w-6 text-amber-50" />
              </Button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-2xl font-amiri hover:text-primary transition-colors",
                      activeNavItem === item.name ? "text-primary" : "text-amber-50",
                    )}
                    onClick={() => handleNavItemClick(item.name)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setIsAboutOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 border border-amber-900/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">About Diwan</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAboutOpen(false)}
                  className="text-amber-50/70 hover:text-amber-50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4 text-amber-50/90">
                <p>
                  <span className="text-primary font-bold">Diwan</span> is an immersive platform dedicated to the beauty
                  and richness of Arabic poetry throughout the ages.
                </p>

                <h3 className="text-xl font-bold text-amber-100 mt-4">Our Mission</h3>
                <p>
                  To preserve and celebrate the magnificent tradition of Arabic poetry by creating an interactive
                  digital experience that makes these timeless works accessible to everyone.
                </p>

                <h3 className="text-xl font-bold text-amber-100 mt-4">Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Extensive collection of poems from the pre-Islamic era to modern times</li>
                  <li>Biographical information about renowned poets</li>
                  <li>Audio recitations of selected poems</li>
                  <li>Specialized collections focusing on themes like descriptions of eyes</li>
                  <li>Interactive browsing and searching capabilities</li>
                </ul>

                <h3 className="text-xl font-bold text-amber-100 mt-4">Contact</h3>
                <p>
                  For inquiries, suggestions, or contributions, please contact us at{" "}
                  <span className="text-primary">contact@diwan-poetry.com</span>
                </p>

                <div className="pt-4 border-t border-amber-900/30 mt-6">
                  <p className="text-sm text-amber-50/60 text-center">© 2023 Diwan. All rights reserved.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

