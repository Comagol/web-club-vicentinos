# Chat 2 — Backend: arquitectura y API

## Contexto del proyecto

Estoy desarrollando solo (o casi) la plataforma web integral de un club de rugby y hockey. Stack: Node.js + TypeScript en backend, React en frontend, base de datos a definir (preferencia por relacional). Ya tienen un sistema de gestión existente del que no sabemos aún si tiene API.

## Objetivo de este chat

Definir la arquitectura del backend: stack completo, estructura del proyecto, sistema de autenticación y roles, endpoints principales y lógica de negocio.



## Módulos del sistema

- Institucional, noticias y resultados, equipos
- Boutique online
- Portal de socios (perfil, cuotas, membresía)
- Carnet digital del socio
- Reserva de espacios comunes
- Actividades recaudatorias
- Módulo operativo (tareas tipo backlog para empleados por área)
- Panel de administración

## Roles del sistema

Socio, Subcomisión, Comisión Directiva, Empleado, Jefe de área, Administrador

## Reglas de negocio centrales

- Toda reserva de espacio o actividad requiere aprobación de Comisión Directiva
- Las actividades recaudatorias solo las inicia la subcomisión
- Las reservas de espacios las puede iniciar un socio (personal) o subcomisión (institucional)
- Áreas operativas fijas: mantenimiento, limpieza, seguridad
- Empleados y socios comparten autenticación pero no cruzan lógica

## Flujo de solicitudes

Entidad única `solicitud` con campo `origen` (socio / subcomisión) y `tipo` (reserva espacio / actividad recaudatoria).
Estados: pendiente → aprobado / rechazado con nota.

## Flujo de tareas operativas

Estados: pendiente → en proceso → con limitante / finalizado. Limitante alerta al jefe sin bloquear.

## Carnet digital

Cada socio tiene un carnet digital con nombre, apellido, foto, número de socio, categoría, estado de membresía, habilitación de estacionamiento (derivada automáticamente del estado de cuotas) y QR de verificación.

El QR apunta a una URL pública `club.com/verificar/{token}` que devuelve el estado actual del socio en tiempo real. El token es único por socio y estable. La vista de verificación no requiere login y muestra solo datos no sensibles.

Endpoint dedicado: `GET /socios/:id/carnet` y `GET /verificar/:token` (público, sin autenticación).

## Lo que necesito en este chat

- Recomendación y decisión de stack (framework, ORM, base de datos)
- Estructura de carpetas del proyecto
- Sistema de autenticación (JWT, refresh tokens)
- Manejo de roles y permisos (RBAC)
- Definición de endpoints principales por módulo
- Lógica del carnet y generación/validación del token QR
- Manejo de errores y validaciones
- Estrategia para la integración futura con el sistema de gestión existente

**Motor:** PostgreSQL
Elegido por el modelo de datos relacional complejo del proyecto: socios vinculados a categorías,
solicitudes con múltiples actores y estados, tareas con historial, y cuotas que afectan el carnet
en tiempo real. Tiene soporte nativo para JSON, compatibilidad total con los ORMs del ecosistema
TypeScript (Prisma, TypeORM, Drizzle) y es el estándar en proyectos Node.js + TypeScript modernos.

**Hosting recomendado:** Supabase (desarrollo y etapa inicial)
- PostgreSQL gestionado
- Autenticación incluida (reduce trabajo en el backend)
- Panel visual para gestión de datos
- Plan gratuito generoso para desarrollo

**Migración futura:** cuando el proyecto esté en producción y se conozca el volumen real de uso,
evaluar migración a AWS RDS o DigitalOcean Managed Databases si el costo o la escala lo requieren.


## Módulo de pagos y débito automático

El débito automático se gestiona mediante archivos que el club sube manualmente
a la plataforma de Banco Macro y Prisma. No hay API directa de débito automático.

El sistema debe automatizar la generación y lectura de esos archivos,
dejando solo la subida y descarga como acción manual del tesorero.

**Flujo completo:**
1. El sistema genera automáticamente el archivo de débitos del mes
   en el formato requerido por Macro/Prisma (formato COELSA)
2. El tesorero descarga el archivo desde el panel de admin y lo sube al banco
3. El banco ejecuta los débitos y el tesorero descarga el archivo de rendición
4. El tesorero sube el archivo de rendición al sistema
5. El sistema lo procesa, actualiza el estado de cada cuota
   y refleja los cambios en los carnets automáticamente

**Lo que el backend debe resolver:**
- Generación del archivo de débitos en formato COELSA
- Endpoint para descarga del archivo generado
- Endpoint para subida del archivo de rendición
- Procesamiento del archivo de rendición y actualización de estados
- Lógica de marcado de socios morosos tras cuotas impagas
- Notificación automática al socio cuando una cuota no se cobra
- Actualización automática del estado del carnet según estado de cuotas

**Decisión de stack de pagos:**
No se usa MercadoPago ni ninguna pasarela externa para las cuotas sociales.
El canal es Banco Macro + Prisma vía archivos. Para la boutique y actividades
recaudatorias se evaluará pasarela de pagos online en una etapa posterior.