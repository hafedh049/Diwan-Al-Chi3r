"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Poem } from "@/types/poem"
import PoemCard from "@/components/poem-card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Eye, Clock, User, X } from "lucide-react"

interface PoemsExplorerProps {
  poems: Poem[]
}

type FilterType = "all" | "eyes" | "era" | "poet"

export default function PoemsExplorer({ poems }: PoemsExplorerProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [selectedEra, setSelectedEra] = useState<string>("all")
  const [selectedPoet, setSelectedPoet] = useState<string>("all")
  const [versesRange, setVersesRange] = useState([0, 20])
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Extract unique eras and poets for filter options
  const eras = Array.from(new Set(poems.map((poem) => poem.era)))
  const poets = Array.from(new Set(poems.map((poem) => poem.poet)))

  // Count poems with eye descriptions
  const eyeDescriptionPoemsCount = poems.filter((poem) => poem.hasEyeDescription).length

  useEffect(() => {
    let result = [...poems]

    // Apply filters
    if (activeFilter === "eyes") {
      result = result.filter((poem) => poem.hasEyeDescription)
    } else if (activeFilter === "era" && selectedEra !== "all") {
      result = result.filter((poem) => poem.era === selectedEra)
    } else if (activeFilter === "poet" && selectedPoet !== "all") {
      result = result.filter((poem) => poem.poet === selectedPoet)
    }

    // Apply verses range filter
    result = result.filter((poem) => {
      const verseCount = poem.verses.length
      return verseCount >= versesRange[0] && verseCount <= versesRange[1]
    })

    setFilteredPoems(result)
  }, [activeFilter, selectedEra, selectedPoet, versesRange, poems])

  const resetFilters = () => {
    setActiveFilter("all")
    setSelectedEra("all")
    setSelectedPoet("all")
    setVersesRange([0, 20])
  }

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-primary"
        >
          Poetry Collection
          <Badge className="ml-2 bg-primary/90 text-primary-foreground">{filteredPoems.length}</Badge>
        </motion.h2>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleFilters}
          className="border-amber-900/30 hover:border-primary/50 hover:bg-black/30"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilter !== "all" && (
            <Badge className="ml-2 bg-primary/90 text-primary-foreground h-5 w-5 p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isFilterOpen ? "auto" : 0,
          opacity: isFilterOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {isFilterOpen && (
          <div className="bg-black/50 backdrop-blur-sm border border-amber-900/20 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-amber-50">Filter Poems</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-amber-50/70 hover:text-amber-50"
                >
                  Reset
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFilters}
                  className="text-amber-50/70 hover:text-amber-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="category" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="category">Category</TabsTrigger>
                <TabsTrigger value="poet">Poet</TabsTrigger>
                <TabsTrigger value="era">Era</TabsTrigger>
                <TabsTrigger value="length">Length</TabsTrigger>
              </TabsList>

              <TabsContent value="category" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant={activeFilter === "all" ? "default" : "outline"}
                    className={activeFilter === "all" ? "bg-primary text-primary-foreground" : "border-amber-900/30"}
                    onClick={() => setActiveFilter("all")}
                  >
                    All Poems
                    <Badge className="ml-2 bg-black/20 text-amber-50">{poems.length}</Badge>
                  </Button>

                  <Button
                    variant={activeFilter === "eyes" ? "default" : "outline"}
                    className={activeFilter === "eyes" ? "bg-primary text-primary-foreground" : "border-amber-900/30"}
                    onClick={() => setActiveFilter("eyes")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Eye Descriptions
                    <Badge className="ml-2 bg-black/20 text-amber-50">{eyeDescriptionPoemsCount}</Badge>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="poet" className="space-y-4">
                <Select
                  value={selectedPoet}
                  onValueChange={(value) => {
                    setSelectedPoet(value)
                    setActiveFilter("poet")
                  }}
                >
                  <SelectTrigger className="bg-black/50 border-amber-900/30">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select a poet" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-amber-900/30">
                    <SelectItem value="all">All Poets</SelectItem>
                    {poets.map((poet) => (
                      <SelectItem key={poet} value={poet}>
                        {poet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>

              <TabsContent value="era" className="space-y-4">
                <Select
                  value={selectedEra}
                  onValueChange={(value) => {
                    setSelectedEra(value)
                    setActiveFilter("era")
                  }}
                >
                  <SelectTrigger className="bg-black/50 border-amber-900/30">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select an era" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-amber-900/30">
                    <SelectItem value="all">All Eras</SelectItem>
                    {eras.map((era) => (
                      <SelectItem key={era} value={era}>
                        {era}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsContent>

              <TabsContent value="length" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-amber-50/70 block mb-2">Number of Verses</label>
                    <Slider
                      defaultValue={[0, 20]}
                      max={20}
                      step={1}
                      value={versesRange}
                      onValueChange={setVersesRange}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-amber-50/50 mt-1">
                      <span>{versesRange[0]} verses</span>
                      <span>{versesRange[1]} verses</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-amber-900/20">
              <div className="flex flex-wrap gap-2">
                {activeFilter === "eyes" && (
                  <Badge className="bg-primary/20 text-primary border border-primary/30 px-3 py-1">
                    Eye Descriptions
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setActiveFilter("all")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {activeFilter === "era" && selectedEra !== "all" && (
                  <Badge className="bg-primary/20 text-primary border border-primary/30 px-3 py-1">
                    Era: {selectedEra}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => {
                        setSelectedEra("all")
                        setActiveFilter("all")
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {activeFilter === "poet" && selectedPoet !== "all" && (
                  <Badge className="bg-primary/20 text-primary border border-primary/30 px-3 py-1">
                    Poet: {selectedPoet}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => {
                        setSelectedPoet("all")
                        setActiveFilter("all")
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}

                {versesRange[0] > 0 || versesRange[1] < 20 ? (
                  <Badge className="bg-primary/20 text-primary border border-primary/30 px-3 py-1">
                    Verses: {versesRange[0]} - {versesRange[1]}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => setVersesRange([0, 20])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {filteredPoems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoems.map((poem, index) => (
            <motion.div
              key={poem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <PoemCard poem={poem} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <p className="text-amber-100/70 text-lg mb-4">No poems match your current filters</p>
          <Button onClick={resetFilters} variant="outline" className="border-amber-900/30 hover:border-primary/50">
            Reset Filters
          </Button>
        </motion.div>
      )}
    </div>
  )
}

