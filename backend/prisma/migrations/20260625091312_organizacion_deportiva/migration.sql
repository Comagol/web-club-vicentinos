-- CreateEnum
CREATE TYPE "Deporte" AS ENUM ('RUGBY', 'HOCKEY');

-- CreateEnum
CREATE TYPE "NivelDivision" AS ENUM ('INFANTILES', 'JUVENILES', 'PLANTEL_SUPERIOR');

-- CreateEnum
CREATE TYPE "TiraHockey" AS ENUM ('A', 'B', 'C');

-- CreateTable
CREATE TABLE "Division" (
    "id" TEXT NOT NULL,
    "deporte" "Deporte" NOT NULL,
    "categoria" TEXT NOT NULL,
    "nivel" "NivelDivision" NOT NULL,
    "tira" "TiraHockey",

    CONSTRAINT "Division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temporada" (
    "id" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,

    CONSTRAINT "Temporada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocioDivisionTemporada" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "temporadaId" TEXT NOT NULL,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocioDivisionTemporada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcomision" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subcomision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubcomisionMiembro" (
    "id" TEXT NOT NULL,
    "subcomisionId" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubcomisionMiembro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Division_deporte_categoria_tira_key" ON "Division"("deporte", "categoria", "tira");

-- CreateIndex
CREATE UNIQUE INDEX "Temporada_anio_key" ON "Temporada"("anio");

-- CreateIndex
CREATE UNIQUE INDEX "SocioDivisionTemporada_socioId_divisionId_temporadaId_key" ON "SocioDivisionTemporada"("socioId", "divisionId", "temporadaId");

-- CreateIndex
CREATE UNIQUE INDEX "Subcomision_nombre_key" ON "Subcomision"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "SubcomisionMiembro_subcomisionId_socioId_key" ON "SubcomisionMiembro"("subcomisionId", "socioId");

-- AddForeignKey
ALTER TABLE "SocioDivisionTemporada" ADD CONSTRAINT "SocioDivisionTemporada_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocioDivisionTemporada" ADD CONSTRAINT "SocioDivisionTemporada_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocioDivisionTemporada" ADD CONSTRAINT "SocioDivisionTemporada_temporadaId_fkey" FOREIGN KEY ("temporadaId") REFERENCES "Temporada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcomisionMiembro" ADD CONSTRAINT "SubcomisionMiembro_subcomisionId_fkey" FOREIGN KEY ("subcomisionId") REFERENCES "Subcomision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcomisionMiembro" ADD CONSTRAINT "SubcomisionMiembro_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
