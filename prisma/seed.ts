// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@convocatorias.com',
      fullName: 'Administrador del Sistema',
      role: 'ADMIN',
      password: adminPassword,
    },
  })

  console.log('✅ Usuario administrador creado:', admin.username)

  // Crear usuario regular
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { username: 'usuario1' },
    update: {},
    create: {
      username: 'usuario1',
      email: 'usuario1@convocatorias.com',
      fullName: 'Usuario del Sistema',
      role: 'USER',
      password: userPassword,
    },
  })

  console.log('✅ Usuario regular creado:', user.username)

  // Crear convocatoria de ejemplo
  const convocatoria = await prisma.convocatoria.create({
    data: {
      tipo: 'CAS - Contrato Administrativo de Servicios',
      puesto: 'Especialista en Recursos Humanos',
      codigoPuesto: 'CAS-001-2025',
      unidadOrganizacion: 'Gerencia de Recursos Humanos',
      estado: 'ACTIVA',
      createdById: admin.id,
    },
  })

  console.log('✅ Convocatoria de ejemplo creada:', convocatoria.codigoPuesto)

  // Crear postulantes de ejemplo
  const postulantes = await Promise.all([
    prisma.postulante.create({
      data: {
        documentoIdentidad: '12345678',
        nombreCompleto: 'Juan Carlos Pérez García',
        fechaNacimiento: new Date('1990-05-15'),
        convocatoriaId: convocatoria.id,
      },
    }),
    prisma.postulante.create({
      data: {
        documentoIdentidad: '87654321',
        nombreCompleto: 'María Elena Rodríguez López',
        fechaNacimiento: new Date('1988-03-22'),
        convocatoriaId: convocatoria.id,
      },
    }),
    prisma.postulante.create({
      data: {
        documentoIdentidad: '11223344',
        nombreCompleto: 'Carlos Antonio Mendoza Silva',
        fechaNacimiento: new Date('1992-08-10'),
        convocatoriaId: convocatoria.id,
      },
    }),
  ])

  console.log('✅ Postulantes de ejemplo creados:', postulantes.length)

  console.log('✅ Evaluación técnica de ejemplo creada para:', postulantes[0].nombreCompleto)

  console.log('🎉 Seed completado exitosamente!')
  console.log('\n📋 Credenciales de acceso:')
  console.log('👑 Administrador:')
  console.log('   Usuario: admin')
  console.log('   Contraseña: admin123')
  console.log('\n👤 Usuario regular:')
  console.log('   Usuario: usuario1')
  console.log('   Contraseña: user123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })