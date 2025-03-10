// Track if speech synthesis is available and working
let speechSynthesisAvailable = true
let lastErrorTime = 0
let errorCount = 0

export function speakText(text: string, lang = "ar-SA"): SpeechControl {
  // If we've had multiple errors in a short time, mark speech as unavailable
  if (errorCount > 3 && Date.now() - lastErrorTime < 10000) {
    speechSynthesisAvailable = false
    console.warn("Speech synthesis disabled due to multiple errors")
    return createDummySpeechControl()
  }

  // Check if speech synthesis is available
  if (!window.speechSynthesis || !speechSynthesisAvailable) {
    console.warn("Speech synthesis not available")
    return createDummySpeechControl()
  }

  // Stop any ongoing speech
  try {
    window.speechSynthesis.cancel()
  } catch (e) {
    console.error("Error canceling previous speech:", e)
    return createDummySpeechControl()
  }

  // Create a new utterance with error handling
  let utterance: SpeechSynthesisUtterance
  try {
    utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1.0
  } catch (e) {
    console.error("Error creating speech utterance:", e)
    recordError()
    return createDummySpeechControl()
  }

  // Try to find an appropriate voice
  try {
    const voices = window.speechSynthesis.getVoices()

    // First try to find an Arabic voice
    let voice = voices.find((v) => v.lang.includes("ar"))

    // If no Arabic voice, try to find any voice for the specified language
    if (!voice) {
      voice = voices.find((v) => v.lang.includes(lang.split("-")[0]))
    }

    // If still no voice, just use the default voice
    if (voice) {
      utterance.voice = voice
    }
  } catch (e) {
    console.warn("Error setting voice:", e)
    // Continue without setting a specific voice
  }

  // Set up event handlers
  utterance.onstart = () => {
    console.log("Speech started")
  }

  utterance.onend = () => {
    console.log("Speech ended normally")
  }

  utterance.onerror = (event) => {
    console.error("Speech error:", event)
    recordError()

    // Try to recover by canceling any ongoing speech
    try {
      window.speechSynthesis.cancel()
    } catch (e) {
      console.error("Error during recovery:", e)
    }
  }

  // Use a timeout to ensure the speech synthesis is ready
  let speakTimeout: number | null = null
  let isSpeaking = false

  try {
    speakTimeout = window.setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance)
        isSpeaking = true
      } catch (e) {
        console.error("Error starting speech:", e)
        recordError()
      }
    }, 100)
  } catch (e) {
    console.error("Error setting up speech timeout:", e)
    recordError()
    return createDummySpeechControl()
  }

  // Create and return the speech control object
  return {
    stop: () => {
      if (speakTimeout) {
        window.clearTimeout(speakTimeout)
        speakTimeout = null
      }

      try {
        window.speechSynthesis.cancel()
        isSpeaking = false
      } catch (e) {
        console.error("Error stopping speech:", e)
      }
    },
    pause: () => {
      try {
        window.speechSynthesis.pause()
      } catch (e) {
        console.error("Error pausing speech:", e)
      }
    },
    resume: () => {
      try {
        window.speechSynthesis.resume()
      } catch (e) {
        console.error("Error resuming speech:", e)
      }
    },
    isPaused: () => {
      try {
        return window.speechSynthesis.paused
      } catch (e) {
        console.error("Error checking pause state:", e)
        return false
      }
    },
    isSpeaking: () => {
      try {
        return isSpeaking && window.speechSynthesis.speaking
      } catch (e) {
        console.error("Error checking speaking state:", e)
        return false
      }
    },
  }
}

// Helper function to record errors
function recordError() {
  errorCount++
  lastErrorTime = Date.now()

  // Reset error count after 30 seconds
  setTimeout(() => {
    errorCount--
  }, 30000)
}

// Create a dummy speech control when speech synthesis is unavailable
function createDummySpeechControl(): SpeechControl {
  return {
    stop: () => {},
    pause: () => {},
    resume: () => {},
    isPaused: () => false,
    isSpeaking: () => false,
  }
}

export function preloadVoices(): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    speechSynthesisAvailable = false
    return false
  }

  try {
    // Try to get voices
    const voices = window.speechSynthesis.getVoices()

    // Set up voice changed event handler
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices()
        console.log("Voices loaded:", updatedVoices.length)
      }
    }

    // Test speech synthesis with a silent utterance
    const testUtterance = new SpeechSynthesisUtterance("")
    testUtterance.volume = 0
    testUtterance.onend = () => {
      console.log("Test speech completed successfully")
      speechSynthesisAvailable = true
    }
    testUtterance.onerror = (e) => {
      console.warn("Speech synthesis test failed:", e)
      speechSynthesisAvailable = false
    }

    window.speechSynthesis.speak(testUtterance)
    window.speechSynthesis.cancel()

    return true
  } catch (e) {
    console.error("Error during voice preloading:", e)
    speechSynthesisAvailable = false
    return false
  }
}

// Check if speech synthesis is supported
export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis && speechSynthesisAvailable
}

// Interface for speech control
export interface SpeechControl {
  stop: () => void
  pause: () => void
  resume: () => void
  isPaused: () => boolean
  isSpeaking: () => boolean
}

