// Actualizar app/api/convocatorias/[id]/route.ts para incluir vacantes

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateConvocatoriaSchema = z.object({
  tipo: z.string().min(1, "El tipo es requerido"),
  puesto: z.string().min(1, "El puesto es requerido"),
  codigoPuesto: z.string().min(1, "El código de puesto es requerido"),
  unidadOrganizacion: z
    .string()
    .min(1, "La unidad de organización es requerida"),
  vacantes: z
    .number()
    .min(1, "Debe haber al menos 1 vacante")
    .max(999, "El número de vacantes no puede exceder 999"), // Agregar vacantes
});

// Método GET
export async function GET(
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

    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            fullName: true,
          },
        },
        postulantes: {
          include: {
            evaluacionTecnica: true,
          },
          orderBy: {
            nombreCompleto: "asc",
          },
        },
      },
    });

    if (!convocatoria) {
      return NextResponse.json(
        { error: "Convocatoria no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(convocatoria);
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Método PUT para actualizar
export async function PUT(
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
    const validatedData = updateConvocatoriaSchema.parse(body);

    // Verificar que la convocatoria existe
    const existingConvocatoria = await prisma.convocatoria.findUnique({
      where: { id },
    });

    if (!existingConvocatoria) {
      return NextResponse.json(
        { error: "Convocatoria no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si el código de puesto ya existe en otra convocatoria
    if (validatedData.codigoPuesto !== existingConvocatoria.codigoPuesto) {
      const existingCode = await prisma.convocatoria.findFirst({
        where: {
          codigoPuesto: validatedData.codigoPuesto,
          id: { not: id },
        },
      });

      if (existingCode) {
        return NextResponse.json(
          { error: "El código de puesto ya existe en otra convocatoria" },
          { status: 409 }
        );
      }
    }

    // Actualizar la convocatoria (ahora incluye vacantes)
    const convocatoria = await prisma.convocatoria.update({
      where: { id },
      data: validatedData,
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
    });

    return NextResponse.json(convocatoria);
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
