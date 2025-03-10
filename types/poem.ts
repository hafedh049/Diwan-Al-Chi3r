export interface Poem {
  id: string
  title: string
  poet: string
  era: string
  verses: string[]
  excerpt: string
  description: string
  poetBio: string
  hasEyeDescription?: boolean
}

export interface SpeechControl {
  stop: () => void
  pause: () => void
  resume: () => void
  isPaused: () => boolean
  isSpeaking: () => boolean
}

