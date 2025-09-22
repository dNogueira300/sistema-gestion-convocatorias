// app/(protected)/convocatorias/[id]/components/DeletePostulanteModal.tsx
"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface Postulante {
  id: string
  documentoIdentidad: string
  nombreCompleto: string
  fechaNacimiento: string
  evaluacionTecnica?: {
    id: string
    notaObtenida: number
    notaParcial: number
    puntajeEvaluacion: number
    condicion: 'APTO' | 'NO_APTO'
    observaciones?: string
  }
}

interface DeletePostulanteModalProps {
  postulante: Postulante
  convocatoriaId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function DeletePostulanteModal({ 
  postulante, 
  convocatoriaId, 
  isOpen, 
  onClose, 
  onSuccess 
}: DeletePostulanteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/convocatorias/${convocatoriaId}/postulantes/${postulante.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Postulante eliminado correctamente')
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al eliminar el postulante')
      }
    } catch {
      toast.error('Error al eliminar el postulante')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Eliminar Postulante
          </h3>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            ¿Estás seguro de que deseas eliminar a <strong>{postulante.nombreCompleto}</strong>?
            {postulante.evaluacionTecnica && (
              <span className="block mt-2 text-red-600 font-medium">
                También se eliminará su evaluación técnica.
              </span>
            )}
            Esta acción no se puede deshacer.
          </p>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}