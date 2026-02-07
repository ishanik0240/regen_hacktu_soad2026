"use client"

import { useState } from "react"
import {
  ArrowUp,
  Flag,
  MapPin,
  MessageCircle,
  Plus,
  Repeat2,
  Send,
  TreePine,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  username: string
  avatar: string
  content: string
  upvotes: number
  comments: number
  category: string
  city: string
  timeAgo: string
}

const categoryBadgeColors: Record<string, string> = {
  water: "bg-blue-100 text-blue-700",
  waste: "bg-amber-100 text-amber-700",
  air: "bg-sky-100 text-sky-700",
  deforestation: "bg-emerald-100 text-emerald-700",
  transport: "bg-indigo-100 text-indigo-700",
  energy: "bg-yellow-100 text-yellow-700",
  food: "bg-lime-100 text-lime-700",
}

function PostCard({
  post,
  onUpvote,
  onPointsEarned,
}: {
  post: Post & { upvoted?: boolean }
  onUpvote: (id: string) => void
  onPointsEarned: (amount: number, action: string) => void
}) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [localComments, setLocalComments] = useState<
    { user: string; text: string }[]
  >([])
  const [reposted, setReposted] = useState(false)
  const badgeColor =
    categoryBadgeColors[post.category] || "bg-muted text-muted-foreground"

  function handleComment() {
    if (!commentText.trim()) return
    setLocalComments((prev) => [
      ...prev,
      { user: "You", text: commentText.trim() },
    ])
    setCommentText("")
    onPointsEarned(5, "Commented on a post")
  }

  function handleRepost() {
    if (!reposted) {
      setReposted(true)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {post.avatar}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {post.username}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  badgeColor
                )}
              >
                {post.category}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {post.timeAgo}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-foreground">
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-1 pt-1">
              <button
                type="button"
                onClick={() => onUpvote(post.id)}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-all",
                  post.upvoted
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <ArrowUp className="h-3.5 w-3.5" />
                {post.upvotes + (post.upvoted ? 1 : 0)}
              </button>

              <button
                type="button"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {post.comments + localComments.length}
              </button>

              <button
                type="button"
                onClick={handleRepost}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs transition-all",
                  reposted
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <Repeat2 className="h-3.5 w-3.5" />
                {reposted ? "Reposted" : "Repost"}
              </button>

              <button
                type="button"
                className="ml-auto flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Flag className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Comments section */}
            {showComments && (
              <div className="flex flex-col gap-2 rounded-lg bg-secondary p-3">
                {localComments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {localComments.map((c, i) => (
                      <div key={`comment-${post.id}-${i}`} className="flex gap-2 text-sm">
                        <span className="font-semibold text-foreground">
                          {c.user}:
                        </span>
                        <span className="text-muted-foreground">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="h-8 w-8 p-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span className="sr-only">Send comment</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CommunityScreen({
  posts,
  cityName,
  onPointsEarned,
}: {
  posts: Post[]
  cityName: string
  onPointsEarned: (amount: number, action: string) => void
}) {
  const [localPosts, setLocalPosts] = useState<(Post & { upvoted?: boolean })[]>(
    posts.map((p) => ({ ...p, upvoted: false }))
  )
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("waste")
  const [pointsFeedback, setPointsFeedback] = useState<string | null>(null)

  function showFeedback(msg: string) {
    setPointsFeedback(msg)
    setTimeout(() => setPointsFeedback(null), 2000)
  }

  function handleUpvote(id: string) {
    setLocalPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, upvoted: !p.upvoted } : p
      )
    )
    onPointsEarned(2, "Upvoted a post")
    showFeedback("+2 Trees for upvoting!")
  }

  function handleNewPost() {
    if (!newPostContent.trim()) return
    const newPost: Post & { upvoted?: boolean } = {
      id: `new-${Date.now()}`,
      username: "You",
      avatar: "YO",
      content: newPostContent.trim(),
      upvotes: 0,
      comments: 0,
      category: newPostCategory,
      city: cityName,
      timeAgo: "Just now",
      upvoted: false,
    }
    setLocalPosts((prev) => [newPost, ...prev])
    setNewPostContent("")
    setShowNewPost(false)
    onPointsEarned(10, "Created a post")
    showFeedback("+10 Trees for creating a post!")
  }

  function handlePointsFeedback(amount: number, action: string) {
    showFeedback(`+${amount} Trees for ${action.toLowerCase()}!`)
    onPointsEarned(amount, action)
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-foreground">Community</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {cityName}
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNewPost(true)}
          className="gap-1.5 rounded-full"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      {/* Points feedback toast */}
      {pointsFeedback && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
            <TreePine className="h-4 w-4" />
            {pointsFeedback}
          </div>
        </div>
      )}

      {/* New post form */}
      {showNewPost && (
        <Card className="border-primary/30">
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Create Post</h3>
              <button type="button" onClick={() => setShowNewPost(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <textarea
              placeholder="Share an environmental issue or solution..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <div className="flex items-center gap-2">
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="waste">Waste</option>
                <option value="air">Air</option>
                <option value="water">Water</option>
                <option value="deforestation">Deforestation</option>
                <option value="transport">Transport</option>
                <option value="energy">Energy</option>
                <option value="food">Food</option>
              </select>
              <Button
                onClick={handleNewPost}
                disabled={!newPostContent.trim()}
                className="ml-auto gap-1.5"
              >
                <Send className="h-4 w-4" />
                Post
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              <TreePine className="mr-1 inline h-3 w-3 text-primary" />
              Earn +10 Trees for posting
            </p>
          </CardContent>
        </Card>
      )}

      {/* Posts feed */}
      <div className="flex flex-col gap-3">
        {localPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpvote={handleUpvote}
            onPointsEarned={handlePointsFeedback}
          />
        ))}
      </div>
    </div>
  )
}
