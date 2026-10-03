"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/header";
import { useAuth } from "@/lib/auth-context";
import {
  useUsers,
  useAdminCreateUser,
  useAdminUpdateUser,
  useActivateUser,
  useDeactivateUser,
  useDeleteUserPassword,
  useDepartments,
  type UserAccount,
} from "@/hooks/auth-hooks";
import { AccountStatus, RoleName } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { MediaUploader } from "@/components/ui/media-uploader";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import {
  ADMIN_ROLE,
  canManageAdminUsers,
  hasAdminAccess,
  isManagerWithoutAdmin,
} from "@/lib/role-utils";
import {
  createUserFormSchema,
  type UserFormValues,
} from "@/lib/form-schemas";
import { useDebouncedValidation } from "@/hooks/use-debounced-validation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Power,
  LockKeyhole,
  Users,
  UserCheck,
  Building2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Search,
  Activity,
  ArrowRight,
  SlidersHorizontal,
  HeartPulse,
  Stethoscope,
  Key,
  Check,
  X,
  Info,
} from "lucide-react";

const ALL_ROLES = [
  "ADMIN",
  "MANAGER",
  "CLINIC_ADMIN",
  "FINANCE",
  "STAFF",
  "RECEPTION",
  "NURSE",
  "CLINICIAN",
] as const;

const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: "Full clinic management, user accounts, and system configuration.",
  MANAGER: "Clinical operational management and reporting without full system admin access.",
  CLINIC_ADMIN: "Administrative coordination and operational approvals.",
  FINANCE: "Patient invoices, billing management, and payment validation.",
  STAFF: "General hospital operational and administrative support.",
  RECEPTION: "Patient check-in, visit routing, and patient registration.",
  NURSE: "Triage queue, vital signs recording, and bedside observation notes.",
  CLINICIAN: "Physician consultations, medical diagnostics, prescriptions, and order requests.",
};

function getRoleBadgeConfig(role: string) {
  switch (role) {
    case "ADMIN":
      return {
        badgeClass: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
        containerClass: "bg-red-500/10 text-red-600 dark:text-red-400",
      };
    case "CLINICIAN":
      return {
        badgeClass: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20",
        containerClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
      };
    case "NURSE":
      return {
        badgeClass: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        containerClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    case "RECEPTION":
      return {
        badgeClass: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20",
        containerClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      };
    case "FINANCE":
      return {
        badgeClass: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
        containerClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    case "MANAGER":
    case "CLINIC_ADMIN":
      return {
        badgeClass: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        containerClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      };
    default:
      return {
        badgeClass: "bg-muted text-muted-foreground border-border",
        containerClass: "bg-primary/10 text-primary",
      };
  }
}

function UserCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 flex flex-col justify-between space-y-4 animate-pulse shadow-xs">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-3 w-1/3 rounded-md" />
            </div>
          </div>
          <Skeleton className="size-8 rounded-full shrink-0" />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Skeleton className="h-3 w-28 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    </div>
  );
}

