import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, type NormalizedCacheObject } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { toastResponseStatus, handleUnauthenticatedSession } from '@/lib/response-handler'
import { getRuntimeConfig } from '@/lib/runtime-config'

function getUri() {
  if (typeof window !== 'undefined') {
    return '/graphql'
  }
  const base = getRuntimeConfig().API_BASE_URL || ''
  return `${base}/graphql`
}

function createHttpLink() {
  return new HttpLink({ uri: getUri(), fetch })
}

const notifyUnauthorized = () => {
  if (typeof window === 'undefined') {
    return
  }

  toastResponseStatus('UNAUTHORISED', 'Action not allowed: no access available.',)
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

    // Most operations return one top-level field e.g. { listUsers: { status, ... } }
    const topLevelResults = Object.values(data as Record<string, unknown>)
    const statuses = topLevelResults
      .map(extractStatusFromPayload)
      .filter((status): status is string => Boolean(status))

    if (statuses.includes('UNAUTHENTICATED')) {
      // Only treat as session expiry if the user had a token (i.e. was logged in).
      // If there is no token, the query fired before auth resolved — ignore it.
      const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('authToken'))
      if (hasToken) {
        handleUnauthenticatedSession('Your session has expired. Please login again.')
      }
      return result
    }

    if (statuses.includes('UNAUTHORISED') || statuses.includes('UNAUTHORIZED')) {
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
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  // Never send a token for auth operations — a stale/expired token in
  // localStorage would cause the backend to reject with 401 before the
  // mutation can execute (login, register, refresh, logout).
  const opName = operation.operationName || '';
  const isAuthOp = /^Login$|^Register$|^RefreshToken$|^Logout$/i.test(opName);
  const shouldAttach = token && !isAuthOp;

  // Add the authorization header to the request
  // Only set the header when a token exists — sending an empty string
  // causes some backends to treat the request as unauthenticated even
  // though the header is technically present.
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(shouldAttach ? { authorization: `Bearer ${token}` } : {}),
    },
  }))

  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
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
      const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('authToken'))
      if (hasToken) {
        handleUnauthenticatedSession('Your session has expired. Please login again.')
      }
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
    return code === 'UNAUTHORIZED' || code === 'UNAUTHORISED' || message.includes('unauthorized') || message.includes('unauthorised')
  })

  if (hasUnauthenticatedGraphQLError) {
    const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('authToken'))
    if (hasToken) {
      handleUnauthenticatedSession('Your session has expired. Please login again.')
    }
    return
  }

  if (hasUnauthorizedGraphQLError) {
    notifyUnauthorized()
  }
})

let client: ApolloClient<NormalizedCacheObject> | null = null

export function getApolloClient(): ApolloClient<NormalizedCacheObject> {
  if (!client) {
    client = new ApolloClient({
      link: ApolloLink.from([errorLink, authMiddleware, statusLink, createHttpLink()]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              // Merge paginated lists so refetches update the cache properly
              visitBillings: {
                keyArgs: ["visitId"],
                merge(existing, incoming) {
                  return incoming
                },
              },
              // Single-object queries: always replace with latest
              visitBilling: {
                keyArgs: ["visitId"],
                merge(_existing, incoming) {
                  return incoming
                },
              },
              visit: {
                keyArgs: ["id"],
                merge(_existing, incoming) {
                  return incoming
                },
              },
              listProducts: {
                keyArgs: false,
                merge(_existing, incoming) {
                  return incoming
                },
              },
              listPatients: {
                keyArgs: false,
                merge(_existing, incoming) {
                  return incoming
                },
              },
            },
          },
          // Use the natural 'id' field for cache normalization
          VisitBilling: {
            keyFields: ["id"],
          },
          VisitDepartmentBilling: {
            keyFields: ["id"],
          },
          DepartmentInsuranceBilling: {
            keyFields: ["id"],
          },
          VisitBillingItem: {
            keyFields: ["id"],
          },
          Visit: {
            keyFields: ["id"],
          },
          Patient: {
            keyFields: ["id"],
          },
          PatientInsurance: {
            keyFields: ["id"],
          },
          Product: {
            keyFields: ["id"],
          },
          Worker: {
            keyFields: ["id"],
          },
          Department: {
            keyFields: ["id"],
          },
        },
      }),
    })
  }
  return client
}
