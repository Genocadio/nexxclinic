"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera } from "lucide-react"
import { toast } from "react-toastify"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MediaUploader } from "@/components/ui/media-uploader"
import { useChangePassword, useUpdateMyProfile } from "@/hooks/auth-hooks"
import { useAuth } from "@/lib/auth-context"
import { sanitizeEmailInput, sanitizePhoneInput } from "@/lib/validation-utils"
import { getMediaUrl } from "@/lib/media-url"
import { Gender } from "@/lib/api-types"

export default function AccountPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { updateMyProfile, loading: updatingProfile } = useUpdateMyProfile()
  const { changePassword, loading: changingPassword } = useChangePassword()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [username, setUsername] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (!doctor) return
    setName(doctor.name || "")
    setEmail(doctor.email || "")
    setPhoneNumber(doctor.phoneNumber || "")
    setUsername(doctor.username || "")
    setDateOfBirth(doctor.dateOfBirth || "")
    setGender(doctor.gender || "")
    setProfilePhotoUrl(doctor.profilePhotoUrl || "")
  }, [doctor])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name || !email || !phoneNumber) {
      toast.error("Name, email, and phone are required")
      return
    }

    try {
      const response = await updateMyProfile({
        name,
        email,
        phoneNumber,
        username: username || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        profilePhotoUrl: profilePhotoUrl || undefined,
      })
      if (response?.status === "SUCCESS" && response.data) {
        localStorage.setItem("doctor", JSON.stringify(response.data))
        window.dispatchEvent(new Event("auth-user-updated"))
        toast.success("Profile updated")
        return
      }

      toast.error(response?.messages?.[0]?.text || "Could not update profile")
    } catch {
      toast.error("Could not update profile")
    }
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
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
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                {profilePhotoUrl ? (
                  <img
                    src={getMediaUrl(profilePhotoUrl)}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Camera className="h-6 w-6 text-muted-foreground/60" />
                  </div>
                )}
                <MediaUploader
                  accept="image/*"
                  multiple={false}
                  currentUrl={profilePhotoUrl || undefined}
                  onUploaded={(files) => {
                    if (files[0]) setProfilePhotoUrl(files[0].url)
                  }}
                  onError={(err) => toast.error(err)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{doctor?.name || "User"}</p>
                <p>{doctor?.email}</p>
                {doctor?.departments?.[0] && (
                  <p className="text-xs mt-0.5">{doctor.departments[0].name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))} />
              <Input placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(sanitizePhoneInput(e.target.value))} />
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input
                type="date"
                placeholder="Date of birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="[color-scheme:light] dark:[color-scheme:dark]"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select gender</option>
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
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
