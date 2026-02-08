"use client"

import { useState, useEffect, useCallback } from "react"
import { Leaf, Loader2, MapPin, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ApiCity = {
  id: string
  name: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  admin1?: string
}

export function LocationStep({
  onComplete,
  onSkip,
}: {
  onComplete: (cityName: string) => void
  onSkip: () => void
}) {
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<ApiCity[]>([])
  const [searching, setSearching] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/search-cities?name=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setSearchResults(data.results ?? [])
      if (data.error) setError(data.error)
    } catch (e) {
      setSearchResults([])
      setError("Search failed. Try again.")
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchCities(search), 300)
    return () => clearTimeout(t)
  }, [search, fetchCities])

  async function handleAutoDetect() {
    setError(null)
    setDetecting(true)
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"))
          return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 300000,
        })
      })
      const { latitude, longitude } = pos.coords
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      const data = await res.json()
      const locality =
        data?.city ?? data?.locality ?? data?.principalSubdivision ?? ""
      if (locality) {
        onComplete(locality)
      } else {
        setError("Could not detect city. Search for your city below.")
      }
    } catch (e) {
      setError("Could not detect location. Search for your city below.")
    } finally {
      setDetecting(false)
    }
  }

  async function handleGeminiSuggest() {
    setError(null)
    setSuggesting(true)
    try {
      const citiesToUse =
        searchResults.length > 0
          ? searchResults.map((c) => ({ id: c.id, name: c.name, country: c.country }))
          : (await (async () => {
              const res = await fetch("/api/search-cities?name=city")
              const data = await res.json()
              return (data.results ?? []).slice(0, 15).map((c: ApiCity) => ({
                id: c.id,
                name: c.name,
                country: c.country,
              }))
            })())

      const body: {
        cities: { id: string; name: string; country: string }[]
        context?: string
        latitude?: number
        longitude?: number
      } = { cities: citiesToUse }
      if (search.trim()) body.context = search.trim()
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 300000,
            })
          })
          body.latitude = pos.coords.latitude
          body.longitude = pos.coords.longitude
        } catch {
          // ignore
        }
      }
      const res = await fetch("/api/suggest-city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      const cityName = data.city
      if (cityName) {
        onComplete(cityName)
      } else {
        setError("Could not get AI suggestion. Try searching for a city.")
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not get AI suggestion. Try searching for a city."
      )
    } finally {
      setSuggesting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-between bg-primary px-6 py-12 text-primary-foreground">
      <div className="flex items-center gap-2 pt-8">
        <Leaf className="h-8 w-8" />
        <span className="text-2xl font-bold tracking-tight">ReGen</span>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-foreground/15">
            <MapPin className="h-12 w-12" />
          </div>
          <h2 className="text-balance text-2xl font-bold leading-tight">
            Set your location
          </h2>
          <p className="max-w-xs text-balance leading-relaxed text-primary-foreground/80">
            Search any city worldwide. We use this for local weather and community content.
          </p>
        </div>

        <Card className="border-0 bg-primary-foreground/10 text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Choose location</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAutoDetect}
              disabled={detecting}
              className="w-full gap-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
            >
              {detecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              {detecting ? "Detecting…" : "Use current location"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleGeminiSuggest}
              disabled={suggesting}
              className="w-full gap-2 bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
            >
              {suggesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {suggesting ? "Choosing city…" : "Pick city with Gemini AI"}
            </Button>
            {error && (
              <p className="text-xs text-primary-foreground/80">{error}</p>
            )}
            <div className="space-y-2">
              <Label className="text-primary-foreground/90">
                Search any city worldwide
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="e.g. Patiala, Tokyo, London"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background text-foreground"
                />
              </div>
            </div>
            {search.trim().length >= 2 && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-background">
                {searching ? (
                  <p className="p-3 text-sm text-muted-foreground">Searching…</p>
                ) : searchResults.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">
                    No cities found. Try a different search.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {searchResults.map((city) => (
                      <li key={city.id}>
                        <button
                          type="button"
                          onClick={() => onComplete(city.name)}
                          className="w-full px-3 py-2.5 text-left text-sm text-foreground hover:bg-secondary"
                        >
                          {city.name}
                          {city.admin1 ? `, ${city.admin1}` : ""} · {city.country}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onSkip}
        className="text-primary-foreground/70 hover:text-primary-foreground"
      >
        Skip for now
      </Button>
    </div>
  )
}
