"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Eye, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PoemsFilterProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  totalPoems: number
  eyeDescriptionPoemsCount: number
}

export default function PoemsFilter({
  activeFilter,
  onFilterChange,
  totalPoems,
  eyeDescriptionPoemsCount,
}: PoemsFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleFilter = () => setIsOpen(!isOpen)

  const handleFilterClick = (filter: string) => {
    onFilterChange(filter)
    setIsOpen(false)
  }

  return (
    <div className="relative mb-8">
      <div className="flex justify-between items-center">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-amber-50"
        >
          القصائد
          <Badge className="mr-2 bg-primary/90 text-primary-foreground">
            {activeFilter === "eyes" ? eyeDescriptionPoemsCount : totalPoems}
          </Badge>
        </motion.h3>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleFilter}
          className="border-amber-900/30 hover:border-primary/50 hover:bg-black/30"
        >
          {activeFilter === "eyes" ? <Eye className="h-4 w-4 ml-2" /> : <Filter className="h-4 w-4 ml-2" />}
          فلترة
        </Button>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-md border border-amber-900/20 rounded-md shadow-lg overflow-hidden z-10"
      >
        {isOpen && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-amber-50 font-bold">فلترة القصائد</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFilter}
                className="text-amber-50/70 hover:text-amber-50 -mt-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant={activeFilter === "all" ? "default" : "ghost"}
                className={
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground w-full justify-start"
                    : "text-amber-50 w-full justify-start"
                }
                onClick={() => handleFilterClick("all")}
              >
                كل القصائد
                <Badge className="mr-2 bg-black/20 text-amber-50">{totalPoems}</Badge>
              </Button>

              <Button
                variant={activeFilter === "eyes" ? "default" : "ghost"}
                className={
                  activeFilter === "eyes"
                    ? "bg-primary text-primary-foreground w-full justify-start"
                    : "text-amber-50 w-full justify-start"
                }
                onClick={() => handleFilterClick("eyes")}
              >
                <Eye className="h-4 w-4 ml-2" />
                وصف العيون
                <Badge className="mr-2 bg-black/20 text-amber-50">{eyeDescriptionPoemsCount}</Badge>
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

