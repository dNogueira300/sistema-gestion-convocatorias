// app/(protected)/convocatorias/[id]/criterios/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Settings, Calculator, FileText, Users, Target, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"

interface Convocatoria {
  id: string
  tipo: string
  puesto: string
  codigoPuesto: string
  formulaNotaParcial: string
  formulaPuntajeEvaluacion: string
  condicionAprobacion: string
  observacionesDisponibles: string[]
}

// Definir las etapas del proceso de evaluación
const etapasEvaluacion = [
  {
    id: 'evaluacion-tecnica',
    nombre: 'Evaluación Técnica',
    descripcion: 'Criterios para la evaluación de conocimientos técnicos',
    icono: Calculator,
    color: 'orange',
    activa: true
  },
  {
    id: 'evaluacion-curricular',
    nombre: 'Evaluación Curricular',
    descripcion: 'Criterios para evaluación de experiencia y formación',
    icono: FileText,
    color: 'blue',
    activa: false // Por implementar
  },
  {
    id: 'entrevista-personal',
    nombre: 'Entrevista Personal',
    descripcion: 'Criterios para evaluación de competencias personales',
    icono: Users,
    color: 'green',
    activa: false // Por implementar
  },
  {
    id: 'puntaje-final',
    nombre: 'Puntaje Final',
    descripcion: 'Configuración del cálculo de puntaje total',
    icono: Target,
    color: 'purple',
    activa: false // Por implementar
  }
]

export default function CriteriosEvaluacionPage() {
  const params = useParams()
  const router = useRouter()
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConvocatoria = async () => {
      try {
        const response = await fetch(`/api/convocatorias/${params.id}/criterios`)
        if (response.ok) {
          const data = await response.json()
          setConvocatoria(data)
        } else {
          toast.error('Error al cargar los criterios')
          router.push(`/convocatorias/${params.id}`)
        }
      } catch {
        toast.error('Error al cargar los criterios')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchConvocatoria()
    }
  }, [params.id, router])

  const getColorClasses = (color: string, activa: boolean) => {
    if (!activa) {
      return {
        bg: 'bg-gray-100',
        icon: 'text-gray-400',
        border: 'border-gray-200',
        text: 'text-gray-500',
        button: 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }
    }

    const colors = {
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-200',
        text: 'text-orange-800',
        button: 'bg-orange-600 hover:bg-orange-700 text-white'
      },
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600', 
        border: 'border-blue-200',
        text: 'text-blue-800',
        button: 'bg-blue-600 hover:bg-blue-700 text-white'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200', 
        text: 'text-green-800',
        button: 'bg-green-600 hover:bg-green-700 text-white'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200',
        text: 'text-purple-800',
        button: 'bg-purple-600 hover:bg-purple-700 text-white'
      }
    }
    
    return colors[color as keyof typeof colors] || colors.orange
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!convocatoria) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Convocatoria no encontrada</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link href="/convocatorias" className="text-gray-600 hover:text-red-600 transition-colors">
          Convocatorias
        </Link>
        <span className="text-gray-400">/</span>
        <Link href={`/convocatorias/${convocatoria.id}`} className="text-gray-600 hover:text-red-600 transition-colors">
          {convocatoria.tipo}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Criterios de Evaluación</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-indigo-100 rounded-xl">
            <Settings className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Criterios de Evaluación</h1>
            <p className="mt-2 text-lg text-gray-600">
              Configura los criterios y fórmulas para cada etapa del proceso de evaluación
            </p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>Convocatoria: {convocatoria.puesto}</span>
              <span>•</span>
              <span>Código: {convocatoria.codigoPuesto}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Información del proceso */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Proceso de Evaluación</h3>
            <p className="text-blue-800 mb-3">
              El proceso de evaluación consta de múltiples etapas. Configure cada una según los requisitos específicos de la convocatoria.
            </p>
            <div className="flex flex-wrap gap-2">
              {etapasEvaluacion.map((etapa, index) => (
                <span 
                  key={etapa.id}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    etapa.activa 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {index + 1}. {etapa.nombre}
                  {etapa.activa && <span className="ml-1 text-xs">✓</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de etapas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {etapasEvaluacion.map((etapa) => {
          const colors = getColorClasses(etapa.color, etapa.activa)
          const Icon = etapa.icono

          return (
            <div 
              key={etapa.id}
              className={`${colors.bg} ${colors.border} border rounded-xl p-6 transition-all duration-200 ${
                etapa.activa ? 'hover:shadow-md' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-white rounded-lg shadow-sm`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text}`}>
                      {etapa.nombre}
                    </h3>
                    {!etapa.activa && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        Próximamente
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className={`text-sm ${colors.text} mb-6 opacity-80`}>
                {etapa.descripcion}
              </p>

              {etapa.activa ? (
                <Link 
                  href={`/convocatorias/${convocatoria.id}/criterios/${etapa.id}`}
                  className={`inline-flex items-center justify-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${colors.button}`}
                >
                  Configurar criterios
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <button 
                  disabled
                  className={`inline-flex items-center justify-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${colors.button}`}
                >
                  En desarrollo
                </button>
              )}

              {/* Indicador de configuración */}
              {etapa.activa && etapa.id === 'evaluacion-tecnica' && (
                <div className="mt-3 flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Criterios configurados
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Información importante</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Los criterios configurados se aplicarán automáticamente a todas las evaluaciones nuevas.</p>
          <p>• Los cambios en los criterios no afectarán las evaluaciones ya registradas.</p>
          <p>• Cada etapa puede tener sus propias fórmulas y condiciones de aprobación.</p>
          <p>• El puntaje final se calculará combinando todas las etapas configuradas.</p>
        </div>
      </div>
    </div>
  )
}