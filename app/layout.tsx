import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ApolloWrapper } from "@/components/apollo-wrapper"
import { AuthGate } from "@/components/auth-gate"
import { ThemeProvider } from "@/lib/theme-context"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NexxClinic - CMS",
  description: "Professional clinic management system",
  authors: [{ name: "NexxServe", url: "https://nexxserve.tech" }],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <meta name="apple-mobile-web-app-title" content="NexxMed" />
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
          <ApolloWrapper>
            <AuthProvider>
              <AuthGate>{children}</AuthGate>
            </AuthProvider>
          </ApolloWrapper>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Analytics />
      </body>
    </html>
  )
}
