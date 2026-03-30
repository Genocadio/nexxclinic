"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChangePassword, useUpdateMyProfile } from "@/hooks/auth-hooks"
import { useAuth } from "@/lib/auth-context"
import { sanitizeEmailInput, sanitizePhoneInput } from "@/lib/validation-utils"

const roleDisallowsTitle = (roles: string[]) => {
  if (roles.includes("RECEPTIONIST") || roles.includes("FINANCE")) return true
  return roles.length === 1 && roles[0] === "ADMIN"
}

export default function AccountPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { updateMyProfile, loading: updatingProfile } = useUpdateMyProfile()
  const { changePassword, loading: changingPassword } = useChangePassword()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [title, setTitle] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const titleAllowedForCurrentUser = !roleDisallowsTitle(roles)

  useEffect(() => {
    if (!doctor) return
    setName(doctor.name || "")
    setEmail(doctor.email || "")
    setPhoneNumber(doctor.phoneNumber || "")
    setTitle(titleAllowedForCurrentUser ? (doctor.title || "") : "")
  }, [doctor, titleAllowedForCurrentUser])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !phoneNumber) {
      toast.error("Name, email, and phone are required")
      return
    }

    try {
      const response = await updateMyProfile({ name, email, phoneNumber, title: titleAllowedForCurrentUser ? title : "" })
      if (response?.status === "SUCCESS" && response.data) {
        localStorage.setItem("doctor", JSON.stringify(response.data))
        toast.success("Profile updated")
        return
      }

      toast.error(response?.messages?.[0]?.text || "Could not update profile")
    } catch {
      toast.error("Could not update profile")
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password must match")
      return
    }

    try {
      const response = await changePassword(currentPassword, newPassword)
      if (response?.status === "SUCCESS") {
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        toast.success("Password changed successfully")
        return
      }

      toast.error(response?.messages?.[0]?.text || "Could not change password")
    } catch {
      toast.error("Could not change password")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and password.</p>
          </div>
        </div>

        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))} />
              <Input placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(sanitizePhoneInput(e.target.value))} />
              {titleAllowedForCurrentUser ? (
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              ) : (
                <div className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                  Title is not editable for your role.
                </div>
              )}
            </div>
            <Button type="submit" className="rounded-full" disabled={updatingProfile}>
              {updatingProfile ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </section>

        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="rounded-full" disabled={changingPassword}>
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </section>
      </main>
    </div>
  )
}
