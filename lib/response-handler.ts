/**
 * Utility functions for handling API responses from mutations and queries
 * Ensures consistent handling of status, messages, and errors across the application
 */

import { toast } from 'react-toastify'
import type { ApiResponse } from '@/hooks/types'

const TOAST_STYLES = {
  SUCCESS: { background: '#16a34a', color: '#ffffff' },
  ERROR: { background: '#dc2626', color: '#ffffff' },
  UNAUTHORISED: { background: '#f59e0b', color: '#111827' },
  UNAUTHORIZED: { background: '#f59e0b', color: '#111827' },
  UNAUTHENTICATED: { background: '#7c3aed', color: '#ffffff' },
  PARTIAL_SUCCESS: { background: '#2563eb', color: '#ffffff' },
} as const

export function getStatusToastMessage(status: string | undefined, message?: string) {
  switch (status) {
    case 'UNAUTHENTICATED':
      return message || 'Your session has expired. Please login again.'
    case 'UNAUTHORISED':
    case 'UNAUTHORIZED':
      return message || 'You do not have permission to perform this action.'
    case 'PARTIAL_SUCCESS':
      return message || 'Operation completed with some issues.'
    case 'ERROR':
      return message || 'An error occurred. Please try again.'
    case 'SUCCESS':
      return message || 'Operation completed successfully.'
    default:
      return message || 'Operation failed. Please try again.'
  }
}

export function toastResponseStatus(status: string | undefined, message?: string) {
  const resolvedMessage = getStatusToastMessage(status, message)
  const toastOptions = {
    style: TOAST_STYLES[(status as keyof typeof TOAST_STYLES) || 'ERROR'] || TOAST_STYLES.ERROR,
  }

  switch (status) {
    case 'SUCCESS':
      toast.success(resolvedMessage, toastOptions)
      return
    case 'UNAUTHENTICATED':
      toast.info(resolvedMessage, toastOptions)
      return
    case 'UNAUTHORISED':
    case 'UNAUTHORIZED':
      toast.warn(resolvedMessage, toastOptions)
      return
    case 'PARTIAL_SUCCESS':
      toast.warn(resolvedMessage, toastOptions)
      return
    case 'ERROR':
      toast.error(resolvedMessage, toastOptions)
      return
    default:
      toast.error(resolvedMessage, toastOptions)
  }
}

export function handleUnauthenticatedSession(message?: string) {
  if (typeof window === 'undefined') {
    return
  }

  toastResponseStatus('UNAUTHENTICATED', message)

  try {
    localStorage.removeItem('authToken')
    localStorage.removeItem('doctor')
    window.dispatchEvent(new Event('auth-logout'))
    if (window.location.pathname !== '/auth') {
      window.location.replace('/auth')
    }
  } catch {
    // noop
  }
}

/**
 * Options for handling a response
 */
export interface HandleResponseOptions {
  successMessage?: string | boolean // false to not show success toast
  errorMessage?: string | boolean // false to not show error toast
  onSuccess?: (data?: any) => void | Promise<void>
  onError?: (message: string, data?: any) => void | Promise<void>
  showDetailedError?: boolean // If true, shows backend message in toast
}

/**
 * Extracts message from various response formats
 */
export function extractMessage(response: any, fallback: string = ''): string {
  if (!response) return fallback

  // Check for direct message
  if (response.message && typeof response.message === 'string') {
    return response.message
  }

  // Check for messages array
  if (Array.isArray(response.messages) && response.messages.length > 0) {
    return response.messages[0].text || fallback
  }

  // Check for nested message in data
  if (response.data?.message && typeof response.data.message === 'string') {
    return response.data.message
  }

  return fallback
}

/**
 * Handles API response with automatic toast notifications
 * Returns true if status is SUCCESS, false otherwise
 *
 * @example
 * const result = await createBill(input)
 * if (handleResponse(result, { successMessage: 'Bill created' })) {
 *   // Handle success
 * }
 */
export async function handleResponse<T>(
  response: ApiResponse<T> | any,
  options: HandleResponseOptions = {}
): Promise<boolean> {
  const {
    successMessage = true,
    errorMessage = true,
    onSuccess,
    onError,
    showDetailedError = true,
  } = options

  const isSuccess = response?.status === 'SUCCESS'

  if (isSuccess) {
    if (successMessage !== false) {
      const message =
        typeof successMessage === 'string'
          ? successMessage
          : extractMessage(response, 'Operation completed successfully')
      toastResponseStatus('SUCCESS', message)
    }

    if (onSuccess) {
      await onSuccess(response?.data)
    }

    return true
  } else {
    if (errorMessage !== false) {
      const status = response?.status
      const message =
        typeof errorMessage === 'string'
          ? errorMessage
          : showDetailedError
            ? extractMessage(response, 'Operation failed')
            : 'Operation failed'

      if (status === 'UNAUTHENTICATED') {
        handleUnauthenticatedSession(message)
      } else {
        toastResponseStatus(status, message)
      }
    }

    if (onError) {
      await onError(extractMessage(response, 'Operation failed'), response?.data)
    }

    return false
  }
}

/**
 * Safely calls a mutation/query and handles response
 * Useful for wrapping promise-based operations
 *
 * @example
 * await executeWithHandler(
 *   createBill(input),
 *   { successMessage: 'Bill created' }
 * )
 */
export async function executeWithHandler<T>(
  promise: Promise<ApiResponse<T> | any>,
  options: HandleResponseOptions = {}
): Promise<T | null> {
  try {
    const response = await promise
    const success = await handleResponse(response, options)
    return success ? response?.data : null
  } catch (error: any) {
    const errorMessage =
      typeof options.errorMessage === 'string'
        ? options.errorMessage
        : error?.message || 'An unexpected error occurred'

    if (options.errorMessage !== false) {
      toast.error(errorMessage)
    }

    if (options.onError) {
      await options.onError(errorMessage)
    }

    return null
  }
}

/**
 * Wrapper for component handlers that need to show toast on success
 * Handles both sync and async operations
 *
 * @example
 * const handleSubmit = withToastHandler(async (data) => {
 *   await updateUser(data)
 * }, {
 *   successMessage: 'Profile updated',
 *   errorMessage: 'Failed to update profile'
 * })
 */
export function withToastHandler<T extends (...args: any[]) => Promise<ApiResponse<any> | any>>(
  fn: T,
  options: HandleResponseOptions = {}
): (...args: Parameters<T>) => Promise<void> {
  return async (...args: Parameters<T>) => {
    try {
      const response = await fn(...args)
      await handleResponse(response, options)
    } catch (error: any) {
      if (options.errorMessage !== false) {
        const message =
          typeof options.errorMessage === 'string'
            ? options.errorMessage
            : error?.message || 'An unexpected error occurred'
        toast.error(message)
      }

      if (options.onError) {
        await options.onError(
          error?.message || 'An unexpected error occurred'
        )
      }
    }
  }
}

/**
 * Gets the appropriate error message to show to the user
 */
export function getUserFriendlyError(status: string, message?: string): string {
  return getStatusToastMessage(status, message)
}
