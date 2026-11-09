import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { FontSizeProvider } from "@/lib/font-size-context"
import { UserSettingsSync } from "@/components/user-settings-sync"
import { ApolloWrapper } from "@/components/apollo-wrapper"
import { AuthGate } from "@/components/auth-gate"
import { ThemeProvider } from "@/lib/theme-context"
import { InvoiceViewerDialog } from "@/components/ui/invoice-viewer-dialog"
import { Providers } from "@/components/providers"
import { ClinicSseProvider } from "@/components/clinic-sse-provider"
import { NetworkStatusProvider } from "@/components/network-status-provider"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Med - CMS",
  description: "Professional clinic management system",
  authors: [{ name: "NexxServe", url: "https://nexxserve.tech" }],
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: [{ url: "/favicon.ico" }],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const runtimeConfigJson = JSON.stringify({
    API_BASE_URL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '',
  })

  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <meta name="apple-mobile-web-app-title" content="med" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__RUNTIME_CONFIG__ = ${runtimeConfigJson};`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            try {
              const stored = localStorage.getItem('theme');
                   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                   const mode = stored === 'light' || stored === 'dark'
                     ? stored
                     : prefersDark
                       ? 'dark'
                       : 'light';
              const root = document.documentElement;
              if (mode === 'dark') {
                root.classList.add('dark');
              } else {
                root.classList.remove('dark');
              }
              root.style.colorScheme = mode;

              const path = window.location.pathname || '';
              const isAuthRoute = path === '/auth' || path.startsWith('/auth/') || path === '/register' || path === '/create-password';
              const hasToken = !!localStorage.getItem('authToken');
              const storedFont = localStorage.getItem('app_font_size');

              if (!isAuthRoute && hasToken && storedFont) {
                root.setAttribute('data-font-size', storedFont);
              } else {
                root.setAttribute('data-font-size', 'md');
              }
            } catch (e) {
                   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                   document.documentElement.classList.toggle('dark', prefersDark);
                   document.documentElement.style.colorScheme = prefersDark ? 'dark' : 'light';
            }
          })();`,
        }}
      />
    </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased scrollbar-hide`}>
        <ThemeProvider>
          <Providers>
            <ApolloWrapper>
              <AuthProvider>
                <FontSizeProvider>
                  <ClinicSseProvider>
                    <NetworkStatusProvider>
                      <AuthGate>{children}</AuthGate>
                      <UserSettingsSync />
                    </NetworkStatusProvider>
                  </ClinicSseProvider>
                </FontSizeProvider>
              </AuthProvider>
            </ApolloWrapper>
          </Providers>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={3200}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={true}
          theme="light"
          className="nexx-toast-container"
          toastClassName="nexx-toast"
          progressClassName="nexx-toast-progress"
          transition={undefined}
          closeButton={true}
          stacked={false}
        />
        <InvoiceViewerDialog />
        <Analytics />
      </body>
    </html>
  )
}
