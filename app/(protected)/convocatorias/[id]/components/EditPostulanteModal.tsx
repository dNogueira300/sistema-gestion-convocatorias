// app/(protected)/convocatorias/[id]/components/EditPostulanteModal.tsx
"use client"

import { useState } from "react"
import { X, Save } from "lucide-react"
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

interface EditPostulanteModalProps {
  postulante: Postulante
  convocatoriaId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function EditPostulanteModal({ 
  postulante, 
  convocatoriaId, 
  isOpen, 
  onClose, 
  onSuccess 
}: EditPostulanteModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    documentoIdentidad: postulante.documentoIdentidad,
    nombreCompleto: postulante.nombreCompleto,
    fechaNacimiento: new Date(postulante.fechaNacimiento).toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/convocatorias/${convocatoriaId}/postulantes/${postulante.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Postulante actualizado correctamente')
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al actualizar el postulante')
      }
    } catch {
      toast.error('Error al actualizar el postulante')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Editar Postulante</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-documentoIdentidad" className="block text-sm font-medium text-gray-700 mb-2">
                Documento de Identidad
              </label>
              <input
                type="text"
                id="edit-documentoIdentidad"
                required
                value={formData.documentoIdentidad}
                onChange={(e) => setFormData({...formData, documentoIdentidad: e.target.value})}
                className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="DNI o CE"
              />
            </div>

            <div>
              <label htmlFor="edit-nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="edit-nombreCompleto"
                required
                value={formData.nombreCompleto}
                onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
                className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombres y Apellidos"
              />
            </div>

            <div>
              <label htmlFor="edit-fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="edit-fechaNacimiento"
                required
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {postulante.evaluacionTecnica && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> Este postulante ya tiene una evaluación técnica registrada. 
                  Los cambios en los datos personales no afectarán la evaluación.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}