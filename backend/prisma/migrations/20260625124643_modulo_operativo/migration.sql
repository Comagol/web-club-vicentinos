-- CreateEnum
CREATE TYPE "EstadoTarea" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'CON_LIMITANTE', 'FINALIZADO');

-- CreateTable
CREATE TABLE "Tarea" (
    "id" TEXT NOT NULL,
    "area" "AreaOperativa" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "asignadoAEmpleadoId" TEXT NOT NULL,
    "creadoPorUsuarioId" TEXT NOT NULL,
    "estado" "EstadoTarea" NOT NULL DEFAULT 'PENDIENTE',
    "notaLimitante" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TareaHistorial" (
    "id" TEXT NOT NULL,
    "tareaId" TEXT NOT NULL,
    "estadoAnterior" "EstadoTarea" NOT NULL,
    "estadoNuevo" "EstadoTarea" NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" TEXT,

    CONSTRAINT "TareaHistorial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_asignadoAEmpleadoId_fkey" FOREIGN KEY ("asignadoAEmpleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarea" ADD CONSTRAINT "Tarea_creadoPorUsuarioId_fkey" FOREIGN KEY ("creadoPorUsuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TareaHistorial" ADD CONSTRAINT "TareaHistorial_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "Tarea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TareaHistorial" ADD CONSTRAINT "TareaHistorial_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
