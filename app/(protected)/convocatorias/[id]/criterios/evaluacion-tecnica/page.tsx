// app/(protected)/convocatorias/[id]/criterios/evaluacion-tecnica/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Save, RotateCcw, Calculator, AlertTriangle, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const criteriosSchema = z.object({
  formulaNotaParcial: z.string().min(1, "La fórmula de nota parcial es requerida"),
  formulaPuntajeEvaluacion: z.string().min(1, "La fórmula de puntaje de evaluación es requerida"),
  condicionAprobacion: z.string().min(1, "La condición de aprobación es requerida"),
  observacionesDisponibles: z.array(z.string()).min(1, "Debe haber al menos una observación disponible"),
})

type CriteriosForm = z.infer<typeof criteriosSchema>

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

export default function EvaluacionTecnicaCriteriosPage() {
  const params = useParams()
  const router = useRouter()
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newObservacion, setNewObservacion] = useState("")
  const [testNota, setTestNota] = useState<number>(15)
  const [testResult, setTestResult] = useState<{
    notaParcial: number
    puntajeEvaluacion: number
    condicion: string
    error?: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CriteriosForm>({
    resolver: zodResolver(criteriosSchema),
  })

  const watchedValues = watch()

  useEffect(() => {
    const fetchConvocatoria = async () => {
      try {
        const response = await fetch(`/api/convocatorias/${params.id}/criterios`)
        if (response.ok) {
          const data = await response.json()
          setConvocatoria(data)
          reset({
            formulaNotaParcial: data.formulaNotaParcial,
            formulaPuntajeEvaluacion: data.formulaPuntajeEvaluacion,
            condicionAprobacion: data.condicionAprobacion,
            observacionesDisponibles: data.observacionesDisponibles,
          })
        } else {
          toast.error('Error al cargar los criterios')
          router.push(`/convocatorias/${params.id}/criterios`)
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
  }, [params.id, router, reset])

  const onSubmit = async (data: CriteriosForm) => {
    setSaving(true)

    try {
      const response = await fetch(`/api/convocatorias/${params.id}/criterios`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Criterios de evaluación técnica actualizados correctamente')
        const updatedData = await response.json()
        setConvocatoria(updatedData)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al actualizar los criterios')
      }
    } catch {
      toast.error('Error al actualizar los criterios')
    } finally {
      setSaving(false)
    }
  }

  const addObservacion = () => {
    if (!newObservacion.trim()) return
    
    const currentObservaciones = watchedValues.observacionesDisponibles || []
    if (currentObservaciones.includes(newObservacion.trim())) {
      toast.error('Esta observación ya existe')
      return
    }

    setValue('observacionesDisponibles', [...currentObservaciones, newObservacion.trim()])
    setNewObservacion("")
  }

  const removeObservacion = (index: number) => {
    const currentObservaciones = watchedValues.observacionesDisponibles || []
    setValue('observacionesDisponibles', currentObservaciones.filter((_, i) => i !== index))
  }

  const testFormula = async () => {
    try {
      const response = await fetch(`/api/convocatorias/${params.id}/test-criterios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notaObtenida: testNota,
          formulaNotaParcial: watchedValues.formulaNotaParcial,
          formulaPuntajeEvaluacion: watchedValues.formulaPuntajeEvaluacion,
          condicionAprobacion: watchedValues.condicionAprobacion,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setTestResult(result)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al probar las fórmulas')
        setTestResult({ error: 'Error en las fórmulas', notaParcial: 0, puntajeEvaluacion: 0, condicion: 'NO_APTO' })
      }
    } catch {
      toast.error('Error al probar las fórmulas')
      setTestResult({ error: 'Error de conexión', notaParcial: 0, puntajeEvaluacion: 0, condicion: 'NO_APTO' })
    }
  }

  const resetToDefaults = () => {
    setValue('formulaNotaParcial', 'nota * 20 / 30')
    setValue('formulaPuntajeEvaluacion', 'notaParcial * 0.3')
    setValue('condicionAprobacion', 'notaParcial >= 13')
    setValue('observacionesDisponibles', [
      "NO ALCANZÓ EL PUNTAJE MÍNIMO APROBATORIO",
      "NO SE PRESENTÓ A LA EVALUACIÓN TÉCNICA",
      "DESCALIFICADO POR FALLA DE CONEXIÓN",
      "DESCALIFICADO POR INCURRIR FALTA EN EL MOMENTO DE LA EVALUACIÓN"
    ])
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
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
        <Link href={`/convocatorias/${convocatoria.id}/criterios`} className="text-gray-600 hover:text-red-600 transition-colors">
          Criterios
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Evaluación Técnica</span>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-orange-500 rounded-xl">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluación Técnica</h1>
            <p className="mt-2 text-lg text-orange-800">
              Configura las fórmulas y criterios para evaluar conocimientos técnicos de los postulantes
            </p>
            <div className="mt-2 flex items-center space-x-4 text-sm text-orange-700">
              <span>Convocatoria: {convocatoria.puesto}</span>
              <span>•</span>
              <span>Código: {convocatoria.codigoPuesto}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de criterios */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Configuración de Criterios</h2>
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Valores por defecto
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              {/* Fórmula Nota Parcial */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Fórmula para Nota Parcial
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Convierte la nota obtenida (0-30) a una escala de 0-20. 
                  Usa <code className="bg-gray-100 px-1 rounded">nota</code> como variable.
                </p>
                <input
                  {...register('formulaNotaParcial')}
                  type="text"
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="nota * 20 / 30"
                />
                {errors.formulaNotaParcial && (
                  <p className="mt-2 text-sm text-red-600">{errors.formulaNotaParcial.message}</p>
                )}
              </div>

              {/* Fórmula Puntaje Evaluación */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Fórmula para Puntaje de Evaluación
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Calcula el puntaje final basado en la nota parcial. 
                  Usa <code className="bg-gray-100 px-1 rounded">notaParcial</code> como variable.
                </p>
                <input
                  {...register('formulaPuntajeEvaluacion')}
                  type="text"
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="notaParcial * 0.3"
                />
                {errors.formulaPuntajeEvaluacion && (
                  <p className="mt-2 text-sm text-red-600">{errors.formulaPuntajeEvaluacion.message}</p>
                )}
              </div>

              {/* Condición de Aprobación */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Condición de Aprobación
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Expresión booleana que determina si un postulante está APTO. 
                  Usa <code className="bg-gray-100 px-1 rounded">notaParcial</code> como variable.
                </p>
                <input
                  {...register('condicionAprobacion')}
                  type="text"
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="notaParcial >= 13"
                />
                {errors.condicionAprobacion && (
                  <p className="mt-2 text-sm text-red-600">{errors.condicionAprobacion.message}</p>
                )}
              </div>

              {/* Observaciones Disponibles */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Observaciones Disponibles
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Lista de observaciones predefinidas para las evaluaciones técnicas
                </p>
                
                <div className="space-y-3">
                  {watchedValues.observacionesDisponibles?.map((obs, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-1 text-sm">{obs}</span>
                      <button
                        type="button"
                        onClick={() => removeObservacion(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newObservacion}
                      onChange={(e) => setNewObservacion(e.target.value)}
                      placeholder="Nueva observación..."
                      className="flex-1 border-2 border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={addObservacion}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                {errors.observacionesDisponibles && (
                  <p className="mt-2 text-sm text-red-600">{errors.observacionesDisponibles.message}</p>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  href={`/convocatorias/${convocatoria.id}/criterios`}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Volver
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Criterios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Panel de prueba */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                Probar Fórmulas
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nota de Prueba (0-30)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={testNota}
                  onChange={(e) => setTestNota(parseFloat(e.target.value) || 0)}
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={testFormula}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Probar Cálculo
              </button>

              {testResult && (
                <div className={`p-4 rounded-lg ${testResult.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                  {testResult.error ? (
                    <div className="flex items-center text-red-800">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      <span className="font-medium">Error en las fórmulas</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-green-800 mb-3">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Cálculo exitoso</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Nota Parcial:</span> {testResult.notaParcial}
                        </div>
                        <div>
                          <span className="font-medium">Puntaje:</span> {testResult.puntajeEvaluacion}
                        </div>
                        <div>
                          <span className={`font-medium px-2 py-1 rounded text-xs ${
                            testResult.condicion === 'APTO' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {testResult.condicion}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}