"use client"

import { useState, useEffect, useRef } from "react"
import {
  ArrowUp,
  Flag,
  ImagePlus,
  MapPin,
  MessageCircle,
  Plus,
  Repeat2,
  Send,
  TreePine,
  Users,
  UserPlus,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  syncContacts,
  getFriendActivity,
  type FriendActivityItem,
} from "@/lib/contactSyncService"
import { CommunityFeed } from "./community-feed"

const categoryBadgeColors: Record<string, string> = {
  water: "bg-emerald-100 text-emerald-800",
  waste: "bg-green-100 text-green-800",
  air: "bg-teal-100 text-teal-800",
  deforestation: "bg-emerald-100 text-emerald-800",
  transport: "bg-green-100/90 text-green-800",
  energy: "bg-lime-100 text-lime-800",
  food: "bg-emerald-100/90 text-emerald-800",
}

export interface Post {
  id: string
  username: string
  avatar: string
  content: string
  upvotes: number
  comments: number
  category: string
  city: string
  timeAgo: string
  title?: string
  imageUrl?: string
  movement?: { id: string; name: string }
}

export function PostCard({
  post,
  onUpvote,
  onPointsEarned,
  isSelected,
  onJoinMovement,
}: {
  post: Post & { upvoted?: boolean }
  onUpvote: (id: string) => void
  onPointsEarned: (amount: number, action: string) => void
  isSelected?: boolean
  onJoinMovement?: (postId: string, movementId: string) => void
}) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [localComments, setLocalComments] = useState<
    { user: string; text: string }[]
  >([])
  const [reposted, setReposted] = useState(false)
  const [joinedMovement, setJoinedMovement] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const badgeColor =
    categoryBadgeColors[post.category] || "bg-muted text-muted-foreground"

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
      setShowComments(true)
    }
  }, [isSelected])

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

  function handleJoinMovement() {
    if (post.movement && !joinedMovement) {
      setJoinedMovement(true)
      onJoinMovement?.(post.id, post.movement.id)
    }
  }

  return (
    <div ref={cardRef}>
      <Card
        className={cn(
          "border-primary/15 bg-primary/[0.06] transition-all",
          isSelected && "ring-2 ring-primary/40"
        )}
      >
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

            {post.title && (
              <h4 className="text-sm font-semibold text-foreground">
                {post.title}
              </h4>
            )}
            <p className="text-sm leading-relaxed text-foreground">
              {post.content}
            </p>

            {post.imageUrl && (
              <div className="overflow-hidden rounded-lg border border-border">
                <img
                  src={post.imageUrl}
                  alt="Post attachment"
                  className="max-h-64 w-full object-cover"
                />
              </div>
            )}

            {post.movement && (
              <Button
                type="button"
                variant={joinedMovement ? "secondary" : "default"}
                size="sm"
                onClick={handleJoinMovement}
                disabled={joinedMovement}
                className="mt-1 w-fit gap-1.5"
              >
                <Users className="h-3.5 w-3.5" />
                {joinedMovement ? "Joined" : "Join a Movement"}
                {joinedMovement && ` · ${post.movement.name}`}
              </Button>
            )}

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
    </div>
  )
}

