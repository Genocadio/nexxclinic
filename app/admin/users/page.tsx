"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import {
  useUsers,
  useAdminCreateUser,
  useActivateUser,
  useDeactivateUser,
  useUpdateUserRoles,
  useAdminUpdateUser,
  useDeleteUserPassword,
  useDepartments,
  type UserAccount,
} from "@/hooks/auth-hooks"
import { ArrowLeft, LockKeyhole, Pencil, Power, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { ADMIN_ROLE, canManageAdminUsers, hasAdminAccess, isManagerWithoutAdmin } from "@/lib/role-utils"

const ALL_ROLES = ["ADMIN", "MANAGER", "RECEPTIONIST", "OPHTHALMOLOGIST", "NURSE", "DOCTOR", "SPECIALIST", "FINANCE"]

const roleDisallowsTitle = (roles: string[]) => {
  if (roles.includes("RECEPTIONIST") || roles.includes("FINANCE")) return true
  return roles.length === 1 && roles[0] === "ADMIN"
}

export default function ManageUsersPage() {
  const { doctor } = useAuth()
  const router = useRouter()
  const { users, loading, error, refetch } = useUsers()
  const { departments } = useDepartments()
  const { adminCreateUser, loading: creating } = useAdminCreateUser()
  const { activateUser, loading: activating } = useActivateUser()
  const { deactivateUser, loading: deactivating } = useDeactivateUser()
  const { updateUserRoles, loading: updatingRoles } = useUpdateUserRoles()
  const { adminUpdateUser, loading: updatingUser } = useAdminUpdateUser()
  const { deleteUserPassword, loading: forcingReset } = useDeleteUserPassword()

  const [query, setQuery] = useState("")
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [title, setTitle] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["DOCTOR"])
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([])

  const isBusy = creating || activating || deactivating || updatingRoles || updatingUser || forcingReset

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
      const pool = [u.name, u.email, u.phoneNumber, u.title || "", ...(u.roles || []), ...(u.departments?.map((d) => d.name) || [])]
      return pool.some((v) => v.toLowerCase().includes(q))
    })
  }, [query, users])

  const titleAllowedForSelectedRoles = !roleDisallowsTitle(selectedRoles)

  useEffect(() => {
    if (!titleAllowedForSelectedRoles && title) {
      setTitle("")
    }
  }, [titleAllowedForSelectedRoles, title])

  const resetForm = () => {
    setEditingUserId(null)
    setName("")
    setEmail("")
    setPhoneNumber("")
    setTitle("")
    setSelectedRoles(["DOCTOR"])
    setSelectedDepartmentIds([])
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
    setName(user.name || "")
    setEmail(user.email || "")
    setPhoneNumber(user.phoneNumber || "")
    const nextRoles = user.roles?.length ? user.roles : ["DOCTOR"]
    setSelectedRoles(nextRoles)
    setTitle(roleDisallowsTitle(nextRoles) ? "" : (user.title || ""))
    setSelectedDepartmentIds((user.departments || []).map((d) => d.id))
  }

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) => {
      const exists = prev.includes(role)
      if (exists) {
        const next = prev.filter((r) => r !== role)
        return next.length ? next : prev
      }
      return [...prev, role]
    })
  }

  const toggleDepartment = (departmentId: string) => {
    setSelectedDepartmentIds((prev) => {
      if (prev.includes(departmentId)) {
        return prev.filter((id) => id !== departmentId)
      }
      return [...prev, departmentId]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !phoneNumber || selectedRoles.length === 0) {
      toast.error("Name, phone number, and at least one role are required")
      return
    }

    if (!editingUserId && !email) {
      toast.error("Email is required for new users")
      return
    }

    try {
      const sanitizedTitle = titleAllowedForSelectedRoles ? title : ""

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

        const updateResp = await adminUpdateUser({
          userId: editingUserId,
          name,
          phoneNumber,
          title: sanitizedTitle,
          departmentIds: selectedDepartmentIds,
        })

        if (updateResp?.status !== "SUCCESS") {
          toast.error(updateResp?.messages?.[0]?.text || "Could not update user details")
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
          name,
          email,
          phoneNumber,
          title: sanitizedTitle,
          roles: selectedRoles,
          departmentIds: selectedDepartmentIds,
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

    try {
      const response = user.active ? await deactivateUser(user.id) : await activateUser(user.id)
      if (response?.status !== "SUCCESS") {
        toast.error(response?.messages?.[0]?.text || "Could not update activation")
        return
      }
      toast.success(user.active ? "User deactivated" : "User activated")
      await refetch()
    } catch {
      toast.error("Could not update activation")
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
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground">
              {managerLimitedMode
                ? "Manage non-admin users. Admin users are visible but read-only."
                : "Create users, activate/deactivate, update roles and profile fields."}
            </p>
          </div>
        </div>

        <section className="bg-card/70 dark:bg-slate-900/70 backdrop-blur-xl border border-border/50 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{editingUserId ? "Edit User" : "Create User"}</h2>
            {editingUserId && (
              <Button variant="outline" className="rounded-full" onClick={resetForm} disabled={isBusy}>
                Cancel Edit
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={Boolean(editingUserId)}
              />
              <Input placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              {titleAllowedForSelectedRoles ? (
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              ) : (
                <div className="md:col-span-1 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                  Title is not allowed for selected roles.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Roles</p>
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
                      className={`px-3 h-8 rounded-full border text-xs font-semibold transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/60"
                      }`}
                    >
                      {role}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Departments</p>
              <div className="flex flex-wrap gap-2">
                {departments.map((department) => {
                  const selected = selectedDepartmentIds.includes(String(department.id))
                  return (
                    <button
                      key={department.id}
                      type="button"
                      onClick={() => toggleDepartment(String(department.id))}
                      className={`px-3 h-8 rounded-full border text-xs font-semibold transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-foreground border-border hover:border-primary/60"
                      }`}
                    >
                      {department.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button type="submit" className="rounded-full" disabled={isBusy}>
              {editingUserId ? (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Update User
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </form>
        </section>

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
            <p className="text-sm text-destructive">{String(error.message || error)}</p>
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
                      <p className="font-semibold text-foreground">{user.name}</p>
                      {selfUser && (
                        <span className="px-2 h-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs inline-flex items-center">
                          You
                        </span>
                      )}
                      <span className={`px-2 h-6 rounded-full border text-xs inline-flex items-center ${userIsAdmin ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                        {userIsAdmin ? "Admin" : "Non-admin"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email} • {user.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.title || "No title"}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(user.roles || []).map((role) => (
                        <span key={`${user.id}-${role}`} className="px-2 h-6 rounded-full border border-border text-xs inline-flex items-center">
                          {role}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Departments: {(user.departments || []).map((d) => d.name).join(", ") || "None"}
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleToggleActive(user)}
                      disabled={isBusy || !canManageThisUser}
                    >
                      <Power className="h-3.5 w-3.5 mr-1" />
                      {user.active ? "Deactivate" : "Activate"}
                    </Button>
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
