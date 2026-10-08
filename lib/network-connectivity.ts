"use client"

type NetworkListener = () => void

let isConnected =
  typeof navigator === "undefined" || navigator.onLine

const listeners = new Set<NetworkListener>()

export function getNetworkConnectedSnapshot() {
  return isConnected
}

export function subscribeToNetworkStatus(listener: NetworkListener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function reportNetworkStatus(connected: boolean) {
  if (isConnected === connected) return
  isConnected = connected
  listeners.forEach((listener) => listener())
}
