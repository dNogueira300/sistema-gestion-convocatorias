// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const [totalConvocatorias, convocatoriasActivas, totalPostulantes, evaluacionesPendientes] = await Promise.all([
      prisma.convocatoria.count(),
      prisma.convocatoria.count({
        where: { estado: 'ACTIVA' }
      }),
      prisma.postulante.count(),
      prisma.postulante.count({
        where: {
          evaluacionTecnica: null,
          convocatoria: {
            estado: 'ACTIVA'
          }
        }
      })
    ])

    // Agregar cache headers
return NextResponse.json({
  totalConvocatorias,
  convocatoriasActivas,
  totalPostulantes,
  evaluacionesPendientes,
}, {
  headers: {
    'Cache-Control': 'private, max-age=60' // Cache por 1 minuto
  }
})
  } catch  {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}