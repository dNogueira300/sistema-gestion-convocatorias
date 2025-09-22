"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Eye, EyeOff, User, Lock, Building2, AlertCircle } from "lucide-react"

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string>("")

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setLoginError("") // Limpiar errores previos
    
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        // Manejar diferentes tipos de errores
        switch (result.error) {
          case "CredentialsSignin":
            setLoginError("Usuario o contraseña incorrectos")
            toast.error("Credenciales inválidas")
            break
          case "AccessDenied":
            setLoginError("Acceso denegado. Su cuenta puede estar desactivada")
            toast.error("Acceso denegado")
            break
          default:
            setLoginError("Error al iniciar sesión. Intente nuevamente")
            toast.error("Error de autenticación")
        }
      } else if (result?.ok) {
        setLoginError("")
        toast.success("Sesión iniciada correctamente")
        router.push("/dashboard")
      } else {
        setLoginError("Error inesperado. Intente nuevamente")
        toast.error("Error al iniciar sesión")
      }
    } catch (error) {
      console.error("Error en login:", error)
      setLoginError("Error de conexión. Verifique su conexión a internet")
      toast.error("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header profesional */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-700 shadow-lg flex items-center justify-center mb-6 border-2 border-gray-600">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Convocatorias
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Acceso seguro al sistema de gestión
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-100 shadow-xl sm:rounded-lg border border-gray-200">
          {/* Banda superior con color corporativo */}
          <div className="h-5 bg-gradient-to-r from-red-800 to-red-600 sm:rounded-t-lg"></div>
          
          <div className="py-8 px-6 sm:px-10">
            {/* Alerta de error mejorada */}
            {loginError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Error de autenticación
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {loginError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("username")}
                    type="text"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-md bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white transition duration-200 ease-in-out sm:text-sm ${
                      errors.username || loginError
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    }`}
                    placeholder="Ingrese su usuario"
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-md bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white transition duration-200 ease-in-out sm:text-sm ${
                      errors.password || loginError
                        ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    }`}
                    placeholder="Ingrese su contraseña"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verificando credenciales...
                    </div>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </div>
            </form>

            {/* Credenciales de desarrollo */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-4">
                  Credenciales de desarrollo:
                </p>
                <div className="bg-gray-50 rounded-md p-4 text-xs text-gray-600 border border-gray-200">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <span className="font-semibold text-gray-700">Administrador:</span><br />
                      <span className="font-mono">admin / admin123</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Usuario:</span><br />
                      <span className="font-mono">usuario1 / user123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Sistema de Gestión de Convocatorias v1.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Acceso seguro y confidencial
          </p>
        </div>
      </div>
    </div>
  )
}