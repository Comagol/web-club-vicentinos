# Chat 1 — Modelo de datos

## Contexto del proyecto

Estoy desarrollando solo (o casi) la plataforma web integral de un club de rugby y hockey. Stack definido: TypeScript en backend (Node.js), React en frontend. Ya tienen un sistema de gestión existente del que no sabemos aún si tiene API.

## Objetivo de este chat

Definir el modelo de datos completo: entidades, atributos y relaciones. Este modelo va a guiar todas las decisiones de backend y frontend.

## Módulos del sistema

- Institucional (estático, solo lectura pública)
- Noticias y resultados
- Equipos y divisiones
- Boutique online (merchandising y ropa deportiva)
- Portal de socios (perfil, cuotas, membresía)
- Carnet digital del socio
- Reserva de espacios comunes (parrilla, quincho, fogonero, etc.)
- Actividades recaudatorias (comidas, prodes, sorteos, etc.)
- Módulo operativo / mantenimiento (tareas tipo backlog para empleados)
- Panel de administración

## Roles del sistema

- **Socio:** accede al portal, reserva espacios, se inscribe a actividades, compra en boutique, tiene su carnet digital
- **Subcomisión:** todo lo del socio + crea actividades recaudatorias + solicita reservas institucionales de espacios
- **Comisión Directiva:** aprueba todo + ve reportes globales
- **Empleado:** ve su backlog diario operativo, actualiza estados, reporta limitantes
- **Jefe de área:** crea y asigna tareas, gestiona su área, recibe alertas
- **Administrador:** control total del sistema

## Reglas de negocio centrales

- Toda reserva de espacio o actividad requiere aprobación de Comisión Directiva, sin excepción
- Las actividades recaudatorias solo las puede iniciar la subcomisión
- Las reservas de espacios las puede iniciar un socio (uso personal) o una subcomisión (uso institucional)
- Áreas operativas fijas: mantenimiento, limpieza, seguridad
- Empleados y socios son universos separados que comparten autenticación pero no cruzan lógica de negocio

## Estructura deportiva

- **Rugby:** infantiles (escuelita, M8, M9, M10, M11, M12, M13, M14) / juveniles (M15, M16, M17, M19) / plantel superior
- **Hockey:** tres tiras (A, B, C), cada una con infantiles, juveniles y plantel superior

## Tipos de socios

Socio deportivo (rugby o hockey), padre/tutor de socio menor, socio no deportivo

## Flujo de solicitudes (espacios y actividades)

Entidad única `solicitud` con campo `origen` (socio / subcomisión) y `tipo` (reserva espacio / actividad recaudatoria).
Estados: pendiente → aprobado / rechazado con nota. Si es rechazado, quien lo inició puede corregir y reenviar.

## Flujo de tareas operativas

Estados: pendiente → en proceso → con limitante / finalizado. El limitante alerta al jefe de área sin bloquear la tarea.

## Carnet digital

Cada socio tiene un carnet digital con los siguientes datos:
- Nombre y apellido
- Foto de perfil
- Número de socio
- Categoría (deportivo rugby/hockey + división, no deportivo, padre/tutor)
- Estado de membresía (activo / inactivo / moroso)
- Habilitación de estacionamiento (se deriva automáticamente del estado de cuotas: al día = habilitado, cuota vencida = inhabilitado)
- Vigencia (mes y año en curso)
- QR de verificación

El QR apunta a una URL pública `club.com/verificar/{token}` que devuelve el estado actual del socio en tiempo real. El token es único por socio y estable. La vista de verificación no requiere login y muestra solo datos no sensibles (nombre, foto, estado, habilitación de estacionamiento).

## Lo que necesito en este chat

- Definir todas las entidades con sus atributos
- Definir las relaciones entre entidades (cardinalidad)
- Decisiones de diseño: enums vs tablas configurables, campos calculados vs almacenados
- Modelo del carnet y token de verificación
- Diagrama entidad-relación
