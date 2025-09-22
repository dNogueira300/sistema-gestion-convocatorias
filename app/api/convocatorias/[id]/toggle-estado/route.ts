// app/api/convocatorias/[id]/toggle-estado/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const toggleEstadoSchema = z.object({
  estado: z.enum(['ACTIVA', 'INACTIVA'])
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Solo los administradores pueden cambiar el estado" },
        { status: 403 }
      )
    }

    // Await params before using
    const { id } = await params
    const body = await request.json()
    const { estado } = toggleEstadoSchema.parse(body)

    const convocatoria = await prisma.convocatoria.update({
      where: { id },
      data: { estado }
    })

    return NextResponse.json(convocatoria)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}