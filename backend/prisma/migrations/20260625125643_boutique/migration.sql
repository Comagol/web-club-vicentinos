-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE_PAGO', 'PAGADO', 'PREPARANDO', 'LISTO_PARA_RETIRAR', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPagoPedido" AS ENUM ('EFECTIVO', 'MERCADO_PAGO');

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT,
    "imagenUrl" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VarianteProducto" (
    "id" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "talla" TEXT,
    "color" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VarianteProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "socioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodoPago" "MetodoPagoPedido" NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "varianteProductoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VarianteProducto_productoId_talla_color_key" ON "VarianteProducto"("productoId", "talla", "color");

-- AddForeignKey
ALTER TABLE "PagoMercadoPago" ADD CONSTRAINT "PagoMercadoPago_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VarianteProducto" ADD CONSTRAINT "VarianteProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_socioId_fkey" FOREIGN KEY ("socioId") REFERENCES "Socio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_varianteProductoId_fkey" FOREIGN KEY ("varianteProductoId") REFERENCES "VarianteProducto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
