"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

const USED_IMAGES_KEY = "regen_used_image_urls"
const MAX_STORED = 100

type AIImageParams = {
  location: string
  weatherCondition: string
  temperature?: number
  aqi?: number
  context?: "weather-banner" | "community-post"
  postTheme?: string
}

interface UsedImagesContextValue {
  usedImages: Set<string>
  addUsedImage: (url: string) => void
  requestAIImage: (params: AIImageParams) => Promise<string | null>
  clearUsedImages: () => void
}

const UsedImagesContext = createContext<UsedImagesContextValue | null>(null)

function loadFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(USED_IMAGES_KEY)
    const arr = raw ? (JSON.parse(raw) as string[]) : []
    return new Set(arr.slice(-MAX_STORED))
  } catch {
    return new Set()
  }
}

function saveToStorage(set: Set<string>) {
  if (typeof window === "undefined") return
  try {
    // Only persist non–data URLs to avoid huge base64 strings in localStorage
    const arr = Array.from(set)
      .filter((url) => !url.startsWith("data:"))
      .slice(-MAX_STORED)
    localStorage.setItem(USED_IMAGES_KEY, JSON.stringify(arr))
  } catch {
    // ignore
  }
}

export function UsedImagesProvider({ children }: { children: ReactNode }) {
  const [usedImages, setUsedImages] = useState<Set<string>>(loadFromStorage)

  const addUsedImage = useCallback((url: string) => {
    setUsedImages((prev) => {
      const next = new Set(prev)
      next.add(url)
      saveToStorage(next)
      return next
    })
  }, [])

  const requestAIImage = useCallback(
    async (params: AIImageParams): Promise<string | null> => {
      const excludeUrls = Array.from(usedImages)
      const maxRetries = 3
      for (let i = 0; i < maxRetries; i++) {
        try {
          const res = await fetch("/api/ai-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: params.location,
              weatherCondition: params.weatherCondition,
              temperature: params.temperature,
              aqi: params.aqi,
              context: params.context,
              postTheme: params.postTheme,
              excludeUrls,
            }),
          })
          const data = await res.json()
          const url = data?.imageUrl
          if (url && typeof url === "string") {
            setUsedImages((prev) => {
              const next = new Set(prev)
              next.add(url)
              saveToStorage(next)
              return next
            })
            return url
          }
        } catch (e) {
          if (i === maxRetries - 1) return null
        }
      }
      return null
    },
    [usedImages]
  )

  const clearUsedImages = useCallback(() => {
    setUsedImages(new Set())
    saveToStorage(new Set())
  }, [])

  const value = useMemo(
    () => ({
      usedImages,
      addUsedImage,
      requestAIImage,
      clearUsedImages,
    }),
    [usedImages, addUsedImage, requestAIImage, clearUsedImages]
  )

  return (
    <UsedImagesContext.Provider value={value}>
      {children}
    </UsedImagesContext.Provider>
  )
}

export function useUsedImages() {
  const ctx = useContext(UsedImagesContext)
  if (!ctx) {
    return {
      usedImages: new Set<string>(),
      addUsedImage: () => {},
      requestAIImage: async () => null as string | null,
      clearUsedImages: () => {},
    }
  }
  return ctx
}
