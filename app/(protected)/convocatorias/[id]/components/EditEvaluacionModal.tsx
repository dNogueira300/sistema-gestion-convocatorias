// app/(protected)/convocatorias/[id]/components/EditEvaluacionModal.tsx
"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";

interface EvaluacionTecnica {
  id: string;
  notaObtenida: number;
  notaParcial: number;
  puntajeEvaluacion: number;
  condicion: "APTO" | "NO_APTO";
  observaciones?: string;
}

interface Postulante {
  id: string;
  documentoIdentidad: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  evaluacionTecnica?: EvaluacionTecnica;
}

interface EditEvaluacionModalProps {
  postulante: Postulante;
  observacionesDisponibles: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEvaluacionModal({
  postulante,
  observacionesDisponibles,
  isOpen,
  onClose,
  onSuccess,
}: EditEvaluacionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    notaObtenida: postulante.evaluacionTecnica?.notaObtenida || 0,
    observaciones: postulante.evaluacionTecnica?.observaciones || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postulante.evaluacionTecnica) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/evaluaciones-tecnicas/${postulante.evaluacionTecnica.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Evaluación actualizada correctamente");
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al actualizar la evaluación");
      }
    } catch {
      toast.error("Error al actualizar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !postulante.evaluacionTecnica) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Editar Evaluación Técnica
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Información del postulante */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Postulante</h4>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Nombre:</span>{" "}
                {postulante.nombreCompleto}
              </p>
              <p>
                <span className="font-medium">Documento:</span>{" "}
                {postulante.documentoIdentidad}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Nota obtenida */}
            <div>
              <label
                htmlFor="edit-nota"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nota Obtenida (0-30)
              </label>
              <input
                type="number"
                id="edit-nota"
                min="0"
                max="30"
                step="0.01"
                required
                value={formData.notaObtenida}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notaObtenida: parseFloat(e.target.value) || 0,
                  })
                }
                className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                La nota parcial y puntaje se recalcularán automáticamente
              </p>
            </div>

            {/* Observaciones */}
            <div>
              <label
                htmlFor="edit-observaciones"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Observaciones
              </label>
              <select
                id="edit-observaciones"
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData({ ...formData, observaciones: e.target.value })
                }
                className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sin observaciones</option>
                {observacionesDisponibles.map((obs, index) => (
                  <option key={index} value={obs}>
                    {obs}
                  </option>
                ))}
              </select>
            </div>

            {/* Información actual de la evaluación */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">
                Cálculos actuales
              </h5>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">
                    Nota Parcial:
                  </span>
                  <p className="text-blue-900">
                    {Math.floor(postulante.evaluacionTecnica.notaParcial * 10) /
                      10}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Puntaje:</span>
                  <p className="text-blue-900">
                    {Math.floor(
                      postulante.evaluacionTecnica.puntajeEvaluacion * 10
                    ) / 10}
                  </p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Condición:</span>
                  <p
                    className={`font-medium ${
                      postulante.evaluacionTecnica.condicion === "APTO"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {postulante.evaluacionTecnica.condicion === "APTO"
                      ? "APTO"
                      : "NO APTO"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Los valores se actualizarán según las fórmulas configuradas para
                esta convocatoria
              </p>
            </div>
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
