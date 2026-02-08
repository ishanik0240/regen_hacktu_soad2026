import { NextResponse } from "next/server"

const CACHE = new Map<string, string>()

const KEYWORD_TO_IMAGE: Record<string, string> = {
  "sunny clear sky minimal design": "/signin-forest.png",
  "partly cloudy soft aesthetic sky": "/signin-forest.png",
  "overcast soft grey sky minimal": "/abc.jpg",
  "foggy mist atmospheric soft": "/abc.jpg",
  "light rain atmospheric sky": "/abc.jpg",
  "snow soft winter sky": "/abc.jpg",
  "storm clouds dramatic sky": "/abc.jpg",
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get("keyword")?.trim() || "partly cloudy soft aesthetic sky"

  const cached = CACHE.get(keyword)
  if (cached) {
    return NextResponse.json({ url: cached })
  }

  const url =
    KEYWORD_TO_IMAGE[keyword] ??
    KEYWORD_TO_IMAGE["partly cloudy soft aesthetic sky"] ??
    "/abc.jpg"
  CACHE.set(keyword, url)

  return NextResponse.json({ url })
}
