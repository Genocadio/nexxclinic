"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  useUsers,
  useAdminCreateUser,
  useActivateUser,
  useDeactivateUser,
  useUpdateUserRoles,
  useDeleteUserPassword,
  useDepartments,
  type UserAccount,
} from "@/hooks/auth-hooks"
import { ArrowLeft, LockKeyhole, Pencil, Power, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { ADMIN_ROLE, canManageAdminUsers, hasAdminAccess, isManagerWithoutAdmin } from "@/lib/role-utils"
import { sanitizeEmailInput, sanitizePhoneInput } from "@/lib/validation-utils"

const ALL_ROLES = ["ADMIN", "MANAGER", "CLINIC_ADMIN", "FINANCE", "STAFF", "RECEPTION", "NURSE", "CLINICIAN"]


export default function ManageUsersPage() {
  const { doctor } = useAuth()
  const router = useRouter()
  const { users, loading, error, refetch } = useUsers()
  const { departments } = useDepartments()
  const { adminCreateUser, loading: creating } = useAdminCreateUser()
  const { activateUser, loading: activating } = useActivateUser()
  const { deactivateUser, loading: deactivating } = useDeactivateUser()
  const { updateUserRoles, loading: updatingRoles } = useUpdateUserRoles()
  const { deleteUserPassword, loading: forcingReset } = useDeleteUserPassword()

  const [query, setQuery] = useState("")
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gender, setGender] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [username, setUsername] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [activationUser, setActivationUser] = useState<UserAccount | null>(null)
  const [activationRoles, setActivationRoles] = useState<string[]>([])

  const isBusy = creating || activating || deactivating || updatingRoles || forcingReset

  const currentUserRoles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[]
  const canAccessUserManagement = hasAdminAccess(currentUserRoles)
  const canManageAdminUserAccounts = canManageAdminUsers(currentUserRoles)
  const managerLimitedMode = isManagerWithoutAdmin(currentUserRoles)
  const currentUserId = (doctor as unknown as { id?: string } | null)?.id || ""
  const currentUserEmail = (doctor as unknown as { email?: string } | null)?.email?.toLowerCase() || ""

  const isCurrentUser = (user: UserAccount) => {
    if (currentUserId && user.id === currentUserId) return true
    if (currentUserEmail && user.email?.toLowerCase() === currentUserEmail) return true
    return false
  }

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim()
      const pool = [fullName, u.email, u.phoneNumber, ...(u.roles || []), u.department?.name || ""]
      return pool.some((v) => v.toLowerCase().includes(q))
    })
  }, [query, users])

  
  const resetForm = () => {
    setEditingUserId(null)
    setFirstName("")
    setLastName("")
    setEmail("")
    setPhoneNumber("")
    setGender("")
    setDateOfBirth("")
    setProfilePhotoUrl("")
    setUsername("")
    setSelectedRoles([])
    setSelectedDepartmentIds([])
    setModalOpen(false)
  }

  const startEdit = (user: UserAccount) => {
    const userIsAdmin = (user.roles || []).includes(ADMIN_ROLE)

    if (isCurrentUser(user)) {
      toast.info("Edit your own profile from My Account")
      return
    }

    if (userIsAdmin && !canManageAdminUserAccounts) {
      toast.info("You can view admin users but cannot manage them")
      return
    }

    setEditingUserId(user.id)
    setFirstName(user.firstName || "")
    setLastName(user.lastName || "")
    setEmail(user.email || "")
    setPhoneNumber(user.phoneNumber || "")
    setGender(user.gender || "")
    setDateOfBirth(user.dateOfBirth || "")
    setProfilePhotoUrl(user.profilePhotoUrl || "")
    setUsername(user.username || "")
    const nextRoles = user.roles?.length ? user.roles : []
    setSelectedRoles(nextRoles)
    setSelectedDepartmentIds(user.department ? [user.department.id] : [])
    setModalOpen(true)
  }

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) => {
      const exists = prev.includes(role)
      if (exists) {
        return prev.filter((r) => r !== role)
      }
      return [...prev, role]
    })
  }

  const toggleActivationRole = (role: string) => {
    setActivationRoles((prev) => {
      const exists = prev.includes(role)
      if (exists) {
        return prev.filter((r) => r !== role)
      }
      return [...prev, role]
    })
  }

  const toggleDepartment = (departmentId: string) => {
    setSelectedDepartmentIds((prev) => {
      if (prev.includes(departmentId)) {
        return prev.filter((id: string) => id !== departmentId)
      }
      return [...prev, departmentId]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || selectedRoles.length === 0) {
      toast.error("First name and at least one role are required")
      return
    }

    if (!editingUserId && !email) {
      toast.error("Email is required for new users")
      return
    }

    try {

      if (!canManageAdminUserAccounts && selectedRoles.includes(ADMIN_ROLE)) {
        toast.error("Manager cannot assign admin role")
        return
      }

      if (editingUserId) {
        const editingUser = users.find((u) => u.id === editingUserId)
        if ((editingUser && isCurrentUser(editingUser)) || editingUserId === currentUserId) {
          toast.error("You cannot edit your own roles here. Use My Account for profile and password updates.")
          return
        }

        if (editingUser && (editingUser.roles || []).includes(ADMIN_ROLE) && !canManageAdminUserAccounts) {
          toast.error("You can view admin users but cannot manage them")
          return
        }

        const rolesResp = await updateUserRoles(editingUserId, selectedRoles)
        if (rolesResp?.status !== "SUCCESS") {
          toast.error(rolesResp?.messages?.[0]?.text || "Could not update user roles")
          return
        }

        toast.success("User updated")
      } else {
        const createResp = await adminCreateUser({
          firstName,
          lastName,
          email,
          phoneNumber,
          username,
          roles: selectedRoles,
          departmentIds: selectedDepartmentIds,
          gender,
          dateOfBirth,
          profilePhotoUrl,
        })

        if (createResp?.status !== "SUCCESS") {
          toast.error(createResp?.messages?.[0]?.text || "Could not create user")
          return
        }

        toast.success("User created")
      }

      await refetch()
      resetForm()
    } catch {
      toast.error("Could not save user")
    }
  }

  const handleToggleActive = async (user: UserAccount) => {
    const userIsAdmin = (user.roles || []).includes(ADMIN_ROLE)

    if (isCurrentUser(user)) {
      toast.error("You cannot deactivate your own account")
      return
    }

    if (userIsAdmin && !canManageAdminUserAccounts) {
      toast.error("You can view admin users but cannot manage them")
      return
    }

    if (user.accountStatus !== 'ACTIVE') {
      setActivationUser(user)
      setActivationRoles(user.roles || [])
      return
    }

    try {
      const response = await deactivateUser(user.id)
      if (response?.status !== "SUCCESS") {
        toast.error(response?.messages?.[0]?.text || "Could not update activation")
        return
      }
      toast.success("User deactivated")
      await refetch()
    } catch {
      toast.error("Could not update activation")
    }
  }

  const handleConfirmActivation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!activationUser) return

    if (activationRoles.length === 0) {
      toast.error("Select at least one role before activating")
      return
    }

    if (!canManageAdminUserAccounts && activationRoles.includes(ADMIN_ROLE)) {
      toast.error("Manager cannot assign admin role")
      return
    }

    try {
      const response = await activateUser(activationUser.id, activationRoles)
      if (response?.status !== "SUCCESS") {
        toast.error(response?.messages?.[0]?.text || "Could not activate user")
        return
      }

      toast.success("User activated")
      setActivationUser(null)
      setActivationRoles([])
      await refetch()
    } catch {
      toast.error("Could not activate user")
    }
  }

  const handleRequirePasswordSetup = async (user: UserAccount) => {
    const userIsAdmin = (user.roles || []).includes(ADMIN_ROLE)

    if (isCurrentUser(user)) {
      toast.error("Update your own password from My Account")
      return
    }

    if (userIsAdmin && !canManageAdminUserAccounts) {
      toast.error("You can view admin users but cannot manage them")
      return
    }

    try {
      const response = await deleteUserPassword(user.id)
      if (response?.status !== "SUCCESS") {
        toast.error(response?.messages?.[0]?.text || "Could not reset password state")
        return
      }
      toast.success("User will be required to create password at next login")
    } catch {
      toast.error("Could not reset password state")
    }
  }

  if (!canAccessUserManagement) {
    return (
      <div className="min-h-screen bg-background">
        <Header doctor={doctor} />
        <main className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h1 className="text-xl font-semibold text-foreground">Unauthorized</h1>
            <p className="text-sm text-muted-foreground mt-2">Only administrators can access user management.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full flex-shrink-0"
              onClick={() => router.push('/admin')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
              <p className="text-muted-foreground text-sm">
                {managerLimitedMode
                  ? "Manage non-admin users. Admin users are visible but read-only."
                  : "Create users, activate/deactivate, update roles and profile fields."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setModalOpen(true)
            }}
            className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md flex-shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register User
          </Button>
        </div>

        {/* Floating Action Button (FAB) for Mobile/All screens */}
        <div className="fixed bottom-24 right-6 z-[80] md:hidden">
          <Button
            onClick={() => {
              resetForm()
              setModalOpen(true)
            }}
            className="h-12 w-12 rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        {/* Register / Edit User Dialog Modal */}
        <Dialog open={modalOpen} onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) resetForm()
        }}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 rounded-3xl shadow-2xl p-3 flex flex-col">
            <div className="flex-1 overflow-hidden bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {editingUserId ? "Edit User Roles" : "Register New User"}
                </DialogTitle>
                <DialogDescription>
                  {editingUserId ? "Update the roles assigned to this user." : "Fill in the details below to create and register a new system user."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6 my-4 scrollbar-thin">
                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">First Name *</label>
                    <Input placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={Boolean(editingUserId)} className="rounded-xl bg-white dark:bg-slate-950" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
                    <Input placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={Boolean(editingUserId)} className="rounded-xl bg-white dark:bg-slate-950" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Email *</label>
                    <Input
                      placeholder="Enter email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
                      disabled={Boolean(editingUserId)}
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                    <Input placeholder="Enter phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(sanitizePhoneInput(e.target.value))} disabled={Boolean(editingUserId)} className="rounded-xl bg-white dark:bg-slate-950" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      disabled={Boolean(editingUserId)}
                      className="w-full px-3 py-2 border border-border rounded-xl bg-white dark:bg-slate-950 text-foreground h-10 focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Date of Birth</label>
                    <Input
                      placeholder="Date of Birth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={Boolean(editingUserId)}
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Profile Photo URL</label>
                    <Input
                      placeholder="Enter profile photo URL"
                      value={profilePhotoUrl}
                      onChange={(e) => setProfilePhotoUrl(e.target.value)}
                      disabled={Boolean(editingUserId)}
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Username</label>
                    <Input
                      placeholder="Enter unique username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={Boolean(editingUserId)}
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>
                </div>

                {/* Roles Selection */}
                <div className="space-y-2 border-t border-border/30 pt-4">
                  <p className="text-sm font-semibold text-foreground">Roles *</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((role) => {
                      if (role === ADMIN_ROLE && !canManageAdminUserAccounts) {
                        return null
                      }
                      const selected = selectedRoles.includes(role)
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className={`px-4 h-9 rounded-xl border text-xs font-bold transition-all duration-200 ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-white dark:bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/30"
                          }`}
                        >
                          {role}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Departments Selection */}
                <div className="space-y-2 border-t border-border/30 pt-4">
                  <p className="text-sm font-semibold text-foreground">Departments</p>
                  <div className="flex flex-wrap gap-2">
                    {departments.map((department: any) => {
                      const selected = selectedDepartmentIds.includes(String(department.id))
                      return (
                        <button
                          key={department.id}
                          type="button"
                          onClick={() => toggleDepartment(String(department.id))}
                          disabled={Boolean(editingUserId)}
                          className={`px-4 h-9 rounded-xl border text-xs font-bold transition-all duration-200 ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-white dark:bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/30"
                          }`}
                        >
                          {department.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border/30 sticky bottom-0 bg-background/95 dark:bg-slate-900/95 -mx-2 px-2 pb-2">
                  <Button type="button" variant="outline" className="rounded-full px-5" onClick={() => setModalOpen(false)} disabled={isBusy}>
                    Cancel
                  </Button>
                  <Button type="submit" className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md" disabled={isBusy}>
                    {editingUserId ? "Update Roles" : "Register User"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(activationUser)} onOpenChange={(open) => {
          if (!open) {
            setActivationUser(null)
            setActivationRoles([])
          }
        }}>
          <DialogContent className="sm:max-w-xl backdrop-blur-xl bg-white/10 dark:bg-black/25 border border-white/20 rounded-3xl shadow-2xl p-3">
            <div className="bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">Activate User</DialogTitle>
                <DialogDescription>
                  Select the roles to assign before activating {activationUser?.firstName} {activationUser?.lastName}.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleConfirmActivation} className="space-y-5 mt-5">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Roles *</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((role) => {
                      if (role === ADMIN_ROLE && !canManageAdminUserAccounts) {
                        return null
                      }
                      const selected = activationRoles.includes(role)
                      return (
                        <button
                          key={`activate-${role}`}
                          type="button"
                          onClick={() => toggleActivationRole(role)}
                          className={`px-4 h-9 rounded-xl border text-xs font-bold transition-all duration-200 ${
                            selected
                              ? "bg-primary text-primary-foreground border-primary shadow-md"
                              : "bg-white dark:bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/30"
                          }`}
                        >
                          {role}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-5"
                    onClick={() => {
                      setActivationUser(null)
                      setActivationRoles([])
                    }}
                    disabled={isBusy}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md"
                    disabled={isBusy}
                  >
                    Activate User
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Existing Users</h2>
            <Input
              placeholder="Search users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{String(error)}</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const selfUser = isCurrentUser(user)
                const userIsAdmin = (user.roles || []).includes(ADMIN_ROLE)
                const canManageThisUser = !selfUser && (canManageAdminUserAccounts || !userIsAdmin)

                return (
                <div
                  key={user.id}
                  className="rounded-xl border border-border/50 bg-background/50 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <p className="font-semibold text-foreground">{user.firstName} {user.lastName}</p>
                      {selfUser && (
                        <span className="px-2 h-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs inline-flex items-center">
                          You
                        </span>
                      )}
                      <span className={`px-2 h-6 rounded-full border text-xs inline-flex items-center ${userIsAdmin ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                        {userIsAdmin ? "Admin" : "Non-admin"}
                      </span>
                      <span className={`px-2 h-6 rounded-full border text-xs inline-flex items-center ${
                        user.accountStatus === 'ACTIVE' 
                          ? "border-green-500/30 bg-green-500/10 text-green-700" 
                          : user.accountStatus === 'PENDING' 
                          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-700"
                          : "border-red-500/30 bg-red-500/10 text-red-700"
                      }`}>
                        {user.accountStatus}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email} • {user.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">Username: {user.username || "Not set"}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(user.roles || []).map((role) => (
                        <span key={`${user.id}-${role}`} className="px-2 h-6 rounded-full border border-border text-xs inline-flex items-center">
                          {role}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Department: {user.department?.name || "None"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => startEdit(user)}
                      disabled={isBusy || !canManageThisUser}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                    {!selfUser && user.accountStatus === 'ACTIVE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleToggleActive(user)}
                        disabled={isBusy || !canManageThisUser}
                      >
                        <Power className="h-3.5 w-3.5 mr-1" />
                        Deactivate
                      </Button>
                    )}
                    {!selfUser && user.accountStatus !== 'ACTIVE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleToggleActive(user)}
                        disabled={isBusy || !canManageThisUser}
                      >
                        <Power className="h-3.5 w-3.5 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleRequirePasswordSetup(user)}
                      disabled={isBusy || !canManageThisUser}
                    >
                      <LockKeyhole className="h-3.5 w-3.5 mr-1" />
                      Require Password Setup
                    </Button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
