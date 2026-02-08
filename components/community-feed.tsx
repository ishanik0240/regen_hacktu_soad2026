"use client"

import { PostCard, type Post } from "./community-screen"

export type FeedPost = Post & { upvoted?: boolean }

export function CommunityFeed({
  posts,
  selectedPostId,
  onUpvote,
  onPointsEarned,
  onJoinMovement,
}: {
  posts: FeedPost[]
  selectedPostId?: string | null
  onUpvote: (id: string) => void
  onPointsEarned: (amount: number, action: string) => void
  onJoinMovement?: (postId: string, movementId: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onUpvote={onUpvote}
          onPointsEarned={onPointsEarned}
          isSelected={selectedPostId === post.id}
          onJoinMovement={onJoinMovement}
        />
      ))}
    </div>
  )
}
