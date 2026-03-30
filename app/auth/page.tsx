"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"

import { useAuth } from "@/lib/auth-context"
import { getPostLoginPath } from "@/lib/role-utils"
import { validateEmailOrPhone } from "@/lib/validation-utils"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type FieldErrors = Partial<Record<"email" | "password" | "name" | "phoneNumber" | "title", string>>

function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, doctor, login, register } = useAuth()

  const initialMode = useMemo(() => (searchParams.get("mode") === "register" ? "register" : "login"), [searchParams])
  const [mode, setMode] = useState<"login" | "register">(initialMode)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [title, setTitle] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})

  const baseInputClass = "rounded-xl border-slate-300 bg-white/95 text-slate-900 placeholder:text-slate-500 shadow-sm focus-visible:border-slate-500 focus-visible:ring-slate-300/70 dark:border-input dark:bg-input/30 dark:text-foreground dark:placeholder:text-muted-foreground"

  const tabButtonClass = (isActive: boolean) =>
    `rounded-xl transition-all duration-300 ${
      isActive
        ? "shadow-md"
        : "text-slate-700 hover:text-slate-900 hover:bg-white/80 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-700/60"
    }`

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (isAuthenticated) {
      const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
      router.replace(getPostLoginPath(roles))
    }
  }, [doctor, isAuthenticated, router])

  const switchMode = (next: "login" | "register") => {
    setMode(next)
    setErrors({})
    router.replace(next === "register" ? "/auth?mode=register" : "/auth")
  }

  const clearError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateForm = (currentMode: "login" | "register"): FieldErrors => {
    const nextErrors: FieldErrors = {}

    const emailOrPhoneValidation = validateEmailOrPhone(email)
    if (!emailOrPhoneValidation.valid) {
      nextErrors.email = emailOrPhoneValidation.error
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required"
    }

    if (currentMode === "register") {
      if (!name.trim()) nextErrors.name = "Full name is required"
      // Phone number is now optional (can be provided in Email field as phone)
    }

    return nextErrors
  }

  const getWelcomeName = () => {
    if (typeof window !== "undefined") {
      try {
        const storedDoctor = localStorage.getItem("doctor")
        if (storedDoctor) {
          const parsedDoctor = JSON.parse(storedDoctor) as { name?: string }
          if (parsedDoctor?.name?.trim()) {
            return parsedDoctor.name.trim()
          }
        }
      } catch {
        // Fallback to email-derived name below.
      }
    }

    // If input is email, extract name from email prefix
    if (email.includes("@")) {
      const emailPrefix = email.split("@")[0]?.trim()
      if (emailPrefix) {
        return emailPrefix
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      }
    }

    return "Doctor"
  }

  const getStoredRoles = () => {
    if (typeof window === "undefined") {
      return [] as string[]
    }

    try {
      const storedDoctor = localStorage.getItem("doctor")
      if (!storedDoctor) return []
      const parsedDoctor = JSON.parse(storedDoctor) as { roles?: string[] } | null
      return parsedDoctor?.roles || []
    } catch {
      return []
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm("login")
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    const result = await login(email, password)
    if (result.success) {
      const welcomeName = getWelcomeName()
      toast.success(`Welcome back, ${welcomeName}`, {
        position: "top-center",
        autoClose: 2200,
        closeOnClick: false,
        draggable: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        closeButton: false,
        className: "nexx-toast-welcome",
      })
      router.replace(getPostLoginPath(getStoredRoles()))
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

    const validationErrors = validateForm("register")
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    const result = await register(name, email, password, phoneNumber, title)
    if (result.success) {
      toast.success(result.message || "Registration successful")
      switchMode("login")
      return
    }

    toast.error(result.message || "Registration failed")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-500/20" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/20" />

      <div className="absolute right-4 top-4 z-20 rounded-2xl border border-slate-300/90 bg-white/90 p-1.5 shadow-lg ring-1 ring-white/80 backdrop-blur-md dark:border-white/15 dark:bg-slate-900/70 dark:ring-white/10 sm:right-6 sm:top-6">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center fly-in fly-in-1">
          <div className="flex items-center justify-center mb-4 fly-in fly-in-2">
            <div className="relative h-16 w-16 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-lg ring-1 ring-white/60 dark:ring-white/10">
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 fly-in fly-in-3">NexxMed</h1>
          <p className="text-slate-600 dark:text-slate-300 fly-in fly-in-4">Welcome back</p>
        </div>

        <div className="rounded-3xl border border-slate-300/90 dark:border-white/10 bg-white/88 dark:bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/90 dark:ring-white/5 space-y-5 fly-in fly-in-5">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-100/90 dark:border-white/10 dark:bg-slate-800/80 p-1 ring-1 ring-white/90 dark:ring-white/10 fly-in fly-in-6">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "ghost"}
              className={tabButtonClass(mode === "login")}
              onClick={() => switchMode("login")}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={mode === "register" ? "default" : "ghost"}
              className={tabButtonClass(mode === "register")}
              onClick={() => switchMode("register")}
            >
              Register
            </Button>
          </div>

          <div key={mode} className="mode-switch-panel">
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4 fly-in fly-in-7">
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Email or Phone</label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearError("email")
                    }}
                    placeholder="dr.name@eyecare.com or +256701234567 or 0712345678"
                    className={`w-full ${baseInputClass} ${errors.email ? "border-amber-500 focus-visible:ring-amber-300" : ""}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearError("password")
                      }}
                      placeholder="Enter your password"
                      className={`w-full pr-10 ${baseInputClass} ${errors.password ? "border-amber-500 focus-visible:ring-amber-300" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full mt-2 rounded-xl">Sign In</Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 fly-in fly-in-7">
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Full Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      clearError("name")
                    }}
                    placeholder="Enter your full name"
                    className={`${baseInputClass} ${errors.name ? "border-amber-500 focus-visible:ring-amber-300" : ""}`}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Email or Phone</label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearError("email")
                    }}
                    placeholder="dr.name@eyecare.com or +256701234567 or 0712345678"
                    className={`${baseInputClass} ${errors.email ? "border-amber-500 focus-visible:ring-amber-300" : ""}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Phone Number (Optional)</label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      clearError("phoneNumber")
                    }}
                    placeholder="Enter your phone number"
                    className={`${baseInputClass} ${errors.phoneNumber ? "border-amber-500 focus-visible:ring-amber-300" : ""}`}
                  />
                  {errors.phoneNumber && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{errors.phoneNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Title</label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      clearError("title")
                    }}
                    placeholder="Enter your title"
                    className={`${baseInputClass} ${errors.title ? "border-amber-500 focus-visible:ring-amber-300" : ""}`}
                  />
                  {errors.title && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        clearError("password")
                      }}
                      placeholder="Enter your password"
                      className={`w-full pr-10 ${baseInputClass} ${errors.password ? "border-amber-500 focus-visible:ring-amber-300" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full mt-2 rounded-xl">Register</Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground text-center fly-in fly-in-8">
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

      <style jsx>{`
        .fly-in {
          opacity: 0;
          animation: flyIn 560ms cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
          will-change: transform, opacity;
        }

        .fly-in-1 { animation-delay: 30ms; }
        .fly-in-2 { animation-delay: 80ms; }
        .fly-in-3 { animation-delay: 130ms; }
        .fly-in-4 { animation-delay: 180ms; }
        .fly-in-5 { animation-delay: 230ms; }
        .fly-in-6 { animation-delay: 290ms; }
        .fly-in-7 { animation-delay: 350ms; }
        .fly-in-8 { animation-delay: 420ms; }

        @keyframes flyIn {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.985);
            filter: blur(6px);
          }
          60% {
            opacity: 1;
            transform: translateY(-2px) scale(1.002);
            filter: blur(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        .mode-switch-panel {
          animation: modeSwitchIn 320ms cubic-bezier(0.2, 0.75, 0.35, 1) both;
          transform-origin: top center;
        }

        @keyframes modeSwitchIn {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.992);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fly-in {
            opacity: 1;
            animation: none;
          }

          .mode-switch-panel {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />}>
      <AuthPageContent />
    </Suspense>
  )
}
