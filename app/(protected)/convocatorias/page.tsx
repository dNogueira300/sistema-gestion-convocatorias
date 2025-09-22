// app/(protected)/convocatorias/page.tsx - Actualizado con columna de vacantes
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Eye,
  ToggleLeft,
  ToggleRight,
  FileText,
  Users,
  UserCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Convocatoria {
  id: string;
  tipo: string;
  puesto: string;
  codigoPuesto: string;
  unidadOrganizacion: string;
  vacantes: number; // Nuevo campo
  estado: "ACTIVA" | "INACTIVA";
  createdAt: string;
  createdBy: {
    fullName: string;
  };
  _count: {
    postulantes: number;
  };
}

export default function ConvocatoriasPage() {
  const { data: session } = useSession();
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    try {
      const response = await fetch("/api/convocatorias");
      const data = await response.json();
      setConvocatorias(data);
    } catch {
      toast.error("Error al cargar las convocatorias");
    } finally {
      setLoading(false);
    }
  };

  const toggleEstado = async (id: string, currentEstado: string) => {
    if (session?.user?.role !== "ADMIN") {
      toast.error("Solo los administradores pueden cambiar el estado");
      return;
    }

    try {
      const newEstado = currentEstado === "ACTIVA" ? "INACTIVA" : "ACTIVA";
      const response = await fetch(`/api/convocatorias/${id}/toggle-estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: newEstado }),
      });

      if (response.ok) {
        toast.success("Estado actualizado correctamente");
        fetchConvocatorias();
      } else {
        toast.error("Error al actualizar el estado");
      }
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  // Calcular estadísticas de vacantes
  const totalVacantes = convocatorias.reduce(
    (total, c) => total + c.vacantes,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Convocatorias
              </h1>
              <p className="mt-1 text-lg text-gray-600">
                Gestiona las convocatorias del sistema
              </p>
            </div>
          </div>
          <div className="mt-6 sm:mt-0">
            <Link
              href="/convocatorias/nueva"
              className="inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-base font-semibold text-white shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nueva Convocatoria
            </Link>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas actualizadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {convocatorias.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ToggleRight className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {convocatorias.filter((c) => c.estado === "ACTIVA").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Vacantes</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalVacantes}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Postulantes</p>
              <p className="text-2xl font-bold text-gray-900">
                {convocatorias.reduce(
                  (total, c) => total + c._count.postulantes,
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla mejorada con columna de vacantes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Convocatoria
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Vacantes
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Postulantes
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">Creado</div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {convocatorias.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay convocatorias
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Comienza creando tu primera convocatoria
                      </p>
                      <Link
                        href="/convocatorias/nueva"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Convocatoria
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                convocatorias.map((convocatoria, index) => (
                  <tr
                    key={convocatoria.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {convocatoria.tipo}
                        </div>
                        <div className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full inline-block">
                          {convocatoria.codigoPuesto}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">
                          {convocatoria.puesto}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {convocatoria.unidadOrganizacion}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                          <UserCheck className="h-4 w-4 text-orange-600" />
                          <span className="text-lg font-bold text-orange-800">
                            {convocatoria.vacantes}
                          </span>
                          <span className="text-xs text-orange-600">
                            {convocatoria.vacantes === 1
                              ? "vacante"
                              : "vacantes"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() =>
                          toggleEstado(convocatoria.id, convocatoria.estado)
                        }
                        disabled={session?.user?.role !== "ADMIN"}
                        className={`flex items-center space-x-2 disabled:cursor-not-allowed p-2 rounded-lg transition-colors ${
                          session?.user?.role === "ADMIN"
                            ? "hover:bg-gray-100"
                            : ""
                        }`}
                      >
                        {convocatoria.estado === "ACTIVA" ? (
                          <>
                            <ToggleRight className="h-6 w-6 text-green-500" />
                            <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
                              Activa
                            </span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-6 w-6 text-gray-400" />
                            <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                              Inactiva
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-2">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-gray-900">
                            {convocatoria._count.postulantes}
                          </span>
                          {convocatoria.vacantes > 0 && (
                            <span className="text-xs text-gray-500">
                              {Math.round(
                                (convocatoria._count.postulantes /
                                  convocatoria.vacantes) *
                                  100
                              ) / 100}
                              x ratio
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>
                        <div className="font-medium">
                          {formatDate(convocatoria.createdAt)}
                        </div>
                        <div className="text-xs text-gray-400">
                          por {convocatoria.createdBy.fullName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          href={`/convocatorias/${convocatoria.id}`}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/convocatorias/${convocatoria.id}/editar`}
                          className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
