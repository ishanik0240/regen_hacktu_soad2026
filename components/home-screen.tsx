"use client"

import {
  ChevronRight,
  Thermometer,
  TreePine,
  Lightbulb,
  ArrowUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { WeatherBanner } from "@/components/weather-banner"
import { climateFacts } from "@/lib/mock-data"
import { useState, useMemo } from "react"

function GoalsSummaryCard({
  completedGoals,
  totalGoals,
  onNavigateToGoals,
}: {
  completedGoals: number
  totalGoals: number
  onNavigateToGoals: () => void
}) {
  const percentage = Math.round((completedGoals / totalGoals) * 100)

  return (
    <Card
      className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-md"
      onClick={onNavigateToGoals}
    >
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

function TopCommunityPostCard({
  posts,
  onPostClick,
}: {
  posts: { id: string; username: string; avatar: string; content: string; upvotes: number; comments: number; category?: string; title?: string; imageUrl?: string }[]
  onPostClick: (postId: string) => void
}) {
  const topPost = posts.length
    ? posts.reduce((best, post) =>
        post.upvotes > best.upvotes ? post : best
      )
    : null

  if (!topPost) return null

  return (
    <Card
      className="cursor-pointer transition-all hover:border-primary/30 hover:shadow-md"
      onClick={() => onPostClick(topPost.id)}
    >
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
              {topPost.category && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {topPost.category}
                </span>
              )}
            </div>
            {topPost.title && (
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {topPost.title}
              </p>
            )}
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {topPost.content}
            </p>
            {topPost.imageUrl && (
              <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={topPost.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
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
  cityName,
  communityPosts,
  onNavigateToGoals,
  onNavigateToCommunityPost,
}: {
  completedGoals: number
  totalGoals: number
  trees: number
  cityName?: string
  communityPosts?: { id: string; username: string; avatar: string; content: string; upvotes: number; comments: number; category?: string; title?: string; imageUrl?: string }[]
  onNavigateToGoals?: () => void
  onNavigateToCommunityPost?: (postId: string) => void
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-4">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <TreePine className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">ReGen</h1>
      </div>

      <WeatherBanner cityName={cityName} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GoalsSummaryCard
          completedGoals={completedGoals}
          totalGoals={totalGoals}
          onNavigateToGoals={onNavigateToGoals ?? (() => {})}
        />
        <TreesCard trees={trees} />
      </div>
      <DidYouKnowCard />
      <TopCommunityPostCard
        posts={communityPosts ?? []}
        onPostClick={onNavigateToCommunityPost ?? (() => {})}
      />
    </div>
  )
}
