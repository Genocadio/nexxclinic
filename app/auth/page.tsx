/*  ==============================
    pages/auth/page.tsx (fixed)
   ============================== */

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* ---- custom hooks ----------------------------------------------------- */
import { useClinicProfile } from "@/hooks/auth-hooks";          // ← new
import { useAuth } from "@/lib/auth-context";                 // ← now includes setClinicProfile
import { useDebouncedValidation } from "@/hooks/use-debounced-validation";

/* ---- helpers ---------------------------------------------------------- */
import { getClinicDisplayName, getClinicLogoUrl } from "@/lib/clinic-profile";
import { getPostLoginPath } from "@/lib/role-utils";
import {
  sanitizeEmailInput,
  sanitizeEmailOrPhoneInput,
  sanitizePhoneInput,
} from "@/lib/validation-utils";

/* ---- validation schemas ------------------------------------------------ */
import {
  loginFormSchema,
  registerFormSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/lib/form-schemas";

/* ---- ui --------------------------------------------------------------- */
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldError } from "@/components/ui/field-error";

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* --------------------------------------------------------------------- */
  /* 1️⃣  Use the AuthProvider ------------------------------------------------- */
  /* --------------------------------------------------------------------- */
  const {
    isAuthenticated,
    isLoading,
    doctor,
    clinicProfile,            // <- real profile (may be null until set)
    login,
    register,
    setClinicProfile,         // ← exposed by the provider
  } = useAuth();

  /* --------------------------------------------------------------------- */
  /* 2️⃣  Fetch clinic profile from the backend                            */
  /* --------------------------------------------------------------------- */
  const {
    clinicProfile: fetchedClinicProfile,
    loading: clinicLoading,
  } = useClinicProfile();   // runs on every mount of /auth

  /* Push fetched data into context (and localStorage via setClinicProfile) */
