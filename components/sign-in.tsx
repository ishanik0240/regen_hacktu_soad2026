"use client"

import { useState } from "react"
import Image from "next/image"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SignIn({ onSignIn }: { onSignIn: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      onSignIn()
    }
  }

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden">
      {/* Full-screen background image - forest canopy; responsive, object-cover prevents layout shift */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/signin-forest.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>
      {/* Fade overlay for readability */}
      <div
        className="absolute inset-0 z-10 bg-black/50"
        aria-hidden
      />
      {/* Sign-in form */}
      <div className="relative z-20 w-full max-w-sm px-6">
        <Card className="border-0 bg-white/95 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4 pt-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Leaf className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              ReGen
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue your climate action
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
