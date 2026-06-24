# Chat 3 — Integración con el sistema de gestión existente

## Contexto del proyecto

Estoy desarrollando solo (o casi) la plataforma web integral de un club de rugby y hockey. Stack: Node.js + TypeScript en backend, React en frontend. El club tiene un sistema de gestión existente del que aún no sabemos si tiene API disponible.

## Objetivo de este chat

Definir la estrategia de integración entre la nueva plataforma y el sistema de gestión existente del club.

## Qué maneja el sistema de gestión actual

Presumiblemente: padrón de socios, categorías, cuotas y pagos. Es el sistema de referencia para saber si un socio está activo o no.

## Lo que la nueva plataforma necesita del sistema existente

- Estado de membresía del socio (activo / inactivo / moroso)
- Datos del perfil del socio
- Historial de pagos de cuotas
- Categoría deportiva asignada
- Número de socio

Estos datos también alimentan el carnet digital: la habilitación de estacionamiento se deriva automáticamente del estado de cuotas, por lo que la sincronización tiene que ser confiable y lo más cercana al tiempo real posible.

## Incógnita principal

No sabemos si el sistema existente tiene API. Antes de definir la estrategia hay que investigar qué tipo de sistema es y qué opciones de integración ofrece.

## Escenarios posibles a evaluar

1. Tiene API REST → integración directa
2. No tiene API pero permite acceso a base de datos → integración por DB
3. Solo exporta archivos (CSV, Excel) → sincronización periódica
4. No tiene ninguna salida → migración de datos a la nueva plataforma

## Lo que necesito en este chat

- Metodología para evaluar el sistema existente
- Estrategia de integración según el escenario que corresponda
- Manejo de sincronización y consistencia de datos
- Impacto en el carnet digital (el estado de cuotas tiene que estar siempre actualizado)
- Plan de contingencia si la integración no es viable


## Módulo de pagos y débito automático

El débito automático se gestiona mediante archivos que el club sube manualmente
a la plataforma de Banco Macro y Prisma. No hay API directa de débito automático.

**Contexto operativo actual:**
El proceso hoy es manual de punta a punta: alguien genera los datos de cobro,
los sube al banco, y después actualiza el estado de los socios a mano
tras descargar la rendición.

**Lo que el sistema nuevo resuelve:**
- Generación automática del archivo de débitos mensual en formato COELSA
- Procesamiento automático del archivo de rendición al subirlo al sistema
- Actualización automática de estados de cuotas y carnets
- El tesorero solo interviene en los dos pasos de subida/descarga del banco

**Decisión de migración:**
Dado que el sistema nuevo gestiona débitos, carnets y estados de socios,
el sistema de gestión existente queda reemplazado y no integrado.
La migración es una exportación única de datos: padrón de socios,
categorías, historial de pagos y CBU/tarjetas adheridas.

**Lo que necesito en este chat:**
- Identificar el formato de exportación del sistema actual (CSV, Excel, otro)
- Definir el plan de migración de datos al nuevo sistema PostgreSQL
- Definir el formato COELSA requerido por Macro/Prisma para los archivos de débito
- Estrategia de validación de datos migrados antes del primer débito real
- Plan de contingencia: qué pasa si la migración tiene datos inconsistentes