// app/dashboard/page.tsx
"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { FileText, Users, ClipboardList, TrendingUp, Calendar, Clock, Activity, Plus } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalConvocatorias: number
  convocatoriasActivas: number
  totalPostulantes: number
  evaluacionesPendientes: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalConvocatorias: 0,
    convocatoriasActivas: 0,
    totalPostulantes: 0,
    evaluacionesPendientes: 0,
  })

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  const statCards = [
    {
      name: "Total Convocatorias",
      value: stats.totalConvocatorias,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      name: "Convocatorias Activas",
      value: stats.convocatoriasActivas,
      icon: TrendingUp,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      name: "Total Postulantes",
      value: stats.totalPostulantes,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      name: "Evaluaciones Pendientes",
      value: stats.evaluacionesPendientes,
      icon: ClipboardList,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ]

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const currentTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Bienvenido, {session?.user?.name}
            </h1>
            <p className="text-gray-600 mb-3 text-lg">
              Panel de control del sistema de convocatorias
            </p>
            <div className="flex items-center text-sm text-gray-500 space-x-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {currentDate}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {currentTime}
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de estadísticas con colores mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="relative bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Fondo con gradiente sutil */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`}></div>
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.iconBg} shadow-sm`}>
                  <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {card.value.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {card.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de contenido principal mejorada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actividad reciente - mejorada con más contenido */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Activity className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Actividad Reciente
                  </h3>
                </div>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline">
                  Ver todo
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity className="h-10 w-10 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  No hay actividad reciente
                </h4>
                <p className="text-gray-500 text-base max-w-md mx-auto">
                  Las actividades del sistema como nuevas convocatorias, postulantes y evaluaciones aparecerán aquí.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos rápidos mejorados */}
        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Plus className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Accesos Rápidos
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <Link href="/convocatorias/nueva">
                <button className="w-full flex items-center p-4 rounded-xl hover:bg-red-50 transition-colors text-left border border-gray-100 hover:border-red-200 group">
                  <div className="p-2 bg-red-100 rounded-lg mr-4 group-hover:bg-red-200 transition-colors">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <span className="text-base font-semibold text-gray-900 block">Nueva Convocatoria</span>
                    <span className="text-sm text-gray-500">Crear nueva convocatoria</span>
                  </div>
                </button>
              </Link>

              <Link href="/convocatorias">
                <button className="w-full flex items-center p-4 rounded-xl hover:bg-blue-50 transition-colors text-left border border-gray-100 hover:border-blue-200 group">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-base font-semibold text-gray-900 block">Ver Postulantes</span>
                    <span className="text-sm text-gray-500">Gestionar candidatos</span>
                  </div>
                </button>
              </Link>

              <button className="w-full flex items-center p-4 rounded-xl hover:bg-green-50 transition-colors text-left border border-gray-100 hover:border-green-200 group">
                <div className="p-2 bg-green-100 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                  <ClipboardList className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <span className="text-base font-semibold text-gray-900 block">Evaluaciones</span>
                  <span className="text-sm text-gray-500">Procesos de evaluación</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}