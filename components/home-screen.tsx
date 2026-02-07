"use client"

import Image from "next/image"
import {
  Cloud,
  Droplets,
  MapPin,
  Thermometer,
  Wind,
  ChevronRight,
  TreePine,
  Lightbulb,
  ArrowUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { climateFacts, communityPosts } from "@/lib/mock-data"
import { useState, useMemo } from "react"

function WeatherCard() {
  return (
    <Card className="relative border-0 overflow-hidden">
      {/* Background banner image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <CardContent className="relative z-10 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              <span>Patiala, Punjab</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold">28</span>
              <span className="text-2xl text-white/80">°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <Cloud className="h-4 w-4" />
              <span>Partly Cloudy</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <Wind className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs text-white/70">AQI</span>
                <span className="font-bold">156</span>
              </div>
              <span className="rounded-full bg-accent/90 px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                Moderate
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 backdrop-blur-sm">
              <Droplets className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs text-white/70">Humidity</span>
                <span className="font-bold">62%</span>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 rounded-lg bg-white/15 px-3 py-2 text-xs leading-relaxed text-white/90 backdrop-blur-sm">
          Rising temperatures and deteriorating air quality are direct indicators of climate change. Moderate AQI means sensitive groups should reduce outdoor activity.
        </p>
      </CardContent>
    </Card>
  )
}

function GoalsSummaryCard({
  completedGoals,
  totalGoals,
}: {
  completedGoals: number
  totalGoals: number
}) {
  const percentage = Math.round((completedGoals / totalGoals) * 100)

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-medium text-muted-foreground">
              {"Today's Goals"}
            </h3>
            <p className="text-2xl font-bold text-foreground">
              {completedGoals}/{totalGoals}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Thermometer className="h-7 w-7 text-primary" />
          </div>
        </div>
        <Progress value={percentage} className="mt-3 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          {percentage > 0
            ? `Great progress! ${percentage}% completed today.`
            : "Start your first goal to make an impact today!"}
        </p>
      </CardContent>
    </Card>
  )
}

function DidYouKnowCard() {
  const fact = useMemo(
    () => climateFacts[Math.floor(Math.random() * climateFacts.length)],
    []
  )

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-start gap-3 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground">Did You Know?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{fact}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function TopCommunityPostCard() {
  const topPost = communityPosts.reduce((best, post) =>
    post.upvotes > best.upvotes ? post : best
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-5 pb-2 pt-5">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Top Community Post
        </CardTitle>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
            {topPost.avatar}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {topPost.username}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {topPost.category}
              </span>
            </div>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {topPost.content}
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                {topPost.upvotes}
              </span>
              <span>{topPost.comments} comments</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TreesCard({ trees }: { trees: number }) {
  return (
    <Card className="border-accent/30 bg-accent/10">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/20">
          <TreePine className="h-7 w-7 text-accent-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Your Impact</span>
          <span className="text-3xl font-bold text-foreground">{trees}</span>
          <span className="text-xs text-muted-foreground">Trees earned this week</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function HomeScreen({
  completedGoals,
  totalGoals,
  trees,
}: {
  completedGoals: number
  totalGoals: number
  trees: number
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-4">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <TreePine className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">ReGen</h1>
      </div>

      <WeatherCard />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GoalsSummaryCard
          completedGoals={completedGoals}
          totalGoals={totalGoals}
        />
        <TreesCard trees={trees} />
      </div>
      <DidYouKnowCard />
      <TopCommunityPostCard />
    </div>
  )
}
