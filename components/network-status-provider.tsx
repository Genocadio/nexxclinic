"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface NetworkContextType {
  isConnected: boolean;
  isConnecting: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isConnecting: false,
});

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Listen to browser online/offline events
    const handleOnlineStatus = () => {
      setIsConnected(true);
      setIsConnecting(false);
    };

    const handleOfflineStatus = () => {
      setIsConnected(false);
      setIsConnecting(false);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    // Listen to Apollo network errors (CORS, server down, etc.)
    const handleApolloNetworkError = (event: any) => {
      const { detail } = event;

      // If we get a network error, consider it disconnected
      setIsConnected(false);
      setIsConnecting(false);

      // Do not surface raw network messages.
      void detail;
    };

    window.addEventListener("apollo-network-error", handleApolloNetworkError);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
      window.removeEventListener("apollo-network-error", handleApolloNetworkError);
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, isConnecting }}>
      {children}
      <NetworkStatusIndicator
        isConnected={isConnected}
        isConnecting={isConnecting}
        onTryAgain={() => {
          setIsConnecting(true);
          window.location.reload();
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
