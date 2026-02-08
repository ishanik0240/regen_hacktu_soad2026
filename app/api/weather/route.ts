import { NextResponse } from "next/server"

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast"
const AIR_QUALITY_URL = "https://air-quality.api.open-meteo.com/v1/air-quality"

const WEATHER_CODE_MAP: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Foggy",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Rain showers",
  82: "Heavy rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
}

function getWeatherLabel(code: number): string {
  if (code in WEATHER_CODE_MAP) return WEATHER_CODE_MAP[code]
  if (code >= 0 && code <= 3) return "Clear to cloudy"
  if (code >= 45 && code <= 48) return "Foggy"
  if (code >= 51 && code <= 67) return "Rain"
  if (code >= 71 && code <= 77) return "Snow"
  if (code >= 80 && code <= 82) return "Rain showers"
  if (code >= 95 && code <= 99) return "Thunderstorm"
  return "Partly cloudy"
}

function getWeatherKeyword(code: number): string {
  if (code === 0 || code === 1) return "sunny clear sky minimal design"
  if (code === 2) return "partly cloudy soft aesthetic sky"
  if (code === 3) return "overcast soft grey sky minimal"
  if (code >= 45 && code <= 48) return "foggy mist atmospheric soft"
  if (code >= 51 && code <= 82) return "light rain atmospheric sky"
  if (code >= 71 && code <= 77) return "snow soft winter sky"
  if (code >= 95 && code <= 99) return "storm clouds dramatic sky"
  return "partly cloudy soft aesthetic sky"
}

export type AQILevel = "good" | "moderate" | "unhealthy" | "very_unhealthy" | "hazardous"

function aqiLevel(aqi: number): AQILevel {
  if (aqi <= 50) return "good"
  if (aqi <= 100) return "moderate"
  if (aqi <= 150) return "unhealthy"
  if (aqi <= 200) return "very_unhealthy"
  return "hazardous"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")?.trim()

  if (!city) {
    return NextResponse.json(
      { error: "City name is required" },
      { status: 400 }
    )
  }

  try {
    const geoRes = await fetch(
      `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1&format=json`
    )
    const geoData = await geoRes.json()
    const first = geoData.results?.[0]
    if (!first) {
      return NextResponse.json(
        { error: "City not found" },
        { status: 404 }
      )
    }
    const { latitude, longitude } = first

    const [weatherRes, aqRes] = await Promise.all([
      fetch(
        `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&format=json`
      ),
      fetch(
        `${AIR_QUALITY_URL}?latitude=${latitude}&longitude=${longitude}&current=us_aqi&format=json`
      ).catch(() => null),
    ])

    const weatherData = await weatherRes.json()
    const current = weatherData.current
    if (!current) {
      return NextResponse.json(
        { error: "Weather data unavailable" },
        { status: 502 }
      )
    }

    let aqi = 0
    let aqiLevelName: AQILevel = "moderate"
    if (aqRes?.ok) {
      const aqData = await aqRes.json()
      aqi = aqData.current?.us_aqi ?? 0
      aqiLevelName = aqiLevel(aqi)
    }

    const weatherCode = current.weather_code ?? 2
    const condition = getWeatherLabel(weatherCode)
    const keyword = getWeatherKeyword(weatherCode)

    return NextResponse.json({
      city: first.name,
      country: first.country,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      condition,
      weatherCode,
      weatherKeyword: keyword,
      aqi,
      aqiLevel: aqiLevelName,
    })
  } catch (err) {
    console.error("weather api error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Weather fetch failed" },
      { status: 500 }
    )
  }
}
