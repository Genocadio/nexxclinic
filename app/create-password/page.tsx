"use client"

import { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/ui/field-error"
import { useCreatePassword } from "@/hooks/auth-hooks"
import {
  createPasswordFormSchema,
  type CreatePasswordFormValues,
} from "@/lib/form-schemas"

function CreatePasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { createPassword, loading } = useCreatePassword()

  const initialIdentifier = useMemo(() => {
    const fromQuery = searchParams.get("identifier")?.trim()
    if (fromQuery) return fromQuery

    if (typeof window !== "undefined") {
      return (localStorage.getItem("pendingResetIdentifier") || "").trim()
    }

    return ""
  }, [searchParams])

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordFormValues>({
    resolver: zodResolver(createPasswordFormSchema),
    mode: "onChange",
    defaultValues: { identifier: initialIdentifier, password: "", confirmPassword: "" },
  })

  const handleCreatePassword = async (values: CreatePasswordFormValues) => {
    try {
      const response = await createPassword(values.identifier, values.password)
      if (response?.status === "SUCCESS") {
        localStorage.removeItem("pendingResetIdentifier")
        toast.success("Password created successfully. Please login.")
        router.replace("/auth")
        return
      }

      toast.error(response?.messages?.[0]?.text || "Unable to create password")
    } catch {
      toast.error("Unable to create password")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-8 shadow-sm space-y-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Create Password</h1>
          <p className="text-sm text-muted-foreground">Set your password to activate your account access.</p>
        </div>

        <form onSubmit={handleSubmit(handleCreatePassword)} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email or Identifier</label>
            <Input
              type="text"
              {...register("identifier")}
              placeholder="Enter your email"
              className={errors.identifier ? "border-red-500 focus-visible:ring-red-300" : ""}
            />
            <FieldError message={errors.identifier?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter new password"
                className={`pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-300" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm new password"
                className={`pr-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-300" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <FieldError message={errors.confirmPassword?.message} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Password..." : "Create Password"}
          </Button>
        </form>

        <Button type="button" variant="ghost" className="w-full" onClick={() => router.replace("/auth")}>
          Back to Login
        </Button>
      </div>
    </div>
  )
}

export default function CreatePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CreatePasswordPageContent />
    </Suspense>
  )
}
