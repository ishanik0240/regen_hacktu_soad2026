"use client"

import { useState, useEffect, useRef } from "react"
import { Cloud, Droplets, MapPin, Wind } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useUsedImages } from "@/contexts/used-images-context"

type AQILevel = "good" | "moderate" | "unhealthy" | "very_unhealthy" | "hazardous"

type WeatherData = {
  city: string
  country: string
  temperature: number
  humidity: number
  condition: string
  weatherKeyword: string
  aqi: number
  aqiLevel: AQILevel
}

const AQI_STYLES: Record<AQILevel, { bg: string; label: string }> = {
  good: { bg: "bg-emerald-500/90", label: "Good" },
  moderate: { bg: "bg-amber-500/90", label: "Moderate" },
  unhealthy: { bg: "bg-orange-500/90", label: "Unhealthy" },
  very_unhealthy: { bg: "bg-red-500/90", label: "Very Unhealthy" },
  hazardous: { bg: "bg-rose-700/90", label: "Hazardous" },
}

const FALLBACK_BG = "/signin-forest.png"

export function WeatherBanner({ cityName }: { cityName?: string }) {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bgUrl, setBgUrl] = useState<string | null>(null)
  const [bgFade, setBgFade] = useState(false)
  const { requestAIImage } = useUsedImages()
  const lastRequestKey = useRef<string>("")
  const bgCacheByKey = useRef<Record<string, string>>({})
  const requestAIImageRef = useRef(requestAIImage)
  requestAIImageRef.current = requestAIImage

  const city = cityName?.trim() || "Patiala"

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Weather unavailable")
        return res.json()
      })
      .then((d) => {
        if (!cancelled) setData(d)
        return d as WeatherData
      })
      .then(async (weather) => {
        if (cancelled || !weather) return
        const key = `${city}|${weather.condition}|${weather.weatherKeyword}`
        if (key === lastRequestKey.current && bgCacheByKey.current[key]) {
          setBgUrl(bgCacheByKey.current[key])
          return
        }
        lastRequestKey.current = key
        setBgFade(false)
        const url = await requestAIImageRef.current({
          location: `${weather.city} ${weather.country}`.trim(),
          weatherCondition: weather.condition,
          temperature: weather.temperature,
          aqi: weather.aqi,
          context: "weather-banner",
        })
        if (cancelled) return
        const finalUrl = url || FALLBACK_BG
        bgCacheByKey.current[key] = finalUrl
        setBgUrl(finalUrl)
        setBgFade(true)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load")
          setBgUrl(FALLBACK_BG)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [city])

  if (loading && !data) {
    return (
      <Card className="overflow-hidden border-0 bg-primary text-primary-foreground">
        <CardContent className="p-5">
          <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
            <span className="h-4 w-4 animate-pulse rounded-full bg-primary-foreground/30" />
            Loading weather…
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !data) {
    return (
      <Card className="overflow-hidden border-0 bg-primary text-primary-foreground">
        <CardContent className="p-5">
          <p className="text-sm text-primary-foreground/80">
            Weather unavailable for {city}. Check your connection.
          </p>
        </CardContent>
      </Card>
    )
  }

  const aqiStyle = data ? AQI_STYLES[data.aqiLevel] : AQI_STYLES.moderate
  const displayLocation = data
    ? `${data.city}${data.country ? `, ${data.country}` : ""}`
    : city

  return (
    <Card className="relative overflow-hidden border-0 bg-primary text-primary-foreground">
      {bgUrl && (
        <>
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-500 ${
              bgFade ? "opacity-40" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${bgUrl.split("?")[0]})`,
            }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-primary/65" aria-hidden />
        </>
      )}
      <CardContent className="relative z-10 p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm text-primary-foreground/70">
              <MapPin className="h-3.5 w-3.5" />
              <span>{displayLocation}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold">
                {data ? Math.round(data.temperature) : "—"}
              </span>
              <span className="text-2xl text-primary-foreground/70">°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-primary-foreground/70">
              <Cloud className="h-4 w-4" />
              <span>{data?.condition ?? "—"}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2">
              <Wind className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs text-primary-foreground/60">AQI</span>
                <span className="font-bold">{data?.aqi ?? "—"}</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${aqiStyle.bg}`}
              >
                {data ? aqiStyle.label : "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2">
              <Droplets className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs text-primary-foreground/60">
                  Humidity
                </span>
                <span className="font-bold">
                  {data?.humidity != null ? `${data.humidity}%` : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-primary-foreground/10 px-3 py-2 text-xs leading-relaxed text-primary-foreground/80">
          {data?.aqiLevel === "good"
            ? "Air quality is good. Great day to get outside and take climate action."
            : data?.aqiLevel === "moderate"
              ? "Moderate AQI — sensitive groups should consider reducing prolonged outdoor activity."
              : "Rising temperatures and air quality are linked to climate change. Consider limiting outdoor exposure when AQI is high."}
        </p>
      </CardContent>
    </Card>
  )
}
