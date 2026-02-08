"use client"

import { useState, useEffect } from "react"
import { cities as staticCities } from "@/lib/mock-data"

export type City = (typeof staticCities)[number]

export function useCities() {
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      if (!cancelled) {
        setCities(staticCities)
        setLoading(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return { cities, loading }
}
