-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SOCIO', 'SUBCOMISION', 'COMISION_DIRECTIVA', 'EMPLEADO', 'JEFE_AREA', 'ADMIN', 'ENCARGADO_BOUTIQUE');

-- CreateEnum
CREATE TYPE "EstadoMembresia" AS ENUM ('ACTIVO', 'INACTIVO', 'MOROSO', 'SUSPENDIDO', 'BAJA', 'LICENCIA');

-- CreateEnum
CREATE TYPE "AreaOperativa" AS ENUM ('MANTENIMIENTO', 'LIMPIEZA', 'SEGURIDAD');

-- CreateEnum
CREATE TYPE "TipoGrupoFamiliar" AS ENUM ('MATRIMONIO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaSocio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "CategoriaSocio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Socio" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT,
    "numeroSocio" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "fotoUrl" TEXT,
    "categoriaSocioId" TEXT NOT NULL,
    "tutorId" TEXT,
    "estadoMembresia" "EstadoMembresia" NOT NULL DEFAULT 'ACTIVO',
    "tokenQr" TEXT NOT NULL,

    CONSTRAINT "Socio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrupoFamiliar" (
    "id" TEXT NOT NULL,
    "tipo" "TipoGrupoFamiliar" NOT NULL,

    CONSTRAINT "GrupoFamiliar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrupoFamiliarMiembro" (
    "id" TEXT NOT NULL,
    "grupoFamiliarId" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,

    CONSTRAINT "GrupoFamiliarMiembro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "area" "AreaOperativa" NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_usuarioId_rol_key" ON "UsuarioRol"("usuarioId", "rol");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaSocio_nombre_key" ON "CategoriaSocio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_usuarioId_key" ON "Socio"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_numeroSocio_key" ON "Socio"("numeroSocio");

-- CreateIndex
CREATE UNIQUE INDEX "Socio_tokenQr_key" ON "Socio"("tokenQr");

-- CreateIndex
CREATE UNIQUE INDEX "GrupoFamiliarMiembro_grupoFamiliarId_socioId_key" ON "GrupoFamiliarMiembro"("grupoFamiliarId", "socioId");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_usuarioId_key" ON "Empleado"("usuarioId");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_categoriaSocioId_fkey" FOREIGN KEY ("categoriaSocioId") REFERENCES "CategoriaSocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socio" ADD CONSTRAINT "Socio_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoFamiliarMiembro" ADD CONSTRAINT "GrupoFamiliarMiembro_grupoFamiliarId_fkey" FOREIGN KEY ("grupoFamiliarId") REFERENCES "GrupoFamiliar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoFamiliarMiembro" ADD CONSTRAINT "GrupoFamiliarMiembro_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
