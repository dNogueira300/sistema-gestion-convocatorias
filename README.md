# 🏢 Sistema de Gestión de Convocatorias

Sistema web completo para la gestión de convocatorias laborales con múltiples etapas de evaluación. Desarrollado con Next.js 14, TypeScript y PostgreSQL.

## ✨ Características Principales

- 🔐 **Autenticación segura** con NextAuth.js
- 👥 **Control de roles** (Admin/Usuario)
- 📝 **Gestión de convocatorias** con tipos personalizables
- 🎯 **Registro de postulantes** por convocatoria
- 📊 **Evaluaciones por etapas** con criterios personalizables
- 🧮 **Cálculos automáticos** en tiempo real
- 📄 **Exportación a PDF** de resultados
- 💾 **Validación de datos** completa

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Prisma ORM
- **Autenticación:** NextAuth.js con JWT
- **Base de Datos:** PostgreSQL
- **Validación:** Zod + React Hook Form

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- PostgreSQL 13+ (o cuenta de [Supabase](https://supabase.com))
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone https://github.com/YOUR_USERNAME/sistema-gestion-convocatorias.git
cd sistema-gestion-convocatorias
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/convocatorias"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-seguro-de-32-caracteres"
```

### 4. Configurar base de datos

#### Opción A: PostgreSQL Local

```bash
createdb convocatorias
```

#### Opción B: Supabase (Recomendado)

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto PostgreSQL
3. Copiar connection string a `DATABASE_URL`

### 5. Migrar y poblar base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Poblar con datos iniciales
npx prisma db seed
```

### 6. Ejecutar aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 👤 Credenciales Iniciales

Después del seed, puedes acceder con:

- **Administrador:** `admin` / `admin123`
- **Usuario:** `usuario1` / `user123`

## 📋 Funcionalidades del Sistema

### 🏢 Gestión de Convocatorias

- Crear convocatorias con tipo, puesto, código y número de vacantes
- Tipos predefinidos: CAS y CAP (personalizables)
- Estados: Activa/Inactiva (solo admin puede cambiar)
- Edición completa de datos de convocatoria

### 👥 Gestión de Postulantes

- Registro con documento de identidad, nombre completo y fecha de nacimiento
- Validación automática de duplicados
- Vista tabular con búsqueda y filtros
- Vinculación automática a convocatorias

### 📊 Sistema de Evaluación Técnica

- **Criterios personalizables por convocatoria:**
  - Fórmula para nota parcial (ej: `nota × 20/30`)
  - Fórmula para puntaje de evaluación (ej: `notaParcial × 0.3`)
  - Condición de aprobación (ej: `notaParcial > 13`)
- **Características avanzadas:**
  - Cálculos automáticos en tiempo real
  - Observaciones predefinidas editables
  - Validación de duplicados con opción de editar
  - Vista tabular con todos los resultados
- **Reportes:**
  - Tabla completa con resultados calculados
  - Exportación futura a PDF

### 🔐 Sistema de Autenticación

- Login seguro con NextAuth.js
- Roles diferenciados (Admin/Usuario)
- Control de acceso basado en permisos
- Sesiones seguras con JWT

## 📊 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Compilar para producción
npm run start        # Ejecutar en producción
npm run lint         # Verificar código con ESLint
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Aplicar cambios a la BD
npm run db:seed      # Poblar con datos iniciales
npm run db:studio    # Abrir Prisma Studio
```

## 🏗️ Estructura del Proyecto

```
sistema-convocatorias/
├── app/                          # App Router de Next.js 14
│   ├── (protected)/             # Rutas protegidas
│   │   ├── convocatorias/       # Gestión de convocatorias
│   │   ├── postulantes/         # Gestión de postulantes
│   │   └── evaluaciones/        # Sistema de evaluaciones
│   ├── api/                     # API Routes
│   │   ├── auth/               # Endpoints de autenticación
│   │   ├── convocatorias/      # CRUD convocatorias
│   │   └── evaluaciones/       # Sistema de evaluaciones
│   ├── login/                  # Página de autenticación
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página de inicio
├── components/                  # Componentes reutilizables
│   ├── ui/                     # Componentes de UI base
│   ├── forms/                  # Formularios específicos
│   └── layout/                 # Componentes de layout
├── lib/                        # Utilidades y configuración
│   ├── auth.ts                 # Configuración NextAuth
│   ├── db.ts                   # Cliente Prisma
│   └── utils.ts                # Utilidades generales
├── prisma/                     # Base de datos
│   ├── schema.prisma           # Esquema de la base de datos
│   └── seed.ts                 # Datos iniciales
└── types/                      # Definiciones de tipos TypeScript
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repositorio de GitHub
3. Configurar variables de entorno
4. Desplegar automáticamente

### Variables de entorno para producción

```env
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=un-secret-super-seguro-de-32-caracteres
DATABASE_URL=postgresql://user:pass@host:port/database?sslmode=require
```

## 🔧 Comandos Útiles de Prisma

```bash
# Ver estado de la base de datos
npx prisma db pull

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset

# Ver datos en interfaz gráfica
npx prisma studio
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Desarrollado por

Paulo - [Tu GitHub](https://github.com/YOUR_USERNAME)

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en [Issues](https://github.com/YOUR_USERNAME/sistema-gestion-convocatorias/issues)
3. Crea un nuevo Issue si no encuentras solución

---

⭐ ¡No olvides dar una estrella al proyecto si te resultó útil!
