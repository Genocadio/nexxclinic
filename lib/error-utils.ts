import { ApolloError } from "@apollo/client";

/**
 * Safely extracts error message from Apollo client errors
 * Handles network errors, GraphQL errors, and generic Error objects
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return "";

  // Apollo Error object
  if (error instanceof ApolloError) {
    // Check for network errors first (like CORS)
    if (error.networkError) {
      const networkErr = error.networkError as any;
      if (networkErr.message) return networkErr.message;
      if (networkErr.statusCode) return `Network error (${networkErr.statusCode})`;
      return "Network connection failed";
    }

    // Check for GraphQL errors
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }

    // Fallback to main message
    if (error.message) return error.message;
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // String error
  if (typeof error === "string") {
    return error;
  }

  // Object with message property
  if (typeof error === "object" && "message" in error && typeof (error as any).message === "string") {
    return (error as any).message;
  }

  return "An unexpected error occurred";
}

/**
 * Check if error is a network connectivity issue (CORS, offline, etc.)
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApolloError && error.networkError) {
    const networkErr = error.networkError as any;
    return true;
  }
  return false;
}

/**
 * Check if error is a CORS-related error
 */
export function isCORSError(error: unknown): boolean {
  if (error instanceof ApolloError && error.networkError) {
    const networkErr = error.networkError as any;
    const message = networkErr.message || "";
    return (
      message.includes("CORS") ||
      message.includes("Same Origin Policy") ||
      message.includes("disallows reading")
    );
  }
  return false;
}
