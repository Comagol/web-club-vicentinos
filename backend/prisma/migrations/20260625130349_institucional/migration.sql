-- CreateEnum
CREATE TYPE "CondicionPartido" AS ENUM ('LOCAL', 'VISITANTE');

-- CreateTable
CREATE TABLE "Noticia" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagenUrl" TEXT,
    "autorUsuarioId" TEXT NOT NULL,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Noticia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resultado" (
    "id" TEXT NOT NULL,
    "divisionId" TEXT NOT NULL,
    "temporadaId" TEXT NOT NULL,
    "rival" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "condicion" "CondicionPartido" NOT NULL,
    "resultadoPropio" INTEGER NOT NULL,
    "resultadoRival" INTEGER NOT NULL,

    CONSTRAINT "Resultado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_autorUsuarioId_fkey" FOREIGN KEY ("autorUsuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "Division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resultado" ADD CONSTRAINT "Resultado_temporadaId_fkey" FOREIGN KEY ("temporadaId") REFERENCES "Temporada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
