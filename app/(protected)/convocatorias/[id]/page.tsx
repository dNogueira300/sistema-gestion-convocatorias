// app/convocatorias/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  FileText,
  Users,
  Calendar,
  Badge,
  Clock,
  Settings,
  UserCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import PostulantesTab from "./components/PostulantesTab";
import EditEvaluacionModal from "./components/EditEvaluacionModal";

interface Convocatoria {
  id: string;
  tipo: string;
  puesto: string;
  codigoPuesto: string;
  unidadOrganizacion: string;
  vacantes: number;
  estado: "ACTIVA" | "INACTIVA";
  createdAt: string;
  observacionesDisponibles: string[];
  createdBy: {
    fullName: string;
  };
  postulantes: Postulante[];
}

interface Postulante {
  id: string;
  documentoIdentidad: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  evaluacionTecnica?: {
    id: string;
    notaObtenida: number;
    notaParcial: number;
    puntajeEvaluacion: number;
    condicion: "APTO" | "NO_APTO";
    observaciones?: string;
  };
}

export default function ConvocatoriaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [convocatoria, setConvocatoria] = useState<Convocatoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"postulantes" | "evaluaciones">(
    "postulantes"
  );

  useEffect(() => {
    const fetchConvocatoria = async () => {
      try {
        const response = await fetch(`/api/convocatorias/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setConvocatoria(data);
        } else {
          toast.error("Error al cargar la convocatoria");
          router.push("/convocatorias");
        }
      } catch {
        toast.error("Error al cargar la convocatoria");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchConvocatoria();
    }
  }, [params.id, router]);

  const fetchConvocatoria = async () => {
    try {
      const response = await fetch(`/api/convocatorias/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setConvocatoria(data);
      } else {
        toast.error("Error al cargar la convocatoria");
        router.push("/convocatorias");
      }
    } catch {
      toast.error("Error al cargar la convocatoria");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          Convocatoria no encontrada
        </h2>
      </div>
    );
  }

  const evaluacionesCompletas = convocatoria.postulantes.filter(
    (p) => p.evaluacionTecnica
  ).length;
  const evaluacionesPendientes =
    convocatoria.postulantes.length - evaluacionesCompletas;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2">
        <Link
          href="/convocatorias"
          className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Convocatorias
        </Link>
      </div>

      {/* Header de la convocatoria */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-red-100 rounded-xl">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {convocatoria.tipo}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    convocatoria.estado === "ACTIVA"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {convocatoria.estado === "ACTIVA" ? "Activa" : "Inactiva"}
                </span>
              </div>
              <p className="text-lg text-gray-600 mb-1">
                {convocatoria.puesto}
              </p>
              <p className="text-sm text-gray-500">
                Código: {convocatoria.codigoPuesto}
              </p>
            </div>
          </div>
          <div className="text-right space-y-3">
            <div className="flex space-x-3">
              <Link
                href={`/convocatorias/${convocatoria.id}/criterios`}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                <Settings className="h-4 w-4 mr-2" />
                Criterios
              </Link>
              <Link
                href={`/convocatorias/${convocatoria.id}/editar`}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Información detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles de la Convocatoria
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Badge className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Unidad de Organización
                  </p>
                  <p className="text-base text-gray-900">
                    {convocatoria.unidadOrganizacion}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Número de Vacantes
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-base text-gray-900 font-semibold">
                      {convocatoria.vacantes}
                    </p>
                    <span className="text-sm text-gray-500">
                      {convocatoria.vacantes === 1
                        ? "vacante disponible"
                        : "vacantes disponibles"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Fecha de Creación
                  </p>
                  <p className="text-base text-gray-900">
                    {formatDate(convocatoria.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Creado por
                  </p>
                  <p className="text-base text-gray-900">
                    {convocatoria.createdBy.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas mejoradas */}

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {convocatoria.postulantes.length}
                </p>
                <p className="text-sm text-gray-600">Total Postulantes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {evaluacionesCompletas}
                </p>
                <p className="text-sm text-gray-600">Evaluados</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {evaluacionesPendientes}
                </p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs mejorados */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("postulantes")}
              className={`${
                activeTab === "postulantes"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base flex items-center`}
            >
              <Users className="h-5 w-5 mr-2" />
              Postulantes ({convocatoria.postulantes.length})
            </button>
            <button
              onClick={() => setActiveTab("evaluaciones")}
              className={`${
                activeTab === "evaluaciones"
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-base flex items-center`}
            >
              <FileText className="h-5 w-5 mr-2" />
              Evaluación Técnica ({evaluacionesCompletas})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "postulantes" && (
            <PostulantesTab
              convocatoriaId={convocatoria.id}
              postulantes={convocatoria.postulantes}
              onPostulanteAdded={fetchConvocatoria}
            />
          )}

          {activeTab === "evaluaciones" && (
            <EvaluacionesTab
              convocatoriaId={convocatoria.id}
              postulantes={convocatoria.postulantes}
              observacionesDisponibles={convocatoria.observacionesDisponibles}
              onEvaluacionAdded={fetchConvocatoria}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para la tab de Evaluaciones mejorado
function EvaluacionesTab({
  postulantes,
  observacionesDisponibles,
  onEvaluacionAdded,
}: {
  convocatoriaId: string;
  postulantes: Postulante[];
  observacionesDisponibles: string[];
  onEvaluacionAdded: () => void;
}) {
  const [selectedPostulante, setSelectedPostulante] = useState<string>("");
  const [notaObtenida, setNotaObtenida] = useState<number>(0);
  const [observaciones, setObservaciones] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [editingPostulante, setEditingPostulante] = useState<Postulante | null>(
    null
  );

  const postulantesNoEvaluados = postulantes.filter(
    (p) => !p.evaluacionTecnica
  );
  const postulantesEvaluados = postulantes.filter((p) => p.evaluacionTecnica);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostulante) return;

    setLoading(true);

    try {
      const response = await fetch("/api/evaluaciones-tecnicas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postulanteId: selectedPostulante,
          notaObtenida,
          observaciones,
        }),
      });

      if (response.ok) {
        toast.success("Evaluación registrada correctamente");
        setSelectedPostulante("");
        setNotaObtenida(0);
        setObservaciones("");
        onEvaluacionAdded();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al registrar la evaluación");
      }
    } catch {
      toast.error("Error al registrar la evaluación");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postulante: Postulante) => {
    if (postulante.evaluacionTecnica) {
      setEditingPostulante(postulante);
    }
  };

  const handleEditSuccess = () => {
    setEditingPostulante(null);
    onEvaluacionAdded();
  };

  // Truncar a un decimal sin redondear
  const truncateToOneDecimal = (num: number) => {
    return Math.floor(num * 10) / 10;
  };

  return (
    <div className="space-y-8">
      {/* Formulario de Evaluación mejorado */}
      {postulantesNoEvaluados.length > 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Nueva Evaluación Técnica
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="postulante"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Postulante
                </label>
                <select
                  id="postulante"
                  value={selectedPostulante}
                  onChange={(e) => setSelectedPostulante(e.target.value)}
                  required
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Seleccionar postulante</option>
                  {postulantesNoEvaluados.map((postulante) => (
                    <option key={postulante.id} value={postulante.id}>
                      {postulante.nombreCompleto} -{" "}
                      {postulante.documentoIdentidad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="nota"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nota Obtenida (0-30)
                </label>
                <input
                  type="number"
                  id="nota"
                  min="0"
                  max="30"
                  step="0.01"
                  value={notaObtenida}
                  onChange={(e) =>
                    setNotaObtenida(parseFloat(e.target.value) || 0)
                  }
                  required
                  className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="observaciones"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Observaciones
              </label>
              <select
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="block w-full border-2 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Seleccionar observación (opcional)</option>
                {observacionesDisponibles.map((obs, index) => (
                  <option key={index} value={obs}>
                    {obs}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Guardando..." : "Registrar Evaluación"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Evaluaciones mejorada */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Resultados de Evaluación Técnica
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {postulantesEvaluados.length} de {postulantes.length} postulantes
              evaluados
            </p>
          </div>
          {postulantesEvaluados.length > 0 && (
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </button>
          )}
        </div>

        {postulantesEvaluados.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay evaluaciones registradas
            </h3>
            <p className="text-gray-600">
              Las evaluaciones aparecerán aquí una vez que sean registradas
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Postulante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Nota Obtenida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Nota Parcial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Puntaje Evaluación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Condición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Observaciones
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {postulantesEvaluados
                  .sort(
                    (a, b) =>
                      (b.evaluacionTecnica?.notaObtenida || 0) -
                      (a.evaluacionTecnica?.notaObtenida || 0)
                  )
                  .map((postulante) => (
                    <tr key={postulante.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-medium text-gray-900">
                            {postulante.nombreCompleto}
                          </div>
                          <div className="text-gray-500">
                            {postulante.documentoIdentidad}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-semibold text-gray-900">
                          {postulante.evaluacionTecnica?.notaObtenida}
                        </span>
                        <span className="text-gray-500">/30</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {truncateToOneDecimal(
                          postulante.evaluacionTecnica?.notaParcial || 0
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {truncateToOneDecimal(
                          postulante.evaluacionTecnica?.puntajeEvaluacion || 0
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            postulante.evaluacionTecnica?.condicion === "APTO"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {postulante.evaluacionTecnica?.condicion === "APTO"
                            ? "APTO"
                            : "NO APTO"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        {postulante.evaluacionTecnica?.observaciones ? (
                          <div
                            className="truncate"
                            title={postulante.evaluacionTecnica.observaciones}
                          >
                            {postulante.evaluacionTecnica.observaciones}
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            Sin observaciones
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleEdit(postulante)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar evaluación"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingPostulante && (
        <EditEvaluacionModal
          postulante={editingPostulante}
          observacionesDisponibles={observacionesDisponibles}
          isOpen={!!editingPostulante}
          onClose={() => setEditingPostulante(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
