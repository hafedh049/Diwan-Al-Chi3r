"use client"

import { useRef, useState, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import type { Poem } from "@/types/poem"
import PoemCard from "@/components/poem-card"
import PoemsFilter from "@/components/poems-filter"

interface PoemsGridProps {
  poems: Poem[]
}

export default function PoemsGrid({ poems }: PoemsGridProps) {
  const [activeFilter, setActiveFilter] = useState("all")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const filteredPoems = useMemo(() => {
    if (activeFilter === "eyes") {
      return poems.filter((poem) => poem.hasEyeDescription)
    }
    return poems
  }, [poems, activeFilter])

  const eyeDescriptionPoemsCount = useMemo(() => {
    return poems.filter((poem) => poem.hasEyeDescription).length
  }, [poems])

  return (
    <section ref={ref} className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">استكشف القصائد</h2>
        <div className="h-0.5 w-24 bg-primary/50 mx-auto"></div>
      </motion.div>

      <PoemsFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        totalPoems={poems.length}
        eyeDescriptionPoemsCount={eyeDescriptionPoemsCount}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoems.map((poem, index) => (
          <motion.div
            key={poem.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PoemCard poem={poem} />
          </motion.div>
        ))}
      </div>

      {filteredPoems.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-amber-100/70 text-lg">لا توجد قصائد تطابق المعايير المحددة</p>
        </motion.div>
      )}
    </section>
  )
}

