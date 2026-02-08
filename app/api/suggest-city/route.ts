import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "")

export type CityOption = { id: string; name: string; country: string }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      cities,
      context,
      latitude,
      longitude,
    }: {
      cities: CityOption[]
      context?: string
      latitude?: number
      longitude?: number
    } = body

    if (!cities?.length) {
      return NextResponse.json(
        { error: "cities array is required" },
        { status: 400 }
      )
    }

    const cityList = cities.map((c) => `${c.name}, ${c.country}`).join("\n")
    const locationHint =
      latitude != null && longitude != null
        ? `The user's approximate coordinates are latitude ${latitude}, longitude ${longitude}. Prefer the city from the list that is closest or most relevant to this location.`
        : ""
    const userHint = context?.trim()
      ? `User preference or context: "${context}". Choose the city from the list that best matches.`
      : ""

    const prompt = `You are a city picker for a climate-action app. Choose exactly ONE city from the following list. Reply with only the city name (e.g. "Patiala" or "Mumbai"), nothing else.

Available cities (name, country):
${cityList}
${locationHint}
${userHint}

If no strong preference or location is given, pick a sensible default from the list. Reply with only the city name, no quotes or explanation.`

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(prompt)
    const text = result.response.text()?.trim() ?? ""

    const chosen = cities.find(
      (c) =>
        c.name.toLowerCase() === text.toLowerCase() ||
        text.toLowerCase().includes(c.name.toLowerCase())
    )
    const cityName = chosen?.name ?? cities[0].name

    return NextResponse.json({ city: cityName })
  } catch (err) {
    console.error("suggest-city error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to suggest city" },
      { status: 500 }
    )
  }
}
