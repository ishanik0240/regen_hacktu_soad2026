"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Mail,
  Search,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  cities as featuredCities,
  cityPosts,
  communityPosts,
  authorities,
  educationResources,
} from "@/lib/mock-data"
import { CommunityScreen } from "@/components/community-screen"
import { cn } from "@/lib/utils"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

type ApiCity = {
  id: string
  name: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  admin1?: string
}

function CityCard({
  city,
  onClick,
  subtitle,
}: {
  city: { id: string; name: string; country: string; admin1?: string }
  onClick: () => void
  subtitle?: string
}) {
  return (
    <Card
      className="cursor-pointer border-primary/15 bg-primary/[0.06] transition-all hover:border-primary/30 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Globe className="h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{city.name}</h3>
              <span className="text-sm text-muted-foreground">
                {city.country}
              </span>
            </div>
            {(city.admin1 || subtitle) && (
              <span className="text-xs text-muted-foreground">
                {city.admin1 || subtitle}
              </span>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}

function ImpactComparison() {
  const chartData = featuredCities.map((city) => ({
    name: city.name,
    users: city.activeUsers,
    issues: city.issues,
  }))

  const barColors = [
    "hsl(158, 64%, 32%)",
    "hsl(40, 96%, 53%)",
    "hsl(200, 60%, 45%)",
    "hsl(340, 65%, 55%)",
  ]

  return (
    <Card>
      <CardHeader className="px-5 pb-2 pt-5">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          Impact Comparison by City
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-5 pt-2">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(150, 12%, 88%)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="users" name="Active Users" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Active users across cities contributing to climate action
        </p>
      </CardContent>
    </Card>
  )
}

function AuthoritiesSection() {
  const [selectedCity, setSelectedCity] = useState("Patiala")
  const cityAuthorities =
    authorities.find((a) => a.city === selectedCity)?.authorities || []

  return (
    <Card>
      <CardHeader className="px-5 pb-2 pt-5">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Phone className="h-4 w-4" />
          Environmental Authorities
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-5 pb-5">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {authorities.map((a) => (
            <option key={a.city} value={a.city}>
              {a.city}
            </option>
          ))}
        </select>
        {cityAuthorities.map((auth) => (
          <div
            key={auth.name}
            className="flex flex-col gap-1.5 rounded-lg bg-secondary p-3"
          >
            <h4 className="text-sm font-semibold text-foreground">
              {auth.name}
            </h4>
            <p className="text-xs text-muted-foreground">{auth.purpose}</p>
            <div className="flex flex-col gap-1">
              <a
                href={`tel:${auth.phone}`}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Phone className="h-3 w-3" />
                {auth.phone}
              </a>
              <a
                href={`mailto:${auth.email}`}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Mail className="h-3 w-3" />
                {auth.email}
              </a>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function EducationSection() {
  const [filter, setFilter] = useState<string>("all")

  const filtered =
    filter === "all"
      ? educationResources
      : educationResources.filter((r) => r.category === filter)

  return (
    <Card className="border-primary/15 bg-primary/[0.06]">
      <CardHeader className="px-5 pb-2 pt-5">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          Climate Education Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 px-5 pb-5">
        <div className="flex gap-2">
          {["all", "basics", "reports", "action"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        {filtered.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 rounded-lg border border-primary/15 bg-primary/[0.06] p-3 transition-all hover:bg-primary/10"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                {resource.title}
              </h4>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </div>
            <p className="text-xs text-primary">{resource.source}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {resource.description}
            </p>
          </a>
        ))}
      </CardContent>
    </Card>
  )
}

export function ExploreScreen({
  onPointsEarned,
  defaultCity,
}: {
  onPointsEarned: (amount: number, action: string) => void
  defaultCity?: string
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ApiCity[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const fetchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setSearching(true)
    try {
      const res = await fetch(
        `/api/search-cities?name=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setSearchResults(data.results ?? [])
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchCities(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery, fetchCities])

  if (selectedCity) {
    const posts =
      cityPosts[selectedCity] ||
      (selectedCity === "Patiala" ? communityPosts : [])

    return (
      <div className="flex flex-col gap-4 pb-24">
        <div className="flex items-center gap-3 px-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCity(null)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Go back</span>
          </Button>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            <h1 className="text-lg font-bold text-foreground">
              {selectedCity}
            </h1>
          </div>
        </div>
        <CommunityScreen
          posts={posts.length > 0 ? posts : communityPosts}
          cityName={selectedCity}
          onPointsEarned={onPointsEarned}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-4">
      <h1 className="text-xl font-bold text-foreground">Explore</h1>
      {defaultCity && (
        <p className="text-sm text-muted-foreground">
          Your location: <span className="font-medium text-foreground">{defaultCity}</span>
        </p>
      )}

      {/* Search any city via API */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search any city worldwide..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Search results from API */}
      <div className="flex flex-col gap-3">
        {searchQuery.trim().length >= 2 && (
          <>
            {searching ? (
              <p className="text-sm text-muted-foreground">Searching…</p>
            ) : searchResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No cities found. Try a different search.
              </p>
            ) : (
              searchResults.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  onClick={() => setSelectedCity(city.name)}
                />
              ))
            )}
          </>
        )}
        {searchQuery.trim().length < 2 && (
          <p className="text-sm text-muted-foreground">
            Type at least 2 characters to search cities worldwide.
          </p>
        )}
      </div>

      {/* Impact chart (featured cities from mock) */}
      <ImpactComparison />

      {/* Education */}
      <EducationSection />

      {/* Authorities */}
      <AuthoritiesSection />
    </div>
  )
}
