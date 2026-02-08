import { NextResponse } from "next/server"

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

export type CityResult = {
  id: string
  name: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  admin1?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")?.trim()

  if (!name || name.length < 2) {
    return NextResponse.json(
      { results: [], error: "Search term must be at least 2 characters" },
      { status: 200 }
    )
  }

  try {
    const url = new URL(GEOCODING_URL)
    url.searchParams.set("name", name)
    url.searchParams.set("count", "25")
    url.searchParams.set("language", "en")
    url.searchParams.set("format", "json")

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { results: [], error: "Geocoding service error" },
        { status: 200 }
      )
    }

    const results: CityResult[] = (data.results ?? []).map((r: {
      id: number
      name: string
      country: string
      country_code?: string
      latitude: number
      longitude: number
      admin1?: string
    }) => ({
      id: String(r.id),
      name: r.name,
      country: r.country,
      countryCode: r.country_code ?? "",
      latitude: r.latitude,
      longitude: r.longitude,
      admin1: r.admin1,
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error("search-cities error:", err)
    return NextResponse.json(
      { results: [], error: err instanceof Error ? err.message : "Search failed" },
      { status: 200 }
    )
  }
}
