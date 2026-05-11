"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSetInitialPassword } from "@/hooks/auth-hooks"
import { toast } from "sonner"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"

export default function SetupPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setInitialPassword, loading } = useSetInitialPassword()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Get user identifier from URL params (passed from login)
  const identifier = searchParams.get("identifier") || ""

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/\d/.test(pwd)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!identifier) {
      toast.error("User identifier not found. Please try logging in again.")
      router.push("/login")
      return
    }

    if (!password) {
      toast.error("Password is required")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const validationError = validatePassword(password)
    if (validationError) {
      toast.error(validationError)
      return
    }

    // Ensure both identifier and password are non-empty strings to avoid GraphQL null value error
    if (!identifier.trim() || !password.trim()) {
      toast.error("Invalid input: identifier and password cannot be empty")
      return
    }

    try {
      const result = await setInitialPassword(identifier.trim(), password.trim())
      
      if (result.status === "SUCCESS") {
        setIsSuccess(true)
        toast.success("Password set successfully! Redirecting to login...")
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        const errorMessage = result.message || result.messages?.[0]?.text || "Failed to set password"
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("An error occurred while setting password")
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Password Set Successfully!</h2>
                <p className="text-gray-600 mt-2">
                  Your password has been set. You will be redirected to the login page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Set Your Password</CardTitle>
          <CardDescription>
            Your account has been created. Please set a secure password to complete your setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {password && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                <div className="space-y-1">
                  <div className={`flex items-center text-xs ${password.length >= 8 ? "text-green-600" : "text-gray-500"}`}>
                    <div className={`w-1 h-1 rounded-full mr-2 ${password.length >= 8 ? "bg-green-600" : "bg-gray-300"}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center text-xs ${/[a-z]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                    <div className={`w-1 h-1 rounded-full mr-2 ${/[a-z]/.test(password) ? "bg-green-600" : "bg-gray-300"}`} />
                    One lowercase letter
                  </div>
                  <div className={`flex items-center text-xs ${/[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                    <div className={`w-1 h-1 rounded-full mr-2 ${/[A-Z]/.test(password) ? "bg-green-600" : "bg-gray-300"}`} />
                    One uppercase letter
                  </div>
                  <div className={`flex items-center text-xs ${/\d/.test(password) ? "text-green-600" : "text-gray-500"}`}>
                    <div className={`w-1 h-1 rounded-full mr-2 ${/\d/.test(password) ? "bg-green-600" : "bg-gray-300"}`} />
                    One number
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
            >
              {loading ? "Setting Password..." : "Set Password"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-gray-600"
                onClick={() => router.push("/login")}
              >
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