export function CommunityScreen({
  posts,
  cityName,
  onPointsEarned,
  selectedPostId,
  onClearSelectedPost,
}: {
  posts: Post[]
  cityName: string
  onPointsEarned: (amount: number, action: string) => void
  selectedPostId?: string | null
  onClearSelectedPost?: () => void
}) {
  const [localPosts, setLocalPosts] = useState<(Post & { upvoted?: boolean })[]>(
    posts.map((p) => ({ ...p, upvoted: false }))
  )
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostCategory, setNewPostCategory] = useState("waste")
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [pointsFeedback, setPointsFeedback] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed")
  const [friendActivity, setFriendActivity] = useState<FriendActivityItem[]>([])
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    setFriendActivity(getFriendActivity())
  }, [activeTab])

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
      ...(newPostImage && { imageUrl: newPostImage }),
    }
    setLocalPosts((prev) => [newPost, ...prev])
    setNewPostContent("")
    setNewPostImage(null)
    setShowNewPost(false)
    onPointsEarned(10, "Created a post")
    showFeedback("+10 Trees for creating a post!")
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const valid = ["image/jpeg", "image/jpg"].includes(file.type)
    if (!valid) return
    const reader = new FileReader()
    reader.onload = () => setNewPostImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleJoinMovement(postId: string, _movementId: string) {
    onPointsEarned(5, "Joined a movement")
    showFeedback("+5 Trees for joining a movement!")
  }

  function handlePointsFeedback(amount: number, action: string) {
    showFeedback(`+${amount} Trees for ${action.toLowerCase()}!`)
    onPointsEarned(amount, action)
  }

  async function handleSyncContacts() {
    setSyncing(true)
    try {
      const { matchedCount, friends } = await syncContacts()
      setFriendActivity(getFriendActivity())
      setActiveTab("friends")
      showFeedback(
        matchedCount > 0
          ? `Synced! ${matchedCount} friend${matchedCount === 1 ? "" : "s"} on ReGen`
          : "No contacts matched. Try again later."
      )
    } catch {
      showFeedback("Could not sync contacts.")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-24 pt-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">Community</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {cityName}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSyncContacts}
              disabled={syncing}
              className="gap-1.5 rounded-full"
            >
              <UserPlus className="h-4 w-4" />
              {syncing ? "Syncing…" : "Sync Contacts"}
            </Button>
            <Button
              size="sm"
              onClick={() => setShowNewPost(true)}
              className="gap-1.5 rounded-full"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
        <div className={cn("flex gap-1 rounded-xl bg-secondary p-1")}>
          <button
            type="button"
            onClick={() => setActiveTab("feed")}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === "feed"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Feed
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("friends")
              setFriendActivity(getFriendActivity())
            }}
            className={cn(
              "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === "friends"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Friends Activity
          </button>
        </div>
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
        <Card className="border-primary/30 bg-primary/[0.06]">
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
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <ImagePlus className="h-4 w-4" />
                <span>Add image (optional, .jpg / .jpeg)</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {newPostImage && (
                <div className="relative inline-block max-w-[200px]">
                  <img
                    src={newPostImage}
                    alt="Preview"
                    className="rounded-lg border border-border object-cover max-h-24"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPostImage(null)}
                    className="absolute -right-1 -top-1 rounded-full bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
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

      {/* Feed tab */}
      {activeTab === "feed" && (
        <CommunityFeed
          posts={localPosts}
          selectedPostId={selectedPostId}
          onUpvote={handleUpvote}
          onPointsEarned={handlePointsFeedback}
          onJoinMovement={handleJoinMovement}
        />
      )}

      {/* Friends Activity tab */}
      {activeTab === "friends" && (
        <div className="flex flex-col gap-3">
          {friendActivity.length === 0 ? (
            <Card className="border-primary/15 bg-primary/[0.06]">
              <CardContent className="flex flex-col items-center gap-3 py-8">
                <Users className="h-12 w-12 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  Sync your contacts to see what friends are doing on ReGen.
                </p>
                <Button
                  size="sm"
                  onClick={handleSyncContacts}
                  disabled={syncing}
                  className="gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  {syncing ? "Syncing…" : "Sync Contacts"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            friendActivity.map((item) => (
              <Card
                key={item.id}
                className="border-primary/15 bg-primary/[0.06] transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {item.avatar ?? item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.title}
                      </p>
                      {item.image && (
                        <div className="mt-2 overflow-hidden rounded-lg border border-border">
                          <img
                            src={item.image}
                            alt=""
                            loading="lazy"
                            className="h-36 w-full object-cover"
                          />
                        </div>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.timestamp}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
