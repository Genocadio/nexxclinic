"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Pencil } from "lucide-react"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FieldError } from "@/components/ui/field-error"
import { useChangePassword, useUpdateMyProfile } from "@/hooks/auth-hooks"
import { useAuth } from "@/lib/auth-context"
import { sanitizeEmailInput, sanitizePhoneInput } from "@/lib/validation-utils"
import { getMediaUrl } from "@/lib/media-url"
import { Gender } from "@/lib/api-types"
import { uploadFile } from "@/lib/storage-service"
import {
  accountProfileFormSchema,
  changePasswordFormSchema,
  type AccountProfileFormValues,
  type ChangePasswordFormValues,
} from "@/lib/form-schemas"

export default function AccountPage() {
  const router = useRouter()
  const { doctor } = useAuth()
  const { updateMyProfile, loading: updatingProfile } = useUpdateMyProfile()
  const { changePassword, loading: changingPassword } = useChangePassword()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profilePhotoUrl, setProfilePhotoUrl] = useState("")

  const initial = useRef({} as Record<string, string>)

  const profileForm = useForm<AccountProfileFormValues>({
    resolver: zodResolver(accountProfileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      username: "",
      dateOfBirth: "",
      gender: "",
    },
  })

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: "onChange",
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const profileValues = profileForm.watch()

  useEffect(() => {
    if (!doctor) return
    const vals = {
      name: doctor.name || "",
      email: doctor.email || "",
      phoneNumber: doctor.phoneNumber || "",
      username: doctor.username || "",
      dateOfBirth: doctor.dateOfBirth || "",
      gender: doctor.gender || "",
      profilePhotoUrl: doctor.profilePhotoUrl || "",
    }
    initial.current = vals
    setProfilePhotoUrl(vals.profilePhotoUrl)
    profileForm.reset({
      name: vals.name,
      email: vals.email,
      phoneNumber: vals.phoneNumber,
      username: vals.username,
      dateOfBirth: vals.dateOfBirth,
      gender: vals.gender,
    })
  }, [doctor])

  const hasChanges = useMemo(() => {
    const cur = {
      name: profileValues.name,
      email: profileValues.email,
      phoneNumber: profileValues.phoneNumber,
      username: profileValues.username,
      dateOfBirth: profileValues.dateOfBirth,
      gender: profileValues.gender,
      profilePhotoUrl,
    }
    return Object.keys(cur).some((k) => cur[k as keyof typeof cur] !== initial.current[k])
  }, [profileValues, profilePhotoUrl])

  const discard = () => {
    profileForm.reset({
      name: initial.current.name || "",
      email: initial.current.email || "",
      phoneNumber: initial.current.phoneNumber || "",
      username: initial.current.username || "",
      dateOfBirth: initial.current.dateOfBirth || "",
      gender: initial.current.gender || "",
    })
    setProfilePhotoUrl(initial.current.profilePhotoUrl || "")
  }

  const handlePhotoPick = () => fileInputRef.current?.click()

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await uploadFile(file)
      setProfilePhotoUrl(result.url)
    } catch {
      toast.error("Failed to upload photo")
    }
    e.target.value = ""
  }

  const handleUpdateProfile = async (values: AccountProfileFormValues) => {
    try {
      const response = await updateMyProfile({
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        username: values.username || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        gender: values.gender || undefined,
        profilePhotoUrl: profilePhotoUrl || undefined,
      })
      if (response?.status === "SUCCESS" && response.data) {
        localStorage.setItem("doctor", JSON.stringify(response.data))
        window.dispatchEvent(new Event("auth-user-updated"))
        initial.current = {
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          username: values.username || "",
          dateOfBirth: values.dateOfBirth || "",
          gender: values.gender || "",
          profilePhotoUrl: profilePhotoUrl || "",
        }
        toast.success("Profile updated")
        return
      }

      toast.error(response?.messages?.[0]?.text || "Could not update profile")
    } catch {
      toast.error("Could not update profile")
    }
  }

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    try {
      const response = await changePassword(values.currentPassword, values.newPassword)
      if (response?.status === "SUCCESS") {
        passwordForm.reset()
        toast.success("Password changed successfully")
        return
      }

      toast.error(response?.messages?.[0]?.text || "Could not change password")
    } catch {
      toast.error("Could not change password")
    }
  }

  const profileErrors = profileForm.formState.errors
  const passwordErrors = passwordForm.formState.errors
  const errorInputClass = "border-red-500 focus-visible:ring-red-300"

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
          <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4" noValidate>
            <div className="flex items-center gap-6">
              <button type="button" onClick={handlePhotoPick} className="relative shrink-0 group">
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
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Pencil className="h-5 w-5 text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </button>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{doctor?.name || "User"}</p>
                <p>{doctor?.email}</p>
                {doctor?.departments?.[0] && (
                  <p className="text-xs mt-0.5">{doctor.departments[0].name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Input
                  placeholder="Full name"
                  {...profileForm.register("name")}
                  className={profileErrors.name ? errorInputClass : ""}
                />
                <FieldError message={profileErrors.name?.message} />
              </div>
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  {...profileForm.register("email")}
                  onChange={(e) => profileForm.setValue("email", sanitizeEmailInput(e.target.value))}
                  className={profileErrors.email ? errorInputClass : ""}
                />
                <FieldError message={profileErrors.email?.message} />
              </div>
              <div>
                <Input
                  placeholder="Phone number"
                  {...profileForm.register("phoneNumber")}
                  onChange={(e) => profileForm.setValue("phoneNumber", sanitizePhoneInput(e.target.value))}
                  className={profileErrors.phoneNumber ? errorInputClass : ""}
                />
                <FieldError message={profileErrors.phoneNumber?.message} />
              </div>
              <div>
                <Input placeholder="Username" {...profileForm.register("username")} />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="Date of birth"
                  {...profileForm.register("dateOfBirth")}
                  className="[color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <select
                  {...profileForm.register("gender")}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Select gender</option>
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-3">
                <Button type="submit" className="rounded-full" disabled={updatingProfile}>
                  {updatingProfile ? "Updating..." : "Update Profile"}
                </Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={discard} disabled={updatingProfile}>
                  Discard
                </Button>
              </div>
            )}
          </form>
        </section>

        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Input
                  type="password"
                  placeholder="Current password"
                  {...passwordForm.register("currentPassword")}
                  className={passwordErrors.currentPassword ? errorInputClass : ""}
                />
                <FieldError message={passwordErrors.currentPassword?.message} />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="New password"
                  {...passwordForm.register("newPassword")}
                  className={passwordErrors.newPassword ? errorInputClass : ""}
                />
                <FieldError message={passwordErrors.newPassword?.message} />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...passwordForm.register("confirmPassword")}
                  className={passwordErrors.confirmPassword ? errorInputClass : ""}
                />
                <FieldError message={passwordErrors.confirmPassword?.message} />
              </div>
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
