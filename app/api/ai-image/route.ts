import { NextResponse } from "next/server"
import { getAIImageUrl } from "@/lib/aiImageService"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      location,
      weatherCondition,
      temperature,
      aqi,
      context,
      postTheme,
      excludeUrls = [],
    } = body as {
      location?: string
      weatherCondition?: string
      temperature?: number
      aqi?: number
      context?: "weather-banner" | "community-post"
      postTheme?: string
      excludeUrls?: string[]
    }

    const imageUrl = await getAIImageUrl(
      {
        location: location ?? "",
        weatherCondition: weatherCondition ?? "partly cloudy",
        temperature,
        aqi,
        context,
        postTheme,
      },
      Array.isArray(excludeUrls) ? excludeUrls : []
    )

    return NextResponse.json(imageUrl)
  } catch (err) {
    console.error("ai-image error:", err)
    return NextResponse.json(
      {
        imageUrl: "/signin-forest.png",
        error: err instanceof Error ? err.message : "Image request failed",
      },
      { status: 200 }
    )
  }
}
