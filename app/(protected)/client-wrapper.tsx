// app/(protected)/client-wrapper.tsx
"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from 'react-hot-toast'
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SessionProvider>
  )
}