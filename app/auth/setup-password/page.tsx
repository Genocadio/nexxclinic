"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSetInitialPassword } from "@/hooks/auth-hooks"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import { handleResponse } from "@/lib/response-handler"
import { FieldError } from "@/components/ui/field-error"
import {
  setupPasswordFormSchema,
  type SetupPasswordFormValues,
} from "@/lib/form-schemas"

export default function SetupPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setInitialPassword, loading } = useSetInitialPassword()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Get user identifier from URL params (passed from login)
  const identifier = searchParams.get("identifier") || ""

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SetupPasswordFormValues>({
    resolver: zodResolver(setupPasswordFormSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  })

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")

  const handleSubmitForm = async (values: SetupPasswordFormValues) => {
    setServerError(null)
    if (!identifier) {
      toast.error("User identifier not found. Please try logging in again.")
      router.push("/login")
      return
    }

    // Ensure both identifier and password are non-empty strings to avoid GraphQL null value error
    if (!identifier.trim() || !values.password.trim()) {
      const msg = "Invalid input: identifier and password cannot be empty"
      setServerError(msg)
      await handleResponse({ status: "ERROR", message: msg }, { successMessage: false })
      return
    }

    try {
      const result = await setInitialPassword(identifier.trim(), values.password.trim())

      if (result?.status === "SUCCESS") {
        setIsSuccess(true)
        toast.success("Password set successfully! Redirecting to login...")

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        const errorMsg = result?.message || result?.messages?.[0]?.text || "An error occurred while setting password"
        setServerError(errorMsg)
        setError("password", { message: errorMsg })
        toast.error(errorMsg)
      }
    } catch (err: any) {
      const errorMsg = err?.message || "An error occurred while setting password"
      setServerError(errorMsg)
      setError("password", { message: errorMsg })
      toast.error(errorMsg)
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
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4" noValidate>
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:border-red-800 dark:text-red-300">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600 dark:text-red-400" />
                <span className="flex-1 font-medium leading-relaxed">{serverError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    onChange: () => {
                      if (serverError) setServerError(null)
                    },
                  })}
                  className={`pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-300" : ""}`}
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
              <FieldError message={errors.password?.message} />
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
                  {...register("confirmPassword")}
                  className={`pr-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-300" : ""}`}
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
              <FieldError message={errors.confirmPassword?.message} />
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