export default function ManageUsersPage() {
  const router = useRouter();
  const { doctor } = useAuth();

  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers();
  const { departments } = useDepartments();

  const { adminCreateUser, loading: creating } = useAdminCreateUser();
  const { adminUpdateUser, loading: updating } = useAdminUpdateUser();
  const { activateUser, loading: activating } = useActivateUser();
  const { deactivateUser, loading: deactivating } = useDeactivateUser();
  const { deleteUserPassword, loading: forcingReset } = useDeleteUserPassword();

  const [saving, setSaving] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Selection & Tabs state
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Workspace Profile Form state
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [editProfilePhotoUrl, setEditProfilePhotoUrl] = useState("");
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [editDepartmentIds, setEditDepartmentIds] = useState<string[]>([]);

  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createProfilePhotoUrl, setCreateProfilePhotoUrl] = useState("");
  const [createDepartmentIds, setCreateDepartmentIds] = useState<string[]>([]);

  // Activation Dialog state
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [activationTargetUser, setActivationTargetUser] = useState<UserAccount | null>(null);
  const [activationRoles, setActivationRoles] = useState<string[]>([]);
  const [activationRoleError, setActivationRoleError] = useState("");

  // Deactivate Confirmation state
  const [deactivateConfirmOpen, setDeactivateConfirmOpen] = useState(false);
  const [deactivateTargetUser, setDeactivateTargetUser] = useState<UserAccount | null>(null);

  // Password reset confirmation
  const [passwordResetConfirmOpen, setPasswordResetConfirmOpen] = useState(false);

  // Debounced search-as-you-type
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auth permissions
  const currentUserRoles = ((doctor as unknown as { roles?: string[] } | null)
    ?.roles || []) as string[];
  const canManageAdminUserAccounts = canManageAdminUsers(currentUserRoles);
  const currentUserId = (doctor as unknown as { id?: string } | null)?.id || "";
  const currentUserEmail =
    (doctor as unknown as { email?: string } | null)?.email?.toLowerCase() || "";

  const isCurrentUser = (user: UserAccount) => {
    if (currentUserId && user.id === currentUserId) return true;
    if (currentUserEmail && user.email?.toLowerCase() === currentUserEmail)
      return true;
    return false;
  };

  // Create Form Hook
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreateForm,
    setValue: setCreateValue,
    watch: watchCreate,
    control: controlCreate,
    trigger: triggerCreate,
    formState: { errors: createErrors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(createUserFormSchema({ requireProfileFields: true })),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
      username: "",
      roles: [],
    },
  });

  useDebouncedValidation({ control: controlCreate, trigger: triggerCreate });
  const watchedCreateRoles = watchCreate("roles") || [];

  // Quick stats
  const stats = useMemo(() => {
    const total = users.length;
    const activeCount = users.filter((u) => u.accountStatus === "ACTIVE").length;
    const clinicianCount = users.filter((u) =>
      ((u.roles || []) as string[]).includes("CLINICIAN"),
    ).length;
    const nursingAndOpsCount = users.filter((u) =>
      ((u.roles || []) as string[]).some((r) =>
        ["NURSE", "RECEPTION", "STAFF"].includes(r),
      ),
    ).length;
    return { total, activeCount, clinicianCount, nursingAndOpsCount };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (
        roleFilter !== "ALL" &&
        !((u.roles || []) as string[]).includes(roleFilter)
      ) {
        return false;
      }
      // Status filter
      if (statusFilter !== "ALL" && u.accountStatus !== statusFilter) {
        return false;
      }
      // Search query
      if (debouncedQuery) {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        const email = (u.email || "").toLowerCase();
        const username = (u.username || "").toLowerCase();
        const phone = (u.phoneNumber || "").toLowerCase();
        const departmentNames = (u.departments || [])
          .map((d) => d.name.toLowerCase())
          .join(" ");
        const roles = (u.roles || []).map((r) => r.toLowerCase()).join(" ");

        if (
          !fullName.includes(debouncedQuery) &&
          !email.includes(debouncedQuery) &&
          !username.includes(debouncedQuery) &&
          !phone.includes(debouncedQuery) &&
          !departmentNames.includes(debouncedQuery) &&
          !roles.includes(debouncedQuery)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [users, debouncedQuery, roleFilter, statusFilter]);

  // Select a user into workspace
  const handleSelectUser = (user: UserAccount, tab: string = "profile") => {
    setSelectedUser(user);
    setActiveTab(tab);
    setEditFirstName(user.firstName || "");
    setEditLastName(user.lastName || "");
    setEditEmail(user.email || "");
    setEditPhoneNumber(user.phoneNumber || "");
    setEditUsername(user.username || "");
    setEditGender(user.gender || "");
    setEditDateOfBirth(user.dateOfBirth || "");
    setEditProfilePhotoUrl(user.profilePhotoUrl || "");
    setEditRoles(user.roles || []);
    setEditDepartmentIds((user.departments || []).map((d) => d.id));
  };

  const handleBackToCatalog = () => {
    setSelectedUser(null);
  };

  // Toggle role in workspace
  const toggleEditRole = (role: string) => {
    setEditRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  // Toggle department in workspace
  const toggleEditDepartment = (departmentId: string) => {
    setEditDepartmentIds((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId],
    );
  };

  // Toggle role in create modal
  const toggleCreateRole = (role: string) => {
    const next = watchedCreateRoles.includes(role)
      ? watchedCreateRoles.filter((r) => r !== role)
      : [...watchedCreateRoles, role];
    setCreateValue("roles", next, { shouldValidate: true });
  };

  // Toggle department in create modal
  const toggleCreateDepartment = (departmentId: string) => {
    setCreateDepartmentIds((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId],
    );
  };

  // Save Profile Changes
  const handleSaveProfile = async () => {
    if (!selectedUser) return;
    if (!editFirstName.trim()) {
      toast.error("First name is required");
      return;
    }

    setSaving(true);
    try {
      const resp = await adminUpdateUser(selectedUser.id, {
        firstName: editFirstName.trim(),
        lastName: editLastName.trim(),
        email: editEmail.trim(),
        phoneNumber: editPhoneNumber.trim(),
        username: editUsername.trim(),
        gender: editGender || undefined,
        dateOfBirth: editDateOfBirth || undefined,
        profilePhotoUrl: editProfilePhotoUrl || undefined,
        roles: editRoles as RoleName[],
        departmentIds: editDepartmentIds,
      });

      if (resp?.status === "SUCCESS") {
        toast.success("User profile updated successfully!");
        await refetchUsers();
        setSelectedUser({
          ...selectedUser,
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          email: editEmail.trim(),
          phoneNumber: editPhoneNumber.trim(),
          username: editUsername.trim(),
          gender: editGender,
          dateOfBirth: editDateOfBirth,
          profilePhotoUrl: editProfilePhotoUrl,
          roles: editRoles as RoleName[],
        });
      } else {
        toast.error(resp?.messages?.[0]?.text || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Save Role Changes
  const handleSaveRoles = async () => {
    if (!selectedUser) return;
    if (editRoles.length === 0) {
      toast.error("User must have at least one role");
      return;
    }

    if (!canManageAdminUserAccounts && editRoles.includes(ADMIN_ROLE)) {
      toast.error("Manager cannot assign admin role");
      return;
    }

    setSaving(true);
    try {
      const resp = await adminUpdateUser(selectedUser.id, {
        firstName: selectedUser.firstName ?? undefined,
        lastName: selectedUser.lastName ?? undefined,
        email: selectedUser.email ?? undefined,
        phoneNumber: selectedUser.phoneNumber ?? undefined,
        username: selectedUser.username ?? undefined,
        gender: selectedUser.gender ?? undefined,
        dateOfBirth: selectedUser.dateOfBirth ?? undefined,
        profilePhotoUrl: selectedUser.profilePhotoUrl ?? undefined,
        roles: editRoles as RoleName[],
        departmentIds: editDepartmentIds,
      });

      if (resp?.status === "SUCCESS") {
        toast.success("Role assignments updated successfully!");
        await refetchUsers();
        setSelectedUser({
          ...selectedUser,
          roles: editRoles as RoleName[],
        });
      } else {
        toast.error(resp?.messages?.[0]?.text || "Failed to update roles");
      }
    } catch {
      toast.error("Failed to update roles");
    } finally {
      setSaving(false);
    }
  };

  // Save Department Changes
  const handleSaveDepartments = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      const resp = await adminUpdateUser(selectedUser.id, {
        firstName: selectedUser.firstName ?? undefined,
        lastName: selectedUser.lastName ?? undefined,
        email: selectedUser.email ?? undefined,
        phoneNumber: selectedUser.phoneNumber ?? undefined,
        username: selectedUser.username ?? undefined,
        gender: selectedUser.gender ?? undefined,
        dateOfBirth: selectedUser.dateOfBirth ?? undefined,
        profilePhotoUrl: selectedUser.profilePhotoUrl ?? undefined,
        roles: editRoles as RoleName[],
        departmentIds: editDepartmentIds,
      });

      if (resp?.status === "SUCCESS") {
        toast.success("Department assignments updated successfully!");
        await refetchUsers();
        const updatedDepts = departments.filter((d) =>
          editDepartmentIds.includes(d.id),
        );
        setSelectedUser({
          ...selectedUser,
          departments: updatedDepts,
        });
      } else {
        toast.error(
          resp?.messages?.[0]?.text || "Failed to update department assignments",
        );
      }
    } catch {
      toast.error("Failed to update department assignments");
    } finally {
      setSaving(false);
    }
  };

  // Handle Create User
  const handleCreateUser = async (values: UserFormValues) => {
    setSaving(true);
    try {
      if (!canManageAdminUserAccounts && watchedCreateRoles.includes(ADMIN_ROLE)) {
        toast.error("Manager cannot assign admin role");
        return;
      }

      const createResp = await adminCreateUser({
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim(),
        email: values.email?.trim(),
        phoneNumber: values.phoneNumber?.trim(),
        username: values.username?.trim(),
        roles: watchedCreateRoles,
        departmentIds: createDepartmentIds,
        gender: values.gender || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        profilePhotoUrl: createProfilePhotoUrl || undefined,
      });

      if (createResp?.status === "SUCCESS") {
        toast.success("User created successfully!");
        resetCreateForm();
        setCreateProfilePhotoUrl("");
        setCreateDepartmentIds([]);
        setIsCreateModalOpen(false);
        await refetchUsers();
      } else {
        toast.error(createResp?.messages?.[0]?.text || "Could not create user");
      }
    } catch {
      toast.error("Could not create user");
    } finally {
      setSaving(false);
    }
  };

  // Open activation dialog
  const openActivateModal = (user: UserAccount) => {
    setActivationTargetUser(user);
    setActivationRoles(user.roles || []);
    setActivationRoleError("");
    setActivationModalOpen(true);
  };

  // Confirm activation
  const handleConfirmActivation = async () => {
    if (!activationTargetUser) return;
    if (activationRoles.length === 0) {
      setActivationRoleError("Select at least one role before activating");
      return;
    }

    setSaving(true);
    try {
      const resp = await activateUser(activationTargetUser.id, activationRoles);
      if (resp?.status === "SUCCESS") {
        toast.success("User account activated successfully!");
        await refetchUsers();
        if (selectedUser && selectedUser.id === activationTargetUser.id) {
          setSelectedUser({
            ...selectedUser,
            accountStatus: AccountStatus.ACTIVE,
            roles: activationRoles as RoleName[],
          });
        }
        setActivationModalOpen(false);
        setActivationTargetUser(null);
      } else {
        toast.error(resp?.messages?.[0]?.text || "Could not activate user");
      }
    } catch {
      toast.error("Could not activate user");
    } finally {
      setSaving(false);
    }
  };

  // Confirm deactivation
  const handleConfirmDeactivation = async () => {
    const target = deactivateTargetUser || selectedUser;
    if (!target) return;

    if (isCurrentUser(target)) {
      toast.error("You cannot deactivate your own account");
      return;
    }

    setSaving(true);
    try {
      const resp = await deactivateUser(target.id);
      if (resp?.status === "SUCCESS") {
        toast.success("User account deactivated successfully!");
        await refetchUsers();
        if (selectedUser && selectedUser.id === target.id) {
          setSelectedUser({
            ...selectedUser,
            accountStatus: AccountStatus.DISABLED,
          });
        }
        setDeactivateConfirmOpen(false);
        setDeactivateTargetUser(null);
      } else {
        toast.error(resp?.messages?.[0]?.text || "Could not deactivate user");
      }
    } catch {
      toast.error("Could not deactivate user");
    } finally {
      setSaving(false);
    }
  };

  // Force password setup
  const handleForcePasswordSetup = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      const resp = await deleteUserPassword(selectedUser.id);
      if (resp?.status === "SUCCESS") {
        toast.success(
          "Password reset required. The user will be prompted to set a new password on next login.",
        );
        setPasswordResetConfirmOpen(false);
        await refetchUsers();
      } else {
        toast.error(
          resp?.messages?.[0]?.text || "Could not require password setup",
        );
      }
    } catch {
      toast.error("Could not require password setup");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header doctor={doctor} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {!selectedUser ? (
          /* ========================================================================= */
          /* VIEW A: USERS CATALOG & GRID VIEW                                        */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Top Navigation & Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={() => router.push("/admin")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    User & Staff Management
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Configure staff accounts, clinical roles, department memberships, and security credentials.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  resetCreateForm();
                  setCreateProfilePhotoUrl("");
                  setCreateDepartmentIds([]);
                  setIsCreateModalOpen(true);
                }}
                className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium px-5"
              >
                <Plus className="h-4 w-4 mr-2" /> Add User
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Staff
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.total}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Registered accounts
                </p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5" /> Active Accounts
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.activeCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ready for login
                </p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope className="h-3.5 w-3.5" /> Clinicians & Doctors
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.clinicianCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Physicians & surgeons
                </p>
              </div>
              <div className="rounded-xl border bg-card/70 p-4 shadow-xs">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <HeartPulse className="h-3.5 w-3.5" /> Nursing & Operations
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {stats.nursingAndOpsCount}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nurses, reception & staff
                </p>
              </div>
            </div>

            {/* Search & Filter Bar (Centered) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search staff by name, email, or role..."
                  className="pl-9 rounded-xl bg-card w-full shadow-xs"
                />
              </div>

              <div className="w-full sm:w-48 shrink-0">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="rounded-xl bg-card shadow-xs">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    {ALL_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full sm:w-44 shrink-0">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="rounded-xl bg-card shadow-xs">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* User Cards Grid */}
            {usersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, idx) => (
                  <UserCardSkeleton key={idx} />
                ))}
              </div>
            ) : usersError ? (
              <div className="text-center py-12 border border-destructive/20 rounded-2xl bg-destructive/5 space-y-2">
                <ShieldAlert className="h-8 w-8 text-destructive mx-auto" />
                <p className="text-sm font-semibold text-destructive">
                  Error loading staff accounts
                </p>
                <p className="text-xs text-muted-foreground">{usersError}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16 border border-dashed rounded-2xl bg-muted/10 space-y-3">
                <Users className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-semibold">No staff accounts found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL"
                    ? "No staff match your search or filter criteria."
                    : "Get started by adding your first user account."}
                </p>
                {!searchQuery && roleFilter === "ALL" && statusFilter === "ALL" && (
                  <Button
                    onClick={() => {
                      resetCreateForm();
                      setIsCreateModalOpen(true);
                    }}
                    size="sm"
                    className="rounded-full mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Add First User
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredUsers.map((user) => {
                  const selfUser = isCurrentUser(user);
                  const userRoles = user.roles || [];
                  const primaryRole = userRoles[0] || "STAFF";
                  const roleConfig = getRoleBadgeConfig(primaryRole);
                  const deptCount = (user.departments || []).length;
                  const isActive = user.accountStatus === "ACTIVE";
                  const isPending = user.accountStatus === "PENDING";

                  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelectUser(user, "profile")}
                      className="group relative rounded-2xl border border-border/70 bg-card hover:bg-card/90 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header & Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {user.profilePhotoUrl ? (
                              <img
                                src={user.profilePhotoUrl}
                                alt={user.firstName}
                                className="size-10 rounded-xl object-cover shrink-0 border"
                              />
                            ) : (
                              <div
                                className={cn(
                                  "size-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                                  roleConfig.containerClass,
                                )}
                              >
                                {initials}
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate">
                                  {user.firstName} {user.lastName}
                                </h3>
                                {selfUser && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-4 border-primary/40 text-primary font-bold"
                                  >
                                    You
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email || user.username || "—"}
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full shrink-0"
                              >
                                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleSelectUser(user, "profile")}
                              >
                                <Settings className="h-4 w-4 mr-2" /> Profile & Contact
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSelectUser(user, "roles")}
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" /> Roles ({userRoles.length})
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSelectUser(user, "departments")
                                }
                              >
                                <Building2 className="h-4 w-4 mr-2" /> Departments ({deptCount})
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleSelectUser(user, "security")
                                }
                              >
                                <LockKeyhole className="h-4 w-4 mr-2" /> Security & Access
                              </DropdownMenuItem>

                              {!selfUser && (
                                <>
                                  {isActive ? (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeactivateTargetUser(user);
                                        setDeactivateConfirmOpen(true);
                                      }}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Power className="h-4 w-4 mr-2" /> Deactivate User
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openActivateModal(user);
                                      }}
                                      className="text-emerald-600 focus:text-emerald-600"
                                    >
                                      <Power className="h-4 w-4 mr-2" /> Activate User
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Status & Role Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[11px] gap-1",
                              isActive
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                : isPending
                                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                                  : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
                            )}
                          >
                            <span
                              className={cn(
                                "size-1.5 rounded-full",
                                isActive
                                  ? "bg-emerald-500"
                                  : isPending
                                    ? "bg-amber-500"
                                    : "bg-red-500",
                              )}
                            />
                            {user.accountStatus}
                          </Badge>

                          {userRoles.slice(0, 2).map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className={cn(
                                "text-[11px]",
                                getRoleBadgeConfig(role).badgeClass,
                              )}
                            >
                              {role}
                            </Badge>
                          ))}
                          {userRoles.length > 2 && (
                            <Badge variant="outline" className="text-[11px]">
                              +{userRoles.length - 2} more
                            </Badge>
                          )}
                        </div>

                        {/* Assigned Departments Preview */}
                        <p className="text-xs text-muted-foreground truncate pt-1">
                          <Building2 className="h-3 w-3 inline mr-1 text-muted-foreground/70" />
                          {deptCount > 0
                            ? (user.departments || [])
                                .map((d) => d.name)
                                .join(", ")
                            : "No assigned departments"}
                        </p>
                      </div>

                      {/* Footer & Manage */}
                      <div className="flex items-center justify-between pt-4 mt-3 border-t border-border/50 text-xs text-muted-foreground">
                        <span>{user.phoneNumber || "No phone"}</span>

                        <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Manage <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW B: DEDICATED FULL-SCREEN USER TABBED WORKSPACE                      */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Top Workspace Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToCatalog}
                  className="rounded-full shrink-0 gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" /> All Users
                </Button>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h1>

                    {isCurrentUser(selectedUser) && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-bold">
                        You
                      </Badge>
                    )}

                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs gap-1",
                        selectedUser.accountStatus === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          : selectedUser.accountStatus === "PENDING"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20"
                            : "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/20",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          selectedUser.accountStatus === "ACTIVE"
                            ? "bg-emerald-500"
                            : selectedUser.accountStatus === "PENDING"
                              ? "bg-amber-500"
                              : "bg-red-500",
                        )}
                      />
                      {selectedUser.accountStatus}
                    </Badge>

                    {(selectedUser.roles || []).map((role) => (
                      <Badge
                        key={role}
                        variant="secondary"
                        className={cn("text-xs", getRoleBadgeConfig(role).badgeClass)}
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure staff profile details, role permissions, clinical departments, and access controls.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Tabs Container */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="bg-muted/60 p-1 rounded-xl h-auto grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-2xl">
                <TabsTrigger
                  value="profile"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <Settings className="h-4 w-4" />
                  Profile & Contact
                </TabsTrigger>
                <TabsTrigger
                  value="roles"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Roles
                  {(selectedUser.roles || []).length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-[10px] px-1.5 py-0 h-4"
                    >
                      {(selectedUser.roles || []).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="departments"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <Building2 className="h-4 w-4" />
                  Departments
                  {(selectedUser.departments || []).length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-[10px] px-1.5 py-0 h-4"
                    >
                      {(selectedUser.departments || []).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-lg py-2.5 text-xs sm:text-sm font-medium gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
                >
                  <LockKeyhole className="h-4 w-4" />
                  Security & Access
                </TabsTrigger>
              </TabsList>

              {/* ------------------------------------------------------------- */}
              {/* TAB 1: PROFILE & CONTACT                                      */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Staff Personal & Contact Information
                    </CardTitle>
                    <CardDescription>
                      Update employee name, contact phone number, email address, and profile photo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">First Name *</Label>
                        <Input
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                          placeholder="e.g. Eric"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Last Name</Label>
                        <Input
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          placeholder="e.g. Habimana"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Email Address</Label>
                        <Input
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="e.g. eric@clinic.rw"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Phone Number</Label>
                        <Input
                          value={editPhoneNumber}
                          onChange={(e) => setEditPhoneNumber(e.target.value)}
                          placeholder="e.g. +250788000000"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Username</Label>
                        <Input
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          placeholder="e.g. dr_eric"
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Gender</Label>
                        <Select
                          value={editGender}
                          onValueChange={setEditGender}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Date of Birth</Label>
                        <Input
                          type="date"
                          value={editDateOfBirth}
                          onChange={(e) => setEditDateOfBirth(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label className="text-sm font-semibold">Profile Photo</Label>
                        <MediaUploader
                          currentUrl={editProfilePhotoUrl}
                          onUploaded={(files) => {
                            if (files[0]?.url) setEditProfilePhotoUrl(files[0].url);
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex justify-end">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving || !editFirstName.trim()}
                        className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium"
                      >
                        {saving ? "Saving…" : "Save Profile Details"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: ROLES & PERMISSIONS                                    */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="roles" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      Role Assignments & Clinical Access
                    </CardTitle>
                    <CardDescription>
                      Grant system roles and authorization permissions for this staff member.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {ALL_ROLES.map((role) => {
                        if (role === ADMIN_ROLE && !canManageAdminUserAccounts) {
                          return null;
                        }
                        const isSelected = editRoles.includes(role);
                        const roleCfg = getRoleBadgeConfig(role);

                        return (
                          <div
                            key={role}
                            onClick={() => toggleEditRole(role)}
                            className={cn(
                              "flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2",
                              isSelected
                                ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                                : "border-border/70 hover:border-border bg-background",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className={cn("text-xs font-bold", roleCfg.badgeClass)}
                                >
                                  {role}
                                </Badge>
                              </div>
                              <span
                                className={cn(
                                  "size-3 rounded-full border-2",
                                  isSelected
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground/40 bg-transparent",
                                )}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {ROLE_DESCRIPTIONS[role] || "Access and management permissions for this role."}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-border/60 flex justify-end">
                      <Button
                        onClick={handleSaveRoles}
                        disabled={saving || editRoles.length === 0}
                        className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium"
                      >
                        {saving ? "Saving…" : "Save Role Assignments"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: DEPARTMENTS                                            */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="departments" className="space-y-6">
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Department Workstation Memberships
                    </CardTitle>
                    <CardDescription>
                      Assign the clinical departments where this staff member can attend queues and process orders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {departments.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">
                        No departments found in clinic configuration.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {departments.map((dept) => {
                          const isAssigned = editDepartmentIds.includes(dept.id);

                          return (
                            <div
                              key={dept.id}
                              onClick={() => toggleEditDepartment(dept.id)}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                                isAssigned
                                  ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-xs"
                                  : "border-border/70 hover:border-border bg-background",
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <Building2
                                  className={cn(
                                    "h-4 w-4",
                                    isAssigned ? "text-primary" : "text-muted-foreground",
                                  )}
                                />
                                <span className="font-semibold text-sm text-foreground">
                                  {dept.name}
                                </span>
                              </div>

                              <span
                                className={cn(
                                  "size-3 rounded-full border-2 shrink-0",
                                  isAssigned
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground/40 bg-transparent",
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="pt-4 border-t border-border/60 flex justify-end">
                      <Button
                        onClick={handleSaveDepartments}
                        disabled={saving}
                        className="rounded-full px-6 bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium"
                      >
                        {saving ? "Saving…" : "Save Department Assignments"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: SECURITY & ACCESS                                      */}
              {/* ------------------------------------------------------------- */}
              <TabsContent value="security" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Account Status Card */}
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Power className="h-4 w-4 text-primary" /> Account Status & Login
                      </CardTitle>
                      <CardDescription>
                        Control account active status and login capability.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-muted/20">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            Status:{" "}
                            <span
                              className={cn(
                                selectedUser.accountStatus === "ACTIVE"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400",
                              )}
                            >
                              {selectedUser.accountStatus}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selectedUser.accountStatus === "ACTIVE"
                              ? "User can authenticate and access authorized clinic portals."
                              : "User login is suspended until account is activated."}
                          </p>
                        </div>

                        {!isCurrentUser(selectedUser) && (
                          <>
                            {selectedUser.accountStatus === "ACTIVE" ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="rounded-full"
                                onClick={() => {
                                  setDeactivateTargetUser(selectedUser);
                                  setDeactivateConfirmOpen(true);
                                }}
                                disabled={saving}
                              >
                                <Power className="h-3.5 w-3.5 mr-1" /> Deactivate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => openActivateModal(selectedUser)}
                                disabled={saving}
                              >
                                <UserCheck className="h-3.5 w-3.5 mr-1" /> Activate
                              </Button>
                            )}
                          </>
                        )}
                      </div>

                      {/* Password Reset Action */}
                      <div className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-muted/20">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            Require Password Setup
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Invalidates existing password and prompts setup on next login.
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => setPasswordResetConfirmOpen(true)}
                          disabled={saving || isCurrentUser(selectedUser)}
                        >
                          <LockKeyhole className="h-3.5 w-3.5 mr-1" /> Force Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Identifiers Card */}
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" /> Identifiers & Audit
                      </CardTitle>
                      <CardDescription>
                        System identifiers and database audit timestamps.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">User ID:</span>
                        <span className="font-mono text-xs text-foreground bg-muted/40 px-2 py-0.5 rounded">
                          {selectedUser.id}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Username:</span>
                        <span className="font-medium text-foreground">
                          {selectedUser.username || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium text-foreground">
                          {selectedUser.email || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-border/40 text-sm">
                        <span className="text-muted-foreground">Session Limit:</span>
                        <span className="font-medium text-foreground">
                          {(selectedUser as any).maxActiveSessions ?? 4} concurrent sessions
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD USER MODAL                                                            */}
        {/* ========================================================================= */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden backdrop-blur-2xl bg-card/95 dark:bg-card/95 text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-3 flex flex-col">
            <div className="flex-1 overflow-hidden bg-[#FBF2ED] dark:bg-slate-900 border border-border/40 dark:border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Create New Staff Account
                </DialogTitle>
                <DialogDescription>
                  Enter user details, assign clinical roles, and link workstation departments.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmitCreate(handleCreateUser)}
                className="flex-1 overflow-y-auto pr-2 space-y-4 my-4 scrollbar-thin"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      First Name *
                    </Label>
                    <Input
                      placeholder="e.g. Eric"
                      {...registerCreate("firstName")}
                      className={`rounded-xl bg-white dark:bg-slate-950 ${createErrors.firstName ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                    />
                    <FieldError message={createErrors.firstName?.message} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Last Name
                    </Label>
                    <Input
                      placeholder="e.g. Habimana"
                      {...registerCreate("lastName")}
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      placeholder="e.g. eric@clinic.rw"
                      {...registerCreate("email")}
                      className={`rounded-xl bg-white dark:bg-slate-950 ${createErrors.email ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                    />
                    <FieldError message={createErrors.email?.message} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Phone Number
                    </Label>
                    <Input
                      placeholder="e.g. +250788000000"
                      {...registerCreate("phoneNumber")}
                      className={`rounded-xl bg-white dark:bg-slate-950 ${createErrors.phoneNumber ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                    />
                    <FieldError message={createErrors.phoneNumber?.message} />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Username
                    </Label>
                    <Input
                      placeholder="e.g. dr_eric"
                      {...registerCreate("username")}
                      className="rounded-xl bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Gender *
                    </Label>
                    <Select
                      value={watchCreate("gender") || ""}
                      onValueChange={(val) => setCreateValue("gender", val, { shouldValidate: true })}
                    >
                      <SelectTrigger className={`rounded-xl bg-white dark:bg-slate-950 ${createErrors.gender ? "border-red-500 focus-visible:ring-red-300" : ""}`}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError message={createErrors.gender?.message} />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Date of Birth *
                    </Label>
                    <Input
                      type="date"
                      {...registerCreate("dateOfBirth")}
                      className={`rounded-xl bg-white dark:bg-slate-950 ${createErrors.dateOfBirth ? "border-red-500 focus-visible:ring-red-300" : ""}`}
                    />
                    <FieldError message={createErrors.dateOfBirth?.message} />
                  </div>
                </div>

                {/* Roles Selection */}
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <Label className="text-xs font-semibold text-muted-foreground">
                    Assigned Roles *
                  </Label>
                  <FieldError message={createErrors.roles?.message} />
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLES.map((role) => {
                      if (role === ADMIN_ROLE && !canManageAdminUserAccounts) {
                        return null;
                      }
                      const selected = watchedCreateRoles.includes(role);
                      return (
                        <button
                          key={`create-${role}`}
                          type="button"
                          onClick={() => toggleCreateRole(role)}
                          className={cn(
                            "px-3.5 h-8 rounded-xl border text-xs font-semibold transition-all",
                            selected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-white dark:bg-slate-950 text-foreground border-border hover:border-primary/50",
                          )}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Departments Selection */}
                {departments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <Label className="text-xs font-semibold text-muted-foreground">
                      Assigned Departments
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => {
                        const selected = createDepartmentIds.includes(dept.id);
                        return (
                          <button
                            key={`create-dept-${dept.id}`}
                            type="button"
                            onClick={() => toggleCreateDepartment(dept.id)}
                            className={cn(
                              "px-3.5 h-8 rounded-xl border text-xs font-semibold transition-all",
                              selected
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-white dark:bg-slate-950 text-foreground border-border hover:border-primary/50",
                            )}
                          >
                            {dept.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-2 border-t border-border/40 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    disabled={saving}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-gradient-to-r from-[#25D2D8] via-[#5F77E8] to-[#3CAAD8] hover:opacity-90 text-white shadow-md font-medium"
                  >
                    {saving ? "Creating…" : "Create User"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

        {/* Activation Modal */}
        <Dialog open={activationModalOpen} onOpenChange={setActivationModalOpen}>
          <DialogContent className="sm:max-w-md backdrop-blur-2xl bg-card/95 text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" /> Activate Staff Account
              </DialogTitle>
              <DialogDescription>
                Select the roles to assign before activating{" "}
                {activationTargetUser?.firstName} {activationTargetUser?.lastName}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Roles *</Label>
                {activationRoleError && (
                  <p className="text-xs text-destructive">{activationRoleError}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {ALL_ROLES.map((role) => {
                    if (role === ADMIN_ROLE && !canManageAdminUserAccounts) {
                      return null;
                    }
                    const selected = activationRoles.includes(role);
                    return (
                      <button
                        key={`act-${role}`}
                        type="button"
                        onClick={() => {
                          setActivationRoleError("");
                          setActivationRoles((prev) =>
                            prev.includes(role)
                              ? prev.filter((r) => r !== role)
                              : [...prev, role],
                          );
                        }}
                        className={cn(
                          "px-3.5 h-8 rounded-xl border text-xs font-semibold transition-all",
                          selected
                            ? "bg-primary text-primary-foreground border-primary shadow-xs"
                            : "bg-card text-foreground border-border hover:border-primary/50",
                        )}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
                <Button
                  variant="outline"
                  onClick={() => setActivationModalOpen(false)}
                  disabled={saving}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmActivation}
                  disabled={saving}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  {saving ? "Activating…" : "Activate Account"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Deactivation Confirm Dialog */}
        <ConfirmDialog
          open={deactivateConfirmOpen}
          onOpenChange={setDeactivateConfirmOpen}
          title="Deactivate Staff Account"
          description="Are you sure you want to deactivate this account? The staff member will no longer be able to log in until reactivated."
          confirmLabel="Deactivate Account"
          destructive
          busy={saving}
          onConfirm={handleConfirmDeactivation}
        />

        {/* Password Reset Confirm Dialog */}
        <ConfirmDialog
          open={passwordResetConfirmOpen}
          onOpenChange={setPasswordResetConfirmOpen}
          title="Require Password Setup"
          description="Are you sure you want to force a password reset? This user will be required to create a new password on their next login attempt."
          confirmLabel="Require Reset"
          busy={saving}
          onConfirm={handleForcePasswordSetup}
        />
      </main>
    </div>
  );
}
