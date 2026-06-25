-- CreateEnum
CREATE TYPE "OrigenSolicitud" AS ENUM ('SOCIO', 'SUBCOMISION');

-- CreateEnum
CREATE TYPE "TipoSolicitud" AS ENUM ('RESERVA_ESPACIO', 'ACTIVIDAD_RECAUDATORIA');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "UsoEspacio" AS ENUM ('PERSONAL', 'INSTITUCIONAL');

-- CreateEnum
CREATE TYPE "EstadoPagoInscripcion" AS ENUM ('PENDIENTE', 'PAGADO', 'NO_APLICA');

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "origen" "OrigenSolicitud" NOT NULL,
    "tipo" "TipoSolicitud" NOT NULL,
    "creadoPorUsuarioId" TEXT NOT NULL,
    "socioId" TEXT,
    "subcomisionId" TEXT,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "notaRechazo" TEXT,
    "resueltoPorUsuarioId" TEXT,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaResolucion" TIMESTAMP(3),
    "solicitudPadreId" TEXT,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Espacio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "capacidad" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Espacio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaEspacio" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "espacioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "uso" "UsoEspacio" NOT NULL,

    CONSTRAINT "ReservaEspacio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActividadRecaudatoria" (
    "id" TEXT NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "subcomisionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "cupo" INTEGER,
    "precio" DECIMAL(65,30),

    CONSTRAINT "ActividadRecaudatoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InscripcionActividad" (
    "id" TEXT NOT NULL,
    "actividadId" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoPago" "EstadoPagoInscripcion" NOT NULL DEFAULT 'NO_APLICA',

    CONSTRAINT "InscripcionActividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_solicitudPadreId_key" ON "Solicitud"("solicitudPadreId");

-- CreateIndex
CREATE UNIQUE INDEX "Espacio_nombre_key" ON "Espacio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ReservaEspacio_solicitudId_key" ON "ReservaEspacio"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "ActividadRecaudatoria_solicitudId_key" ON "ActividadRecaudatoria"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "InscripcionActividad_actividadId_socioId_key" ON "InscripcionActividad"("actividadId", "socioId");

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_creadoPorUsuarioId_fkey" FOREIGN KEY ("creadoPorUsuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_resueltoPorUsuarioId_fkey" FOREIGN KEY ("resueltoPorUsuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_subcomisionId_fkey" FOREIGN KEY ("subcomisionId") REFERENCES "Subcomision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_solicitudPadreId_fkey" FOREIGN KEY ("solicitudPadreId") REFERENCES "Solicitud"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaEspacio" ADD CONSTRAINT "ReservaEspacio_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaEspacio" ADD CONSTRAINT "ReservaEspacio_espacioId_fkey" FOREIGN KEY ("espacioId") REFERENCES "Espacio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadRecaudatoria" ADD CONSTRAINT "ActividadRecaudatoria_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadRecaudatoria" ADD CONSTRAINT "ActividadRecaudatoria_subcomisionId_fkey" FOREIGN KEY ("subcomisionId") REFERENCES "Subcomision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscripcionActividad" ADD CONSTRAINT "InscripcionActividad_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "ActividadRecaudatoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InscripcionActividad" ADD CONSTRAINT "InscripcionActividad_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
