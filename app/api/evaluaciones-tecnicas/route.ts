// app/api/evaluaciones-tecnicas/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateEvaluacion } from "@/lib/utils"

const createEvaluacionSchema = z.object({
  postulanteId: z.string().min(1),
  notaObtenida: z.number().min(0).max(30),
  observaciones: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createEvaluacionSchema.parse(body)

    // Obtener el postulante y la convocatoria
    const postulante = await prisma.postulante.findUnique({
      where: { id: validatedData.postulanteId },
      include: {
        convocatoria: true,
        evaluacionTecnica: true
      }
    })

    if (!postulante) {
      return NextResponse.json(
        { error: "Postulante no encontrado" },
        { status: 404 }
      )
    }

    if (postulante.evaluacionTecnica) {
      return NextResponse.json(
        { error: "El postulante ya tiene una evaluación técnica registrada" },
        { status: 409 }
      )
    }

    // Calcular valores automáticos usando las fórmulas de la convocatoria
    const calculatedValues = calculateEvaluacion(
      validatedData.notaObtenida,
      postulante.convocatoria.formulaNotaParcial,
      postulante.convocatoria.formulaPuntajeEvaluacion,
      postulante.convocatoria.condicionAprobacion
    )

    const evaluacion = await prisma.evaluacionTecnica.create({
      data: {
        postulanteId: validatedData.postulanteId,
        notaObtenida: validatedData.notaObtenida,
        notaParcial: calculatedValues.notaParcial,
        puntajeEvaluacion: calculatedValues.puntajeEvaluacion,
        condicion: calculatedValues.condicion,
        observaciones: validatedData.observaciones || (calculatedValues.condicion === 'NO_APTO' ? 'NO ALCANZÓ EL PUNTAJE MÍNIMO APROBATORIO' : ''),
        evaluatedById: session.user.id
      },
      include: {
        postulante: true,
        evaluatedBy: {
          select: {
            fullName: true
          }
        }
      }
    })

    return NextResponse.json(evaluacion, { status: 201 })
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