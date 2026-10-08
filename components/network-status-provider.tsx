"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { notifyNavigationStart, usePathname, useSearchParams } from "@/lib/navigation"
import { useApolloClient } from "@apollo/client"
import { getNetworkConnectedSnapshot, reportNetworkStatus, subscribeToNetworkStatus } from "@/lib/network-connectivity"
import { PageLoading } from "@/components/ui/page-loading"

interface NetworkContextType {
  isConnected: boolean;
  isConnecting: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isConnecting: false,
});

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentRoute = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`
  const isConnected = useSyncExternalStore(
    subscribeToNetworkStatus,
    getNetworkConnectedSnapshot,
    () => true,
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [navigationPending, setNavigationPending] = useState(false)
  const [navigationStartPath, setNavigationStartPath] = useState<string | null>(null)
  const navigationTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // Listen to browser online/offline events
    const handleOnlineStatus = () => {
      reportNetworkStatus(true);
      setIsConnecting(false);
    };

    const handleOfflineStatus = () => {
      reportNetworkStatus(false);
      setIsConnecting(false);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    // Listen to Apollo network errors (CORS, server down, etc.)
    const handleApolloNetworkError = () => {
      // If we get a network error, consider it disconnected
      reportNetworkStatus(false);
      setIsConnecting(false);
    };
    const handleApolloNetworkRecovered = () => {
      reportNetworkStatus(true)
      setIsConnecting(false)
    }

    window.addEventListener("apollo-network-error", handleApolloNetworkError);
    window.addEventListener("apollo-network-recovered", handleApolloNetworkRecovered)
    const handleRetry = () => {
      void client.reFetchObservableQueries().then(
        (results) => {
          reportNetworkStatus(results.every((result) => !result.error))
          setIsConnecting(false)
        },
        () => {
          reportNetworkStatus(false)
          setIsConnecting(false)
        },
      )
    }
    window.addEventListener("app:retry-network", handleRetry)

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
      window.removeEventListener("apollo-network-error", handleApolloNetworkError);
      window.removeEventListener("apollo-network-recovered", handleApolloNetworkRecovered)
      window.removeEventListener("app:retry-network", handleRetry)
    };
  }, [client]);

  useEffect(() => {
    const handleNavigationStart = (event: Event) => {
      const customEvent = event as CustomEvent<{
        fromPath?: string
      }>
      if (navigationTimeoutRef.current !== null) {
        window.clearTimeout(navigationTimeoutRef.current)
      }
      setNavigationStartPath(customEvent.detail?.fromPath || window.location.pathname)
      setNavigationPending(true)
      navigationTimeoutRef.current = window.setTimeout(() => {
        setNavigationPending(false)
        setNavigationStartPath(null)
      }, 12000)
    }
    const handleNavigationEnd = () => {
      if (navigationTimeoutRef.current !== null) window.clearTimeout(navigationTimeoutRef.current)
      setNavigationPending(false)
      setNavigationStartPath(null)
    }

    window.addEventListener("app:navigation-start", handleNavigationStart)
    window.addEventListener("app:navigation-end", handleNavigationEnd)
    const handleInternalLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const anchor = (event.target as Element | null)?.closest("a")
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return

      const target = new URL(anchor.href, window.location.href)
      if (
        target.origin === window.location.origin &&
        `${target.pathname}${target.search}` !== `${window.location.pathname}${window.location.search}`
      ) {
        notifyNavigationStart(target.href)
      }
    }
    document.addEventListener("click", handleInternalLinkClick, true)
    return () => {
      window.removeEventListener("app:navigation-start", handleNavigationStart)
      window.removeEventListener("app:navigation-end", handleNavigationEnd)
      document.removeEventListener("click", handleInternalLinkClick, true)
      if (navigationTimeoutRef.current !== null) window.clearTimeout(navigationTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!navigationPending || !navigationStartPath || navigationStartPath === currentRoute) return
    if (navigationTimeoutRef.current !== null) {
      window.clearTimeout(navigationTimeoutRef.current)
    }
    const timeout = window.setTimeout(() => {
      setNavigationPending(false)
      setNavigationStartPath(null)
    }, 450)
    return () => window.clearTimeout(timeout)
  }, [currentRoute, navigationPending, navigationStartPath])

  return (
    <NetworkContext.Provider value={{ isConnected, isConnecting }}>
      {children}
      {navigationPending && (
        <div className="pointer-events-none fixed inset-0 z-[120]">
          <PageLoading className="min-h-full" />
        </div>
      )}
      <NetworkStatusIndicator
        isConnected={isConnected}
        isConnecting={isConnecting}
        onTryAgain={() => {
          setIsConnecting(true);
          window.dispatchEvent(new Event("app:retry-network"))
        }}
      />
    </NetworkContext.Provider>
  );
}

export function useNetworkStatus() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetworkStatus must be used within NetworkStatusProvider");
  }
  return context;
}

/**
 * Visual indicator for network status with lightweight retry action.
 */
function NetworkStatusIndicator({
  isConnected,
  isConnecting,
  onTryAgain,
}: {
  isConnected: boolean;
  isConnecting: boolean;
  onTryAgain: () => void;
}) {
  if (isConnected) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <button
        type="button"
        onClick={onTryAgain}
        className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 shadow-lg transition hover:bg-amber-100"
      >
        <span className="text-lg animate-bounce" aria-hidden="true">🔄</span>
        <span>{isConnecting ? "Trying again..." : "Try again"}</span>
      </button>
    </div>
  );
}
