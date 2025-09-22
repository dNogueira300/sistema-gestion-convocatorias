// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function calculateEvaluacion(
  notaObtenida: number,
  formulaNotaParcial: string,
  formulaPuntajeEvaluacion: string,
  condicionAprobacion: string
) {
  try {
    // Calcular nota parcial usando la fórmula personalizada
    const nota = notaObtenida
    const notaParcial = eval(formulaNotaParcial.replace(/nota/g, nota.toString()))
    
    // Calcular puntaje evaluación usando la nota parcial
    const puntajeEvaluacion = eval(formulaPuntajeEvaluacion.replace(/notaParcial/g, notaParcial.toString()))
    
    // Evaluar condición de aprobación
    const condicionResult = eval(condicionAprobacion.replace(/notaParcial/g, notaParcial.toString()))
    
    // Validar que los resultados sean válidos
    if (isNaN(notaParcial) || isNaN(puntajeEvaluacion) || typeof condicionResult !== 'boolean') {
      throw new Error('Las fórmulas producen resultados inválidos')
    }

    return {
      notaParcial: Math.round(notaParcial * 10) / 10, // Redondear a 1 decimal
      puntajeEvaluacion: Math.round(puntajeEvaluacion * 10) / 10,
      condicion: condicionResult ? 'APTO' : 'NO_APTO' as 'APTO' | 'NO_APTO'
    }
  } catch (error) {
    throw new Error('Error al calcular la evaluación: ' + (error as Error).message)
  }
}