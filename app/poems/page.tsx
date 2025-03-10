import type { Metadata } from "next"
import PoemsHero from "@/components/poems-hero"
import PoemsExplorer from "@/components/poems-explorer"
import { poems } from "@/data/poems"

export const metadata: Metadata = {
  title: "Explore Poems | Diwan",
  description: "Browse our collection of Arabic poetry from various eras and poets",
}

export default function PoemsPage() {
  return (
    <main className="min-h-screen bg-black text-amber-50 pt-20">
      <PoemsHero />
      <div className="container mx-auto px-4 py-16">
        <PoemsExplorer poems={poems} />
      </div>
    </main>
  )
}

