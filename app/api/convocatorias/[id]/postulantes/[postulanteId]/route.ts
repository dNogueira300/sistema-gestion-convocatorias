// Agregar al archivo app/api/convocatorias/[id]/postulantes/[postulanteId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updatePostulanteSchema = z.object({
  documentoIdentidad: z.string().min(1, "El documento de identidad es requerido"),
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  fechaNacimiento: z.string().transform((str) => new Date(str)),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postulanteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { postulanteId } = await params

    const postulante = await prisma.postulante.findUnique({
      where: { id: postulanteId },
      include: {
        evaluacionTecnica: true
      }
    })

    if (!postulante) {
      return NextResponse.json(
        { error: "Postulante no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(postulante)
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postulanteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id: convocatoriaId, postulanteId } = await params
    const body = await request.json()
    const validatedData = updatePostulanteSchema.parse(body)

    // Verificar que el postulante existe y pertenece a la convocatoria
    const existingPostulante = await prisma.postulante.findFirst({
      where: {
        id: postulanteId,
        convocatoriaId: convocatoriaId
      }
    })

    if (!existingPostulante) {
      return NextResponse.json(
        { error: "Postulante no encontrado" },
        { status: 404 }
      )
    }

    // Verificar si el documento de identidad ya existe en otra entrada de la misma convocatoria
    if (validatedData.documentoIdentidad !== existingPostulante.documentoIdentidad) {
      const existingDocument = await prisma.postulante.findFirst({
        where: {
          documentoIdentidad: validatedData.documentoIdentidad,
          convocatoriaId: convocatoriaId,
          id: { not: postulanteId }
        }
      })

      if (existingDocument) {
        return NextResponse.json(
          { error: "El documento de identidad ya existe en esta convocatoria" },
          { status: 409 }
        )
      }
    }

    // Actualizar el postulante
    const postulante = await prisma.postulante.update({
      where: { id: postulanteId },
      data: validatedData,
      include: {
        evaluacionTecnica: true
      }
    })

    return NextResponse.json(postulante)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; postulanteId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id: convocatoriaId, postulanteId } = await params

    // Verificar que el postulante existe y pertenece a la convocatoria
    const existingPostulante = await prisma.postulante.findFirst({
      where: {
        id: postulanteId,
        convocatoriaId: convocatoriaId
      },
      include: {
        evaluacionTecnica: true
      }
    })

    if (!existingPostulante) {
      return NextResponse.json(
        { error: "Postulante no encontrado" },
        { status: 404 }
      )
    }

    // Si tiene evaluación técnica, eliminarla primero
    if (existingPostulante.evaluacionTecnica) {
      await prisma.evaluacionTecnica.delete({
        where: { id: existingPostulante.evaluacionTecnica.id }
      })
    }

    // Eliminar el postulante
    await prisma.postulante.delete({
      where: { id: postulanteId }
    })

    return NextResponse.json({ message: "Postulante eliminado correctamente" })
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}