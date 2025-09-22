// app/api/convocatorias/[id]/test-criterios/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const testCriteriosSchema = z.object({
  notaObtenida: z.number().min(0).max(30),
  formulaNotaParcial: z.string().min(1),
  formulaPuntajeEvaluacion: z.string().min(1),
  condicionAprobacion: z.string().min(1),
})

export async function POST(
  request: NextRequest,
  {}: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = testCriteriosSchema.parse(body)

    try {
      // Ejecutar las fórmulas con la nota de prueba
      const nota = validatedData.notaObtenida
      
      // Calcular nota parcial
      const notaParcial = eval(validatedData.formulaNotaParcial.replace(/nota/g, nota.toString()))
      
      // Calcular puntaje evaluación
      const puntajeEvaluacion = eval(validatedData.formulaPuntajeEvaluacion.replace(/notaParcial/g, notaParcial.toString()))
      
      // Evaluar condición
      const condicionResult = eval(validatedData.condicionAprobacion.replace(/notaParcial/g, notaParcial.toString()))
      
      // Validar que los resultados sean válidos
      if (isNaN(notaParcial) || isNaN(puntajeEvaluacion) || typeof condicionResult !== 'boolean') {
        return NextResponse.json(
          { error: "Las fórmulas producen resultados inválidos" },
          { status: 400 }
        )
      }

      // Formatear resultados
      const result = {
        notaParcial: Math.round(notaParcial * 10) / 10, // Redondear a 1 decimal
        puntajeEvaluacion: Math.round(puntajeEvaluacion * 10) / 10,
        condicion: condicionResult ? 'APTO' : 'NO_APTO'
      }

      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        { error: "Error al evaluar las fórmulas: " + (error as Error).message },
        { status: 400 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}