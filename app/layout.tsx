import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ApolloWrapper } from "@/components/apollo-wrapper"
import { AuthGate } from "@/components/auth-gate"
import { ThemeProvider } from "@/lib/theme-context"
import { InvoiceViewerDialog } from "@/components/ui/invoice-viewer-dialog"
import { Providers } from "@/components/providers"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

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
            } catch (e) {
                   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                   document.documentElement.classList.toggle('dark', prefersDark);
                   document.documentElement.style.colorScheme = prefersDark ? 'dark' : 'light';
            }
          })();`,
        }}
      />
    </head>
      <body className={`font-sans antialiased scrollbar-hide`}>
        <ThemeProvider>
          <Providers>
            <ApolloWrapper>
              <AuthProvider>
                <AuthGate>{children}</AuthGate>
              </AuthProvider>
            </ApolloWrapper>
          </Providers>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={true}
          draggable={false}
          pauseOnHover={true}
          theme="colored"
          className="nexx-toast-container"
          toastClassName="nexx-toast"
          progressClassName="nexx-toast-progress"
          transition={undefined}
          limit={3}
          closeButton={true}
          stacked={false}
        />
        <InvoiceViewerDialog />
        <Analytics />
      </body>
    </html>
  )
}
