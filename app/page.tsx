import type { Metadata } from "next"
import Hero from "@/components/hero"
import PoemsGrid from "@/components/poems-grid"
import FeaturedPoem from "@/components/featured-poem"
import { poems } from "@/data/poems"

export const metadata: Metadata = {
  title: "Diwan | Arabic Poetry Collection",
  description: "Explore the beauty of Arabic poetry through an immersive experience",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-amber-50">
      <Hero />
      <div className="container mx-auto px-4 py-16">
        <FeaturedPoem poem={poems[0]} />
        <PoemsGrid poems={poems.slice(1)} />
      </div>
    </main>
  )
}