useEffect(() => {
    if (!clinicLoading && fetchedClinicProfile && !clinicProfile) {
      setClinicProfile(fetchedClinicProfile);
    }
  }, [fetchedClinicProfile, clinicLoading, clinicProfile, setClinicProfile]);


  /* --------------------------------------------------------------------- */
  /* 3️⃣  Tab mode & form state                                           */
  /* --------------------------------------------------------------------- */
  const initialMode = useMemo(
    () => (searchParams.get("mode") === "register" ? "register" : "login"),
    [searchParams]
  );
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: { identifier: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    // The register schema re-runs cross-field superRefine checks (email/phone
    // presence + format, password-vs-name/email rules) as you type, so its
    // live validation is debounced instead of re-parsing on every keystroke.
    mode: "onSubmit",
    defaultValues: { name: "", email: "", phone: "", password: "" },
  });

  useDebouncedValidation({
    control: registerForm.control,
    trigger: registerForm.trigger,
  });

  /* --------------------------------------------------------------------- */
  /* 4️⃣  UI helpers                                                      */
  /* --------------------------------------------------------------------- */
  const clinicName = getClinicDisplayName(clinicProfile);
  const clinicLogoUrl = getClinicLogoUrl(clinicProfile);
  // Show skeleton while either the auth context or the profile query
  // is still loading. After first render `clinicLoading` will be true.
  const showBrandSkeleton = isLoading || clinicLoading;
  const baseInputClass =
    "rounded-xl border-slate-300 bg-white/95 text-slate-900 placeholder:text-slate-500 shadow-sm focus-visible:border-slate-500 focus-visible:ring-slate-300/70 dark:border-input dark:bg-input/30 dark:text-foreground dark:placeholder:text-muted-foreground";

  const tabButtonClass = (isActive: boolean) =>
    `rounded-xl transition-all duration-300 ${
      isActive
        ? "shadow-md"
        : "text-slate-700 hover:text-slate-900 hover:bg-white/80 dark:text-slate-300 dark:hover:text-slate-50 dark:hover:bg-slate-700/60"
    }`;

  /* --------------------------------------------------------------------- */
  /* 5️⃣  Handlers                                                       */
  /* --------------------------------------------------------------------- */

  useEffect(() => {
    setMode(initialMode);
    loginForm.clearErrors();
    registerForm.clearErrors();
  }, [initialMode]);

  // Redirect after login
  useEffect(() => {
    if (isAuthenticated) {
      const roles = ((doctor as unknown as { roles?: string[] } | null)?.roles || []) as string[];
      router.replace(getPostLoginPath(roles));
    }
  }, [doctor, isAuthenticated, router]);

  const switchMode = (next: "login" | "register") => {
    setMode(next);
    loginForm.clearErrors();
    registerForm.clearErrors();
    router.replace(next === "register" ? "/auth?mode=register" : "/auth");
  };

  // Password strength meter for the register tab.
  const registerPassword = registerForm.watch("password");
  const registerName = registerForm.watch("name");
  const registerEmail = registerForm.watch("email");

  const passwordStrength = useMemo(() => {
    const pw = registerPassword;
    if (!pw) return null;
    const checks = {
      length: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      digit: /[0-9]/.test(pw),
      special: /[^a-zA-Z0-9]/.test(pw),
      noWhitespace: !/\s/.test(pw),
      noName: (() => {
        if (!registerName) return true;
        const lowered = pw.toLowerCase();
        return !registerName.split(/\s+/).some((part) => part && lowered.includes(part.toLowerCase()));
      })(),
      noEmailPrefix: (() => {
        if (!registerEmail) return true;
        const prefix = registerEmail.split("@")[0].toLowerCase();
        return !prefix || !pw.toLowerCase().includes(prefix);
      })(),
    };
    const score = [checks.length, checks.upper, checks.lower, checks.digit, checks.special].filter(Boolean).length;
    const label = score >= 4 ? "Strong" : score >= 2 ? "Medium" : "Easy";
    const color = score >= 4 ? "bg-green-500" : score >= 2 ? "bg-amber-500" : "bg-red-500";
    const textColor = score >= 4 ? "text-green-600" : score >= 2 ? "text-amber-600" : "text-red-600";
    return { score, label, color, textColor, checks };
  }, [registerPassword, registerName, registerEmail]);

  const getWelcomeName = (identifier: string) => {
    if (typeof window !== "undefined") {
      try {
        const storedDoctor = localStorage.getItem("doctor");
        if (storedDoctor) {
          const parsedDoctor = JSON.parse(storedDoctor) as { name?: string };
          if (parsedDoctor?.name?.trim()) {
            return parsedDoctor.name.trim();
          }
        }
      } catch {
        // fallback below
      }
    }

    if (identifier.includes("@")) {
      const emailPrefix = identifier.split("@")[0]?.trim();
      if (emailPrefix) {
        return emailPrefix
          .replace(/[._-]+/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
      }
    }

    return "Doctor";
  };

  const getStoredRoles = () => {
    if (typeof window === "undefined") return [] as string[];

    try {
      const storedDoctor = localStorage.getItem("doctor");
      if (!storedDoctor) return [];
      const parsedDoctor = JSON.parse(storedDoctor) as { roles?: string[] } | null;
      return parsedDoctor?.roles || [];
    } catch {
      return [];
    }
  };

  /* ---- Submit handlers ------------------------------------------------- */
  const handleLogin = async (values: LoginFormValues) => {
    setIsLoadingForm(true);

    try {
      const result = await login(values.identifier, values.password);
      if (result.success) {
        const welcomeName = getWelcomeName(values.identifier);
        toast.success(`Welcome back, ${welcomeName}`, {
          position: "top-center",
          autoClose: 2200,
          closeOnClick: false,
          draggable: false,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          closeButton: false,
          className: "nexx-toast-welcome",
        });
        router.replace(getPostLoginPath(getStoredRoles()));
        return;
      }

      if (result.requiresPasswordSetup) {
        const params = new URLSearchParams({ identifier: values.identifier });
        router.replace(`/create-password?${params.toString()}`);
        return;
      }

      toast.error(result.message || "Login failed");
    } catch {
      toast.error("Login failed");
    } finally {
      setIsLoadingForm(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoadingForm(true);

    try {
      const result = await register(values.name, values.email, values.password, values.phone);
      if (result.success) {
        toast.success(result.message || "Registration successful");
        switchMode("login");
        return;
      }

      toast.error(result.message || "Registration failed");
    } catch {
      toast.error("Registration failed");
    } finally {
      setIsLoadingForm(false);
    }
  };

  const loginErrors = loginForm.formState.errors;
  const registerErrors = registerForm.formState.errors;
  const errorInputClass = "border-amber-500 focus-visible:ring-amber-300";

  /* --------------------------------------------------------------------- */
  /* 6️⃣  Render                                                          */
  /* --------------------------------------------------------------------- */

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-500/20" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/20" />

      {/* Theme switcher */}
      <div className="absolute right-4 top-4 z-20 rounded-2xl border border-slate-300/90 bg-white/90 p-1.5 shadow-lg ring-1 ring-white/80 backdrop-blur-md dark:border-white/15 dark:bg-slate-900/70 dark:ring-white/10 sm:right-6 sm:top-6">
        <ThemeSwitcher />
      </div>

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center fly-in fly-in-1">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4 fly-in fly-in-2">
            {showBrandSkeleton ? (
              <Skeleton className="h-16 w-16 rounded-2xl bg-white/70 dark:bg-slate-900/60 ring-1 ring-white/60 dark:ring-white/10" />
            ) : (
              <div className="relative h-16 w-16 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-lg ring-1 ring-white/60 dark:ring-white/10 overflow-hidden flex items-center justify-center">
                <img src={clinicLogoUrl} alt={`${clinicName} logo`} className="h-16 w-16 object-contain" />
              </div>
            )}
          </div>

          {/* Title */}
          {showBrandSkeleton ? (
            <div className="space-y-3 flex flex-col items-center fly-in fly-in-3">
              <Skeleton className="h-8 w-44 rounded-xl bg-white/70 dark:bg-slate-900/60" />
              <Skeleton className="h-4 w-28 rounded-xl bg-white/60 dark:bg-slate-900/50" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 fly-in fly-in-3">{clinicName}</h1>
              <p className="text-slate-600 dark:text-slate-300 fly-in fly-in-4">Welcome back</p>
            </>
          )}
        </div>

        {/* Form card */}
        <div className="rounded-3xl border border-slate-300/90 dark:border-white/10 bg-white/88 dark:bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/90 dark:ring-white/5 space-y-5 fly-in fly-in-5">
          {/* Mode tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-100/90 dark:border-white/10 dark:bg-slate-800/80 p-1 ring-1 ring-white/90 dark:ring-white/10 fly-in fly-in-6">
            <Button type="button" variant={mode === "login" ? "default" : "ghost"} className={tabButtonClass(mode === "login")} onClick={() => switchMode("login")} disabled={isLoadingForm}>
              Login
            </Button>
            <Button type="button" variant={mode === "register" ? "default" : "ghost"} className={tabButtonClass(mode === "register")} onClick={() => switchMode("register")} disabled={isLoadingForm}>
              Register
            </Button>
          </div>

          {/* Form panel */}
          <div key={mode} className="mode-switch-panel">
            {mode === "login" ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 fly-in fly-in-7" noValidate>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Email or Phone</label>
                  <Input
                    {...loginForm.register("identifier")}
                    onChange={(e) => loginForm.setValue("identifier", sanitizeEmailOrPhoneInput(e.target.value))}
                    type="text"
                    disabled={isLoadingForm}
                    placeholder="dr.name@eyecare.com or +256701234567 or 0712345678"
                    className={`w-full ${baseInputClass} ${loginErrors.identifier ? errorInputClass : ""}`}
                  />
                  <FieldError message={loginErrors.identifier?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      {...loginForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoadingForm}
                      placeholder="Enter your password"
                      className={`w-full pr-10 ${baseInputClass} ${loginErrors.password ? errorInputClass : ""}`}
                    />
                    <button type="button" disabled={isLoadingForm} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError message={loginErrors.password?.message} />
                </div>
                <Button type="submit" disabled={isLoadingForm} className="w-full mt-2 rounded-xl">
                  {isLoadingForm ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4 fly-in fly-in-7" noValidate>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Full Name</label>
                  <Input
                    {...registerForm.register("name")}
                    type="text"
                    disabled={isLoadingForm}
                    placeholder="Enter your full name"
                    className={`${baseInputClass} ${registerErrors.name ? errorInputClass : ""}`}
                  />
                  <FieldError message={registerErrors.name?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Email Address</label>
                  <Input
                    {...registerForm.register("email")}
                    onChange={(e) => registerForm.setValue("email", sanitizeEmailInput(e.target.value))}
                    type="email"
                    disabled={isLoadingForm}
                    placeholder="dr.name@eyecare.com"
                    className={`${baseInputClass} ${registerErrors.email ? errorInputClass : ""}`}
                  />
                  <FieldError message={registerErrors.email?.message} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Phone Number</label>
                  <Input
                    {...registerForm.register("phone")}
                    onChange={(e) => registerForm.setValue("phone", sanitizePhoneInput(e.target.value))}
                    type="tel"
                    disabled={isLoadingForm}
                    placeholder="+256701234567 or 0712345678"
                    className={`${baseInputClass} ${registerErrors.phone ? errorInputClass : ""}`}
                  />
                  <FieldError message={registerErrors.phone?.message} />
                  <p className="mt-1 text-xs text-muted-foreground">At least one contact method required</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      {...registerForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoadingForm}
                      placeholder="Enter your password"
                      className={`w-full pr-10 ${baseInputClass} ${registerErrors.password ? errorInputClass : ""}`}
                    />
                    <button type="button" disabled={isLoadingForm} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError message={registerErrors.password?.message} />
                  {passwordStrength && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                        </div>
                        <span className={`text-xs font-medium ${passwordStrength.textColor}`}>{passwordStrength.label}</span>
                      </div>
                      <ul className="space-y-0.5">
                        {[
                          { key: "length", label: "At least 8 characters" },
                          { key: "upper", label: "Uppercase letter" },
                          { key: "lower", label: "Lowercase letter" },
                          { key: "digit", label: "Digit" },
                          { key: "special", label: "Special character" },
                          { key: "noWhitespace", label: "No whitespace" },
                          { key: "noName", label: "Doesn't contain your name" },
                          { key: "noEmailPrefix", label: "Doesn't contain your email prefix" },
                        ].map(({ key, label }) => {
                          const ok = passwordStrength.checks[key as keyof typeof passwordStrength.checks]
                          return (
                            <li key={key} className={`text-xs flex items-center gap-1.5 ${ok ? "text-green-600" : "text-muted-foreground"}`}>
                              {ok ? "✓" : "○"} {label}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={isLoadingForm} className="w-full mt-2 rounded-xl">
                  {isLoadingForm ? "Registering..." : "Register"}
                </Button>
              </form>
            )}

            {/* Link below the form */}
            <p className="text-xs text-muted-foreground text-center fly-in fly-in-8">
              {mode === "login" ? (
                <>
                  Need an account?{" "}
                  <Link href="/auth?mode=register" className="text-primary hover:underline">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link href="/auth" className="text-primary hover:underline">
                    Login
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
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
            filter: none;
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
          .fly-in,
          .mode-switch-panel {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Page wrapper – provides suspense fallback                               */
/* ------------------------------------------------------------------------ */
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
