-- CreateEnum
CREATE TYPE "MetodoCuota" AS ENUM ('DEBITO_AUTOMATICO', 'MANUAL', 'MERCADO_PAGO');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('PENDIENTE', 'PAGADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "TipoMedioPago" AS ENUM ('CBU', 'TARJETA');

-- CreateEnum
CREATE TYPE "EstadoPagoMP" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateTable
CREATE TABLE "TarifaCuota" (
    "id" TEXT NOT NULL,
    "categoriaSocioId" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "vigenteDesde" TIMESTAMP(3) NOT NULL,
    "vigenteHasta" TIMESTAMP(3),

    CONSTRAINT "TarifaCuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuota" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "estado" "EstadoCuota" NOT NULL DEFAULT 'PENDIENTE',
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "fechaPago" TIMESTAMP(3),
    "metodo" "MetodoCuota",

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedioPagoAdherido" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "tipo" "TipoMedioPago" NOT NULL,
    "datoEnmascarado" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MedioPagoAdherido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoDebito" (
    "id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urlArchivo" TEXT NOT NULL,
    "generadoPor" TEXT NOT NULL,

    CONSTRAINT "ArchivoDebito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivoRendicion" (
    "id" TEXT NOT NULL,
    "archivoDebitoId" TEXT NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subidoPor" TEXT NOT NULL,
    "procesado" BOOLEAN NOT NULL DEFAULT false,
    "fechaProcesamiento" TIMESTAMP(3),

    CONSTRAINT "ArchivoRendicion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoMercadoPago" (
    "id" TEXT NOT NULL,
    "cuotaId" TEXT,
    "pedidoId" TEXT,
    "mpPaymentId" TEXT NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "estado" "EstadoPagoMP" NOT NULL DEFAULT 'PENDIENTE',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "rawResponse" JSONB,

    CONSTRAINT "PagoMercadoPago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuota_socioId_mes_anio_key" ON "Cuota"("socioId", "mes", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "ArchivoDebito_mes_anio_key" ON "ArchivoDebito"("mes", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "PagoMercadoPago_cuotaId_key" ON "PagoMercadoPago"("cuotaId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoMercadoPago_pedidoId_key" ON "PagoMercadoPago"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "PagoMercadoPago_mpPaymentId_key" ON "PagoMercadoPago"("mpPaymentId");

-- AddForeignKey
ALTER TABLE "TarifaCuota" ADD CONSTRAINT "TarifaCuota_categoriaSocioId_fkey" FOREIGN KEY ("categoriaSocioId") REFERENCES "CategoriaSocio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuota" ADD CONSTRAINT "Cuota_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedioPagoAdherido" ADD CONSTRAINT "MedioPagoAdherido_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoRendicion" ADD CONSTRAINT "ArchivoRendicion_archivoDebitoId_fkey" FOREIGN KEY ("archivoDebitoId") REFERENCES "ArchivoDebito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoMercadoPago" ADD CONSTRAINT "PagoMercadoPago_cuotaId_fkey" FOREIGN KEY ("cuotaId") REFERENCES "Cuota"("id") ON DELETE SET NULL ON UPDATE CASCADE;
