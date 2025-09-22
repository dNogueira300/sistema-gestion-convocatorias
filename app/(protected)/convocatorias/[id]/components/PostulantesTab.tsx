// app/(protected)/convocatorias/[id]/components/PostulantesTab.tsx
"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import toast from "react-hot-toast"
import EditPostulanteModal from "./EditPostulanteModal"
import DeletePostulanteModal from "./DeletePostulanteModal"

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

interface PostulantesTabProps {
  convocatoriaId: string
  postulantes: Postulante[]
  onPostulanteAdded: () => void
}

export default function PostulantesTab({ 
  convocatoriaId, 
  postulantes, 
  onPostulanteAdded 
}: PostulantesTabProps) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingPostulante, setEditingPostulante] = useState<Postulante | null>(null)
  const [deletingPostulante, setDeletingPostulante] = useState<Postulante | null>(null)
  const [formData, setFormData] = useState({
    documentoIdentidad: '',
    nombreCompleto: '',
    fechaNacimiento: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/convocatorias/${convocatoriaId}/postulantes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Postulante agregado correctamente')
        setFormData({
          documentoIdentidad: '',
          nombreCompleto: '',
          fechaNacimiento: ''
        })
        setShowForm(false)
        onPostulanteAdded()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Error al agregar el postulante')
      }
    } catch {
      toast.error('Error al agregar el postulante')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (postulante: Postulante) => {
    setEditingPostulante(postulante)
  }

  const handleDelete = (postulante: Postulante) => {
    setDeletingPostulante(postulante)
  }

  const handleEditSuccess = () => {
    setEditingPostulante(null)
    onPostulanteAdded()
  }

  const handleDeleteSuccess = () => {
    setDeletingPostulante(null)
    onPostulanteAdded()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gestión de Postulantes</h2>
          <p className="mt-1 text-sm text-gray-600">
            Lista de candidatos registrados para esta convocatoria
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Postulante
        </button>
      </div>

      {/* Formulario de nuevo postulante */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Postulante</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="documentoIdentidad" className="block text-sm font-medium text-gray-700 mb-2">
                  Documento de Identidad
                </label>
                <input
                  type="text"
                  id="documentoIdentidad"
                  required
                  value={formData.documentoIdentidad}
                  onChange={(e) => setFormData({...formData, documentoIdentidad: e.target.value})}
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="DNI o CE"
                />
              </div>

              <div>
                <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombreCompleto"
                  required
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({...formData, nombreCompleto: e.target.value})}
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nombres y Apellidos"
                />
              </div>

              <div>
                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  required
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de postulantes */}
      <div className="bg-white rounded-lg border border-gray-200">
        {postulantes.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay postulantes registrados</h3>
            <p className="text-gray-500 mb-4">Comienza agregando el primer postulante</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Postulante
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {postulantes.map((postulante, index) => (
              <div key={postulante.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        {postulante.nombreCompleto}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {postulante.documentoIdentidad} • {new Date(postulante.fechaNacimiento).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {postulante.evaluacionTecnica ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Evaluado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                    )}
                    <button 
                      onClick={() => handleEdit(postulante)}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar postulante"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(postulante)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors"
                      title="Eliminar postulante"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {editingPostulante && (
        <EditPostulanteModal
          postulante={editingPostulante}
          convocatoriaId={convocatoriaId}
          isOpen={!!editingPostulante}
          onClose={() => setEditingPostulante(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingPostulante && (
        <DeletePostulanteModal
          postulante={deletingPostulante}
          convocatoriaId={convocatoriaId}
          isOpen={!!deletingPostulante}
          onClose={() => setDeletingPostulante(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  )
}