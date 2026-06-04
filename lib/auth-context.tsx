"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,          // <‑‑ added
} from "react";
import type { Doctor, ClinicProfile } from "./types";
import {
  useLogin,
  useRegister,
  type LoginResponse,
  type RegisterResponse,
} from "@/hooks/auth-hooks";
import {
  getStoredClinicProfile,
  normalizeClinicProfile,
  setStoredClinicProfile,
} from "@/lib/clinic-profile";

interface AuthContextType {
  doctor: Doctor | null;
  clinicProfile: ClinicProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{
    success: boolean;
    message?: string;
    requiresPasswordSetup?: boolean;
  }>;
  register: (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    title: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setClinicProfile: (clinicProfile: ClinicProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredDoctor(): Doctor | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("authToken");
  const storedDoctor = localStorage.getItem("doctor");

  // Debug
  if (process.env.NODE_ENV !== "production") {
    try {
      console.debug("getStoredDoctor:", {
        tokenPresent: Boolean(token),
        storedDoctorRaw: storedDoctor,
      });
    } catch {}
  }

  if (!token || !storedDoctor) return null;

  try {
    return JSON.parse(storedDoctor) as Doctor;
  } catch {
    localStorage.removeItem("authToken");
    localStorage.removeItem("doctor");
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinicProfile, setClinicProfileState] = useState<ClinicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { login: loginMutation } = useLogin();
  const { register: registerMutation } = useRegister();

  /* ------------------------------------------------------------------- */
  /* Restore state from localStorage on mount                            */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    setDoctor(getStoredDoctor());
    setClinicProfileState(getStoredClinicProfile());
    setIsLoading(false);
  }, []);

  /* ------------------------------------------------------------------- */
  /* Auth helpers                                                         */
  /* ------------------------------------------------------------------- */
  const login = async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
    requiresPasswordSetup?: boolean;
  }> => {
    try {
      const response: LoginResponse = await loginMutation(email, password);

      if (response.status === "SUCCESS" && response.data) {
        const { token, user } = response.data;

        // Persist tokens & user
        localStorage.removeItem("pendingResetIdentifier");
        localStorage.setItem("authToken", token);
        localStorage.setItem("doctor", JSON.stringify(user));

        // Store clinic profile if it came back in the login payload
        const clinicProfileFromLogin = normalizeClinicProfile(
          response.data.clinicProfile
        );
        if (clinicProfileFromLogin) {
          setStoredClinicProfile(clinicProfileFromLogin);
          setClinicProfileState(clinicProfileFromLogin);
        }

        console.log("=== AUTH CONTEXT STORED TO LOCALSTORAGE ===", {
          doctor: user,
          storedString: JSON.stringify(user),
        });

        setDoctor(user);
        return { success: true };
      } else if (
        response.status === "PARTIAL_SUCCESS" &&
        response.data?.needsPasswordSetup
      ) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("doctor");
        localStorage.setItem("pendingResetIdentifier", email);

        setDoctor(null);
        return {
          success: false,
          message: response.messages?.[0]?.text ?? "Password not set. Complete initial password setup.",
          requiresPasswordSetup: true,
        };
      } else if (response.status === "RESET_PASSWORD") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("doctor");
        localStorage.setItem("pendingResetIdentifier", email);

        setDoctor(null);
        return {
          success: false,
          message:
            response.messages?.[0]?.text ?? "Please create your password before signing in.",
          requiresPasswordSetup: true,
        };
      }

      // Generic error
      return { success: false, message: response.message || "Login failed" };
    } catch (err) {
      return { success: false, message: "Network error occurred" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    title: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response: RegisterResponse = await registerMutation(
        name,
        email,
        password,
        phoneNumber,
        title
      );

      if (response.status === "SUCCESS") {
        return { success: true, message: "Registration successful! Please contact admin to activate your account." };
      }

      return { success: false, message: response.message || "Registration failed" };
    } catch (_) {
      return { success: false, message: "Network error occurred" };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("doctor");
    localStorage.removeItem("dashboard_viewMode");
    localStorage.removeItem("dashboard_showMetrics");
    setDoctor(null);
  };

  /* ------------------------------------------------------------------- */
  /* Stable setter for clinicProfile (prevents infinite loop)           */
  /* ------------------------------------------------------------------- */
  const setClinicProfile = useCallback(
    (nextClinicProfile: ClinicProfile | null) => {
      const normalized = normalizeClinicProfile(nextClinicProfile);
      setClinicProfileState(normalized);
      setStoredClinicProfile(normalized);
    },
    [] // stable – no internal deps
  );

  /* ------------------------------------------------------------------- */
  /* Listen for global logout / user‑update events                       */
  /* ------------------------------------------------------------------- */
  useEffect(() => {
    const handleExternalLogout = () => logout();
    const handleExternalProfileUpdate = () => setDoctor(getStoredDoctor());
    if (typeof window !== "undefined") {
      window.addEventListener("auth-logout", handleExternalLogout as EventListener);
      window.addEventListener("auth-user-updated", handleExternalProfileUpdate as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth-logout", handleExternalLogout as EventListener);
        window.removeEventListener("auth-user-updated", handleExternalProfileUpdate as EventListener);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        doctor,
        clinicProfile,
        isAuthenticated: !!doctor,
        isLoading,
        login,
        register,
        logout,
        setClinicProfile, // exposed stable callback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
