import clsx from "clsx"
import type { Metadata } from "next"
import { nextSsrCssPlugin } from "polipo/next"
import { FigmaProvider, devPlugin, googleFontsPlugin } from "polipo/react"

import "./globals.css"

export const metadata: Metadata = {
  title: "Quick MDE",
  description:
    "Quick MDE is a Markdown editor that allows you to write and preview Markdown in real-time.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={clsx("h-screen bg-white antialiased")}>
        <FigmaProvider
          plugins={[
            ...(process.env.NODE_ENV === "development" ? [devPlugin] : []),
            nextSsrCssPlugin,
            googleFontsPlugin,
          ]}
        >
          {children}
        </FigmaProvider>
      </body>
    </html>
  )
}
