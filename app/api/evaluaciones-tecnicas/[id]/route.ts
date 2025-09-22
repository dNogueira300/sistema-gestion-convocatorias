// app/api/evaluaciones-tecnicas/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calculateEvaluacion } from "@/lib/utils";

const updateEvaluacionSchema = z.object({
  notaObtenida: z.number().min(0).max(30),
  observaciones: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Await params before using
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateEvaluacionSchema.parse(body);

    // Obtener la evaluación existente con datos de la convocatoria
    const existingEvaluacion = await prisma.evaluacionTecnica.findUnique({
      where: { id },
      include: {
        postulante: {
          include: {
            convocatoria: true,
          },
        },
      },
    });

    if (!existingEvaluacion) {
      return NextResponse.json(
        { error: "Evaluación no encontrada" },
        { status: 404 }
      );
    }

    // Recalcular valores automáticos
    const calculatedValues = calculateEvaluacion(
      validatedData.notaObtenida,
      existingEvaluacion.postulante.convocatoria.formulaNotaParcial,
      existingEvaluacion.postulante.convocatoria.formulaPuntajeEvaluacion,
      existingEvaluacion.postulante.convocatoria.condicionAprobacion
    );

    const evaluacion = await prisma.evaluacionTecnica.update({
      where: { id },
      data: {
        notaObtenida: validatedData.notaObtenida,
        notaParcial: calculatedValues.notaParcial,
        puntajeEvaluacion: calculatedValues.puntajeEvaluacion,
        condicion: calculatedValues.condicion,
        observaciones:
          validatedData.observaciones ||
          (calculatedValues.condicion === "NO_APTO"
            ? "NO ALCANZÓ EL PUNTAJE MÍNIMO APROBATORIO"
            : ""),
      },
      include: {
        postulante: true,
        evaluatedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json(evaluacion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
