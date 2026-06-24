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
