// app/(protected)/convocatorias/nueva/page.tsx - Actualizado con campo vacantes
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  Building,
  Hash,
  Users,
  Plus,
  Check,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

const convocatoriaSchema = z.object({
  tipo: z.string().min(1, "El tipo es requerido"),
  puesto: z.string().min(1, "El puesto es requerido"),
  codigoPuesto: z.string().min(1, "El código de puesto es requerido"),
  unidadOrganizacion: z
    .string()
    .min(1, "La unidad de organización es requerida"),
  vacantes: z
    .number()
    .min(1, "Debe haber al menos 1 vacante")
    .max(999, "El número de vacantes no puede exceder 999"),
});

type ConvocatoriaForm = z.infer<typeof convocatoriaSchema>;

const tiposConvocatoria = [
  "CAS - Contrato Administrativo de Servicios",
  "728 - Plazo Indeterminado",
];

export default function NuevaConvocatoriaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customTipo, setCustomTipo] = useState("");
  const [showCustomTipo, setShowCustomTipo] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ConvocatoriaForm>({
    resolver: zodResolver(convocatoriaSchema),
    defaultValues: {
      vacantes: 1, // Valor por defecto
    },
  });

  const tipoValue = watch("tipo");

  const onSubmit = async (data: ConvocatoriaForm) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/convocatorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Convocatoria creada correctamente");
        router.push("/convocatorias");
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al crear la convocatoria");
      }
    } catch {
      toast.error("Error al crear la convocatoria");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTipoChange = (value: string) => {
    if (value === "custom") {
      setShowCustomTipo(true);
      setValue("tipo", "");
    } else {
      setShowCustomTipo(false);
      setValue("tipo", value);
    }
  };

  const handleCustomTipoSubmit = () => {
    if (customTipo.trim()) {
      setValue("tipo", customTipo.trim());
      setShowCustomTipo(false);
      setCustomTipo("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb mejorado */}
      <div className="flex items-center space-x-2 text-sm">
        <Link
          href="/convocatorias"
          className="inline-flex items-center text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Convocatorias
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-red-100 rounded-xl">
            <Plus className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Nueva Convocatoria
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Completa la información para crear una nueva convocatoria en el
              sistema
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Información de la Convocatoria
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Todos los campos son obligatorios para crear la convocatoria
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Tipo de Convocatoria */}
            <div className="space-y-3">
              <label className="flex items-center text-base font-semibold text-gray-900">
                <FileText className="h-5 w-5 mr-2 text-red-600" />
                Tipo de Convocatoria
              </label>
              <div>
                <select
                  onChange={(e) => handleTipoChange(e.target.value)}
                  className="block w-full border-2 border-gray-300 rounded-xl shadow-sm py-4 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-colors"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecciona un tipo de convocatoria
                  </option>
                  {tiposConvocatoria.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                  <option value="custom">🔧 Personalizar tipo...</option>
                </select>

                {showCustomTipo && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Tipo Personalizado
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={customTipo}
                        onChange={(e) => setCustomTipo(e.target.value)}
                        placeholder="Ingresa el tipo personalizado"
                        className="flex-1 border border-blue-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleCustomTipoSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Agregar
                      </button>
                    </div>
                  </div>
                )}

                {tipoValue && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-sm text-green-800">
                      <Check className="h-4 w-4 mr-2" />
                      <span className="font-medium">Seleccionado:</span>
                      <span className="ml-2">{tipoValue}</span>
                    </div>
                  </div>
                )}
              </div>
              {errors.tipo && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  {errors.tipo.message}
                </p>
              )}
            </div>

            {/* Grid para Puesto y Vacantes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Puesto - ocupa 2 columnas */}
              <div className="md:col-span-2 space-y-3">
                <label
                  htmlFor="puesto"
                  className="flex items-center text-base font-semibold text-gray-900"
                >
                  <Building className="h-5 w-5 mr-2 text-red-600" />
                  Puesto
                </label>
                <input
                  {...register("puesto")}
                  type="text"
                  className="block w-full border-2 border-gray-300 rounded-xl shadow-sm py-4 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-colors"
                  placeholder="Ej: Especialista en Recursos Humanos"
                />
                {errors.puesto && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    {errors.puesto.message}
                  </p>
                )}
              </div>

              {/* Vacantes - ocupa 1 columna */}
              <div className="space-y-3">
                <label
                  htmlFor="vacantes"
                  className="flex items-center text-base font-semibold text-gray-900"
                >
                  <UserCheck className="h-5 w-5 mr-2 text-red-600" />
                  Vacantes
                </label>
                <input
                  {...register("vacantes", { valueAsNumber: true })}
                  type="number"
                  min="1"
                  max="999"
                  className="block w-full border-2 border-gray-300 rounded-xl shadow-sm py-4 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-colors"
                  placeholder="1"
                />
                {errors.vacantes && (
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    {errors.vacantes.message}
                  </p>
                )}
              </div>
            </div>

            {/* Código de Puesto */}
            <div className="space-y-3">
              <label
                htmlFor="codigoPuesto"
                className="flex items-center text-base font-semibold text-gray-900"
              >
                <Hash className="h-5 w-5 mr-2 text-red-600" />
                Código de Puesto
              </label>
              <input
                {...register("codigoPuesto")}
                type="text"
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm py-4 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-colors"
                placeholder="Ej: CAS-001-2025"
              />
              {errors.codigoPuesto && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  {errors.codigoPuesto.message}
                </p>
              )}
            </div>

            {/* Unidad de Organización */}
            <div className="space-y-3">
              <label
                htmlFor="unidadOrganizacion"
                className="flex items-center text-base font-semibold text-gray-900"
              >
                <Users className="h-5 w-5 mr-2 text-red-600" />
                Unidad de Organización
              </label>
              <input
                {...register("unidadOrganizacion")}
                type="text"
                className="block w-full border-2 border-gray-300 rounded-xl shadow-sm py-4 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base transition-colors"
                placeholder="Ej: Gerencia de Recursos Humanos"
              />
              {errors.unidadOrganizacion && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  {errors.unidadOrganizacion.message}
                </p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-12 flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/convocatorias"
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Creando Convocatoria...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Convocatoria
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
