"use client"

import { ApolloProvider } from "@apollo/client"
import { getApolloClient } from "@/lib/apollo-client"

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>
}