// app/api/convocatorias/[id]/criterios/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCriteriosSchema = z.object({
  formulaNotaParcial: z.string().min(1, "La fórmula de nota parcial es requerida"),
  formulaPuntajeEvaluacion: z.string().min(1, "La fórmula de puntaje de evaluación es requerida"),
  condicionAprobacion: z.string().min(1, "La condición de aprobación es requerida"),
  observacionesDisponibles: z.array(z.string()).min(1, "Debe haber al menos una observación disponible"),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id },
      select: {
        id: true,
        tipo: true,
        puesto: true,
        codigoPuesto: true,
        formulaNotaParcial: true,
        formulaPuntajeEvaluacion: true,
        condicionAprobacion: true,
        observacionesDisponibles: true,
      }
    })

    if (!convocatoria) {
      return NextResponse.json(
        { error: "Convocatoria no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(convocatoria)
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateCriteriosSchema.parse(body)

    // Verificar que la convocatoria existe
    const existingConvocatoria = await prisma.convocatoria.findUnique({
      where: { id }
    })

    if (!existingConvocatoria) {
      return NextResponse.json(
        { error: "Convocatoria no encontrada" },
        { status: 404 }
      )
    }

    // Validar las fórmulas probando con valores de prueba
    try {
      const testNota = 15
      const testNotaParcial = eval(validatedData.formulaNotaParcial.replace(/nota/g, testNota.toString()))
      const testPuntaje = eval(validatedData.formulaPuntajeEvaluacion.replace(/notaParcial/g, testNotaParcial.toString()))
      const testCondicion = eval(validatedData.condicionAprobacion.replace(/notaParcial/g, testNotaParcial.toString()))
      
      // Verificar que los resultados sean números válidos
      if (isNaN(testNotaParcial) || isNaN(testPuntaje) || typeof testCondicion !== 'boolean') {
        return NextResponse.json(
          { error: "Las fórmulas contienen errores de sintaxis o lógica" },
          { status: 400 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Error en las fórmulas: " + (error as Error).message },
        { status: 400 }
      )
    }

    // Actualizar los criterios
    const convocatoria = await prisma.convocatoria.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        tipo: true,
        puesto: true,
        codigoPuesto: true,
        formulaNotaParcial: true,
        formulaPuntajeEvaluacion: true,
        condicionAprobacion: true,
        observacionesDisponibles: true,
      }
    })

    return NextResponse.json(convocatoria)
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