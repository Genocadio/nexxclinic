import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { toast } from 'react-toastify'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
const uri = `${baseUrl}/graphql`

const httpLink = new HttpLink({ uri, fetch })

const UNAUTHORIZED_TOAST_ID = 'global-unauthorized-toast'

const notifyUnauthorized = () => {
  if (typeof window === 'undefined') {
    return
  }

  toast.error('Action not allowed: no access available.', {
    toastId: UNAUTHORIZED_TOAST_ID,
  })
}

const handleUnauthenticated = () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem('authToken')
    window.dispatchEvent(new Event('auth-logout'))
    if (window.location.pathname !== '/auth') {
      window.location.replace('/auth')
    }
  } catch {
    // noop
  }
}

const handleResetPassword = () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const identifier = localStorage.getItem('pendingResetIdentifier') || ''
    localStorage.removeItem('authToken')
    localStorage.removeItem('doctor')
    window.dispatchEvent(new Event('auth-logout'))

    const query = identifier ? `?identifier=${encodeURIComponent(identifier)}` : ''
    if (window.location.pathname !== '/create-password') {
      window.location.replace(`/create-password${query}`)
    }
  } catch {
    // noop
  }
}

const extractStatusFromPayload = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== 'object') {
    return undefined
  }

  const maybeStatus = (payload as Record<string, unknown>).status
  return typeof maybeStatus === 'string' ? maybeStatus : undefined
}

const statusLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((result) => {
    const data = result?.data
    if (!data || typeof data !== 'object') {
      return result
    }

    // Most operations return one top-level field e.g. { getUsers: { status, ... } }
    const topLevelResults = Object.values(data as Record<string, unknown>)
    const statuses = topLevelResults
      .map(extractStatusFromPayload)
      .filter((status): status is string => Boolean(status))

    if (statuses.includes('UNAUTHENTICATED')) {
      handleUnauthenticated()
      return result
    }

    if (statuses.includes('UNAUTHORIZED')) {
      notifyUnauthorized()
    }

    if (statuses.includes('RESET_PASSWORD')) {
      handleResetPassword()
    }

    return result
  })
})

const authMiddleware = new ApolloLink((operation, forward) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('authToken')

  // Add the authorization header to the request
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })

  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Handle network errors (CORS, server down, offline, etc.)
  if (networkError) {
    const ne: any = networkError
    const message = ne?.message || ''
    
    // Dispatch network error event for UI to listen
    if (typeof window !== 'undefined') {
      const isCORSError =
        message.includes('CORS') ||
        message.includes('Same Origin Policy') ||
        message.includes('disallows reading') ||
        message.includes('Failed to fetch')
      
      const isNetworkError =
        (message.toLowerCase().includes('networkerror') && message.toLowerCase().includes('fetch resource')) ||
        message.includes('Network request failed') ||
        message.includes('ERR_CONNECTION_REFUSED') ||
        message.includes('ECONNREFUSED')
      
      const isServerDown = message.includes('ERR_CONNECTION_REFUSED') || message.includes('ECONNREFUSED')
      
      window.dispatchEvent(
        new CustomEvent('apollo-network-error', {
          detail: {
            message,
            isCORSError,
            isServerDown,
            isNetworkError,
            networkError,
          },
        })
      )
    }
    
    // Check auth-related network errors
    const unauthenticatedFromNetworkError = (() => {
      const status = ne?.statusCode ?? ne?.status
      return status === 401
    })()

    const unauthorizedFromNetworkError = (() => {
      const status = ne?.statusCode ?? ne?.status
      return status === 403
    })()

    if (unauthenticatedFromNetworkError) {
      handleUnauthenticated()
      return
    }

    if (unauthorizedFromNetworkError) {
      notifyUnauthorized()
      return
    }

    // For CORS/connection errors, don't spam toasts - let the NetworkStatusIndicator handle it
    return
  }

  // Handle GraphQL errors
  const hasUnauthenticatedGraphQLError = Array.isArray(graphQLErrors) && graphQLErrors.some(err => {
    const message = (err?.message || '').toLowerCase()
    const code = (err?.extensions as any)?.code
    return code === 'UNAUTHENTICATED' || message.includes('unauthenticated')
  })

  const hasUnauthorizedGraphQLError = Array.isArray(graphQLErrors) && graphQLErrors.some(err => {
    const message = (err?.message || '').toLowerCase()
    const code = (err?.extensions as any)?.code
    return code === 'UNAUTHORIZED' || message.includes('unauthorized')
  })

  if (hasUnauthenticatedGraphQLError) {
    handleUnauthenticated()
    return
  }

  if (hasUnauthorizedGraphQLError) {
    notifyUnauthorized()
  }
})

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authMiddleware, statusLink, httpLink]),
  cache: new InMemoryCache(),
})

export default client
