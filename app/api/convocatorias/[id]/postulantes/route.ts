// app/api/convocatorias/[id]/postulantes/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createPostulanteSchema = z.object({
  documentoIdentidad: z.string().min(1, "El documento de identidad es requerido"),
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  fechaNacimiento: z.string().transform((str) => new Date(str)),
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

    // Await params before using
    const { id } = await params

    const postulantes = await prisma.postulante.findMany({
      where: {
        convocatoriaId: id
      },
      include: {
        evaluacionTecnica: true
      },
      orderBy: {
        nombreCompleto: 'asc'
      }
    })

    return NextResponse.json(postulantes)
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Await params before using
    const { id } = await params
    const body = await request.json()
    const validatedData = createPostulanteSchema.parse(body)

    // Verificar que la convocatoria existe
    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id }
    })

    if (!convocatoria) {
      return NextResponse.json(
        { error: "Convocatoria no encontrada" },
        { status: 404 }
      )
    }

    // Verificar si el postulante ya existe en esta convocatoria
    const existingPostulante = await prisma.postulante.findUnique({
      where: {
        documentoIdentidad_convocatoriaId: {
          documentoIdentidad: validatedData.documentoIdentidad,
          convocatoriaId: id
        }
      }
    })

    if (existingPostulante) {
      return NextResponse.json(
        { error: "El postulante ya existe en esta convocatoria" },
        { status: 409 }
      )
    }

    const postulante = await prisma.postulante.create({
      data: {
        ...validatedData,
        convocatoriaId: id
      }
    })

    return NextResponse.json(postulante, { status: 201 })
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