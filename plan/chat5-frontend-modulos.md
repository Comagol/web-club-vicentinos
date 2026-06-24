# Chat 5 — Frontend: módulos por área

## Contexto del proyecto

Estoy desarrollando solo (o casi) la plataforma web integral de un club de rugby y hockey. Stack: React + TypeScript en frontend, Node.js + TypeScript en backend. La arquitectura base del frontend ya está definida (rutas, estado, estructura de carpetas, autenticación).

## Objetivo de este chat

Construir los módulos de UI uno por uno: pantallas, componentes, flujos de interacción y conexión con la API.

## Módulos a desarrollar (orden sugerido de prioridad)

1. Autenticación (login, recuperación de contraseña, sesión persistente)
2. Portal de socios (perfil, cuotas, membresía)
3. Carnet digital (tarjeta con QR + vista pública de verificación)
4. Reserva de espacios comunes (calendario de disponibilidad, formulario, estados)
5. Actividades recaudatorias (listado para socios, formulario de inscripción)
6. Panel de Comisión Directiva (bandeja de aprobaciones, detalle, aprobar/rechazar)
7. Portal de subcomisión (crear actividades, solicitar espacios, ver estados)
8. Módulo operativo empleado (backlog diario, cambio de estado, reporte de limitante)
9. Módulo operativo jefe de área (crear tareas, asignar, panel general, alertas)
10. Boutique online (catálogo, carrito, checkout)
11. Panel de administración (usuarios, roles, CMS, configuración)

## Carnet digital — detalle del módulo

**Vista del socio:** pantalla tipo tarjeta con nombre, apellido, foto de perfil, número de socio, categoría, estado de membresía, indicador visual de habilitación de estacionamiento (verde = habilitado / rojo = inhabilitado, derivado automáticamente del estado de cuotas) y QR escaneable que apunta a la URL de verificación.

**Vista pública de verificación** (sin login, accesible escaneando el QR): muestra nombre, foto, estado de membresía y habilitación de estacionamiento. Diseño simple y claro, optimizado para mobile.

## Reglas de negocio que afectan la UI

- Toda solicitud de espacio o actividad muestra estado visible: pendiente / aprobado / rechazado
- El rechazo siempre muestra la nota de la CD
- El empleado puede agregar comentario al reportar un limitante
- La subcomisión puede reenviar una solicitud rechazada con correcciones
- La habilitación de estacionamiento en el carnet se actualiza en tiempo real según estado de cuotas

## Lo que necesito en este chat

Ir módulo por módulo definiendo pantallas necesarias, flujos de navegación, componentes clave y conexión con los endpoints del backend. Arrancar por el módulo que indique al inicio de la sesión.
