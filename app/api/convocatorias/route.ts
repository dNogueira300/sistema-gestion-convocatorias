// app/api/convocatorias/route.ts - Actualizado con campo vacantes
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createConvocatoriaSchema = z.object({
  tipo: z.string().min(1, "El tipo es requerido"),
  puesto: z.string().min(1, "El puesto es requerido"),
  codigoPuesto: z.string().min(1, "El código de puesto es requerido"),
  unidadOrganizacion: z
    .string()
    .min(1, "La unidad de organización es requerida"),
  vacantes: z
    .number()
    .min(1, "Debe haber al menos 1 vacante")
    .max(999, "El número de vacantes no puede exceder 999"),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const convocatorias = await prisma.convocatoria.findMany({
      include: {
        createdBy: {
          select: {
            fullName: true,
          },
        },
        _count: {
          select: {
            postulantes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(convocatorias);
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createConvocatoriaSchema.parse(body);

    // Verificar si el código de puesto ya existe
    const existingCode = await prisma.convocatoria.findFirst({
      where: {
        codigoPuesto: validatedData.codigoPuesto,
      },
    });

    if (existingCode) {
      return NextResponse.json(
        { error: "El código de puesto ya existe" },
        { status: 409 }
      );
    }

    const convocatoria = await prisma.convocatoria.create({
      data: {
        ...validatedData,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json(convocatoria, { status: 201 });
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
