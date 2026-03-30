"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, login, register } = useAuth()

  const initialMode = useMemo(() => (searchParams.get("mode") === "register" ? "register" : "login"), [searchParams])
  const [mode, setMode] = useState<"login" | "register">(initialMode)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, router])

  const switchMode = (next: "login" | "register") => {
    setMode(next)
    router.replace(next === "register" ? "/auth?mode=register" : "/auth")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    const result = await login(email, password)
    if (result.success) {
      router.replace("/")
      return
    }

    if (result.requiresPasswordSetup) {
      const params = new URLSearchParams({ identifier: email })
      router.replace(`/create-password?${params.toString()}`)
      return
    }

    toast.error(result.message || "Login failed")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !phoneNumber || !title) {
      toast.error("Please fill in all fields")
      return
    }

    const result = await register(name, email, password, phoneNumber, title)
    if (result.success) {
      toast.success(result.message || "Registration successful")
      switchMode("login")
      return
    }

    toast.error(result.message || "Registration failed")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative h-16 w-16">
              <Image
                src="/FullLogo.png"
                alt="NexxMed logo"
                fill
                sizes="64px"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">NexxMed</h1>
          <p className="text-muted-foreground">Clinic management access</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <Button type="button" variant={mode === "login" ? "default" : "ghost"} onClick={() => switchMode("login")}>
              Login
            </Button>
            <Button type="button" variant={mode === "register" ? "default" : "ghost"} onClick={() => switchMode("register")}>
              Register
            </Button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dr.name@eyecare.com"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2">Sign In</Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dr.name@eyecare.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                <Input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2">Register</Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground text-center">
            {mode === "login" ? (
              <>
                Need an account? <Link href="/auth?mode=register" className="text-primary hover:underline">Register</Link>
              </>
            ) : (
              <>
                Already have an account? <Link href="/auth" className="text-primary hover:underline">Login</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AuthPageContent />
    </Suspense>
  )
}
