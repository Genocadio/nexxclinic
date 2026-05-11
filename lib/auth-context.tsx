"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Doctor } from "./types"
import { useLogin, useRegister, type LoginResponse, type RegisterResponse } from "@/hooks/auth-hooks"

interface AuthContextType {
  doctor: Doctor | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; requiresPasswordSetup?: boolean }>
  register: (name: string, email: string, password: string, phoneNumber: string, title: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getStoredDoctor(): Doctor | null {
  if (typeof window === "undefined") {
    return null
  }

  const token = localStorage.getItem("authToken")
  const storedDoctor = localStorage.getItem("doctor")

  // Debug: log what's in localStorage during initialization
  if (process.env.NODE_ENV !== 'production') {
    try {
      // eslint-disable-next-line no-console
      console.debug('getStoredDoctor: localStorage snapshot', { tokenPresent: Boolean(token), storedDoctorRaw: storedDoctor })
    } catch (e) {
      // ignore
    }
  }

  if (!token || !storedDoctor) {
    return null
  }

  try {
    return JSON.parse(storedDoctor) as Doctor
  } catch {
    localStorage.removeItem("authToken")
    localStorage.removeItem("doctor")
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { login: loginMutation } = useLogin()
  const { register: registerMutation } = useRegister()

  useEffect(() => {
    setDoctor(getStoredDoctor())
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; requiresPasswordSetup?: boolean }> => {
    try {
      const response: LoginResponse = await loginMutation(email, password)

      if (response.status === 'SUCCESS' && response.data) {
        const { token, user } = response.data
        localStorage.removeItem('pendingResetIdentifier')
        localStorage.setItem('authToken', token)
        // Store user object (now includes department from login hook)
        const userToStore = JSON.stringify(user)
        localStorage.setItem('doctor', userToStore)
        console.log('=== AUTH CONTEXT STORED TO LOCALSTORAGE ===', {
          doctor: JSON.parse(userToStore),
          storedString: userToStore,
        })
        console.log('=== AUTH CONTEXT RETRIEVED FROM LOCALSTORAGE ===', {
          retrieved: JSON.parse(localStorage.getItem('doctor') || '{}'),
        })
        setDoctor(user)
        return { success: true }
      } else if (response.status === 'PARTIAL_SUCCESS' && response.data?.needsPasswordSetup) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('doctor')
        localStorage.setItem('pendingResetIdentifier', email)
        setDoctor(null)
        const message = response.messages?.[0]?.text || 'Password not set. Complete initial password setup.'
        return { success: false, message, requiresPasswordSetup: true }
      } else if (response.status === 'RESET_PASSWORD') {
        localStorage.removeItem('authToken')
        localStorage.removeItem('doctor')
        localStorage.setItem('pendingResetIdentifier', email)
        setDoctor(null)
        const message = response.messages?.[0]?.text || 'Please create your password before signing in.'
        return { success: false, message, requiresPasswordSetup: true }
      } else {
        const message = response.messages?.[0]?.text || 'Login failed'
        return { success: false, message }
      }
    } catch (error) {
      return { success: false, message: 'Network error occurred' }
    }
  }

  const register = async (name: string, email: string, password: string, phoneNumber: string, title: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response: RegisterResponse = await registerMutation(name, email, password, phoneNumber, title)

      if (response.status === 'SUCCESS') {
        return { success: true, message: 'Registration successful! Please contact admin to activate your account.' }
      } else {
        const message = response.messages?.[0]?.text || 'Registration failed'
        return { success: false, message }
      }
    } catch (error) {
      return { success: false, message: 'Network error occurred' }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('doctor')
    setDoctor(null)
  }

  // Listen for global logout events (triggered by Apollo error link)
  useEffect(() => {
    const handleExternalLogout = () => logout()
    const handleExternalProfileUpdate = () => setDoctor(getStoredDoctor())
    if (typeof window !== 'undefined') {
      window.addEventListener('auth-logout', handleExternalLogout as EventListener)
      window.addEventListener('auth-user-updated', handleExternalProfileUpdate as EventListener)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-logout', handleExternalLogout as EventListener)
        window.removeEventListener('auth-user-updated', handleExternalProfileUpdate as EventListener)
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ doctor, isAuthenticated: !!doctor, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (undefined === context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
