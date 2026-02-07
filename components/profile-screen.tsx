"use client"

import { useState } from "react"
import {
  ArrowUp,
  Calendar,
  Edit3,
  Leaf,
  LogOut,
  Mail,
  MessageCircle,
  TreePine,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProfileData {
  name: string
  email: string
  dob: string
  totalTrees: number
  goalsCompleted: number
  streak: number
  postsCreated: number
  postsUpvoted: number
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number | string
  icon: typeof TreePine
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-secondary p-3">
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function ImpactRing({
  totalTrees,
  level,
}: {
  totalTrees: number
  level: string
}) {
  const nextMilestone = totalTrees < 100 ? 100 : totalTrees < 500 ? 500 : 1000
  const progress = Math.min((totalTrees / nextMilestone) * 100, 100)

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-3 p-6">
        <div className="relative flex h-32 w-32 items-center justify-center">
          {/* Outer ring */}
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="hsl(150, 12%, 88%)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="hsl(158, 64%, 32%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="flex flex-col items-center">
            <TreePine className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              {totalTrees}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-foreground">
            {level}
          </span>
          <span className="text-xs text-muted-foreground">
            {nextMilestone - totalTrees} Trees to next milestone
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityTab({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-secondary p-1">
      {["Posts", "Upvoted"].map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab.toLowerCase())}
          className={cn(
            "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            activeTab === tab.toLowerCase()
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export function ProfileScreen({
  profile,
  onLogout,
}: {
  profile: ProfileData
  onLogout: () => void
}) {
  const [activeTab, setActiveTab] = useState("posts")

  const level =
    profile.totalTrees < 100
      ? "Seedling"
      : profile.totalTrees < 300
        ? "Sapling"
        : profile.totalTrees < 500
          ? "Young Tree"
          : "Mighty Oak"

  const samplePosts = [
    {
      id: "1",
      content:
        "Started a composting pit in our colony. If anyone wants to join, let me know!",
      upvotes: 34,
      comments: 8,
      time: "2d ago",
    },
    {
      id: "2",
      content:
        "Completed 7-day streak on ReGen! Small steps, big impact. Who else is on a streak?",
      upvotes: 21,
      comments: 5,
      time: "5d ago",
    },
  ]

  const sampleUpvoted = [
    {
      id: "3",
      username: "PriyaK",
      content:
        "Planted 15 saplings near Rajindra Hospital with the ReGen community!",
      upvotes: 89,
      time: "4h ago",
    },
    {
      id: "4",
      username: "HarjotB",
      content:
        "Solar panel installation at Punjabi University campus is now operational!",
      upvotes: 215,
      time: "1d ago",
    },
    {
      id: "5",
      username: "KamalJ",
      content:
        "Groundwater table has dropped 3 meters. We need rainwater harvesting!",
      upvotes: 178,
      time: "2d ago",
    },
  ]

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="gap-1.5 text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* User info card */}
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-foreground">
              {profile.name}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {profile.email}
            </div>
            {profile.dob && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {profile.dob}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Impact ring */}
      <ImpactRing totalTrees={profile.totalTrees} level={level} />

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Goals Done"
          value={profile.goalsCompleted}
          icon={Leaf}
        />
        <StatCard
          label="Day Streak"
          value={profile.streak}
          icon={Calendar}
        />
        <StatCard
          label="Posts"
          value={profile.postsCreated}
          icon={MessageCircle}
        />
      </div>

      {/* Activity */}
      <Card>
        <CardHeader className="px-5 pb-2 pt-5">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-5 pb-5">
          <ActivityTab activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "posts" && (
            <div className="flex flex-col gap-3">
              {samplePosts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-1.5 rounded-lg bg-secondary p-3"
                >
                  <p className="text-sm leading-relaxed text-foreground">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {post.upvotes}
                    </span>
                    <span>{post.comments} comments</span>
                    <span className="ml-auto">{post.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "upvoted" && (
            <div className="flex flex-col gap-3">
              {sampleUpvoted.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col gap-1.5 rounded-lg bg-secondary p-3"
                >
                  <span className="text-xs font-semibold text-primary">
                    {post.username}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-primary">
                      <ArrowUp className="h-3 w-3" />
                      {post.upvotes}
                    </span>
                    <span className="ml-auto">{post.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
