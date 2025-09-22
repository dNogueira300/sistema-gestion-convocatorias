// components/Sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Home,
  FileText,
  Users,
  ClipboardList,
  Settings,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: Home, 
    roles: ["ADMIN", "USER"],
    description: "Panel principal"
  },
  { 
    name: "Convocatorias", 
    href: "/convocatorias", 
    icon: FileText, 
    roles: ["ADMIN", "USER"],
    description: "Gestionar convocatorias"
  },
  { 
    name: "Postulantes", 
    href: "/postulantes", 
    icon: Users, 
    roles: ["ADMIN", "USER"],
    description: "Lista de candidatos"
  },
  { 
    name: "Evaluaciones", 
    href: "/evaluaciones", 
    icon: ClipboardList, 
    roles: ["ADMIN", "USER"],
    description: "Procesos de evaluación"
  },
  { 
    name: "Configuración", 
    href: "/configuracion", 
    icon: Settings, 
    roles: ["ADMIN"],
    description: "Ajustes del sistema"
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(session?.user?.role as string)
  )

  return (
    <div className="flex flex-col w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700">
      {/* Header del sidebar */}
      <div className="flex-shrink-0 px-4 py-6 border-b border-gray-700">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <p className="text-white font-semibold">Panel de Control</p>
          <p className="text-gray-300 text-xs mt-1">
            {session?.user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <div className="flex items-center flex-1">
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                  }`}
                />
                <div className="flex-1">
                  <div className={`font-medium ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-red-100' : 'text-gray-500 group-hover:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-white" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-300">Sistema v1.0</p>
            <p className="text-xs text-gray-400">Gestión de Convocatorias</p>
          </div>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}