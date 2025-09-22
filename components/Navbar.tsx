// components/Navbar.tsx
"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut, User, Building2, ChevronDown } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título - más hacia la izquierda */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Sistema de Convocatorias
              </h1>
              <p className="text-xs text-gray-300">Gestión Integral</p>
            </div>
          </div>

          {/* Espacio flexible */}
          <div className="flex-1"></div>
          
          {/* Usuario - pegado a la derecha */}
          <div className="flex items-center flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 border border-gray-600"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm text-left">
                  <p className="text-white font-medium">{session?.user?.name}</p>
                  <p className="text-gray-300 text-xs">
                    {session?.user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú desplegable */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {session?.user?.role === 'ADMIN' ? 'Administrador del Sistema' : 'Usuario del Sistema'}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay para cerrar menú */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </nav>
  )
}