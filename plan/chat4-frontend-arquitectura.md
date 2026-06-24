# Chat 4 — Frontend: arquitectura y estructura

## Contexto del proyecto

Estoy desarrollando solo (o casi) la plataforma web integral de un club de rugby y hockey. Stack: React + TypeScript en frontend, Node.js + TypeScript en backend.

## Objetivo de este chat

Definir la arquitectura del frontend: estructura del proyecto, sistema de rutas, manejo de estado, diseño del sistema de vistas por rol y decisiones técnicas base.

## Roles del sistema y sus vistas principales

- **Socio:** portal personal, carnet digital, reservas, inscripciones, boutique
- **Subcomisión:** todo lo del socio + gestión de actividades y solicitudes de espacios
- **Comisión Directiva:** bandeja de aprobaciones, reportes
- **Empleado:** backlog diario de tareas operativas
- **Jefe de área:** gestión de tareas y empleados de su área
- **Administrador:** panel de control total

## Módulos que necesitan UI

- Capa pública: institucional, noticias, equipos, boutique, registro
- Portal de socios: perfil, cuotas, carnet digital, reservas, actividades, boutique
- Portal subcomisión: gestión de actividades y solicitudes de espacios
- Panel CD: aprobaciones y reportes
- Módulo operativo: backlog diario (empleado) y panel de gestión (jefe)
- Panel admin: usuarios, roles, CMS, boutique, configuración
- Vista pública de verificación de carnet (sin login, accesible por QR)

## Carnet digital

El socio ve su carnet como una tarjeta digital con: nombre, apellido, foto, número de socio, categoría, estado de membresía, habilitación de estacionamiento (indicador visual claro verde/rojo) y QR escaneable.

La vista de verificación (accesible escaneando el QR, sin login) muestra solo: nombre, foto, estado de membresía y habilitación de estacionamiento.

## Reglas de navegación

Cada rol ve solo las rutas que le corresponden. Un empleado no puede acceder al portal de socios y viceversa. La vista de verificación de carnet es la única ruta completamente pública sin autenticación.

## Lo que necesito en este chat

- Recomendación de stack complementario (router, estado global, fetching, UI library)
- Estructura de carpetas del proyecto
- Sistema de rutas protegidas por rol
- Estrategia de manejo de estado global vs local
- Convenciones de componentes y organización
- Estrategia de autenticación en el cliente (tokens, sesión persistente)
- Consideraciones de diseño para el carnet digital (pantalla tipo tarjeta, QR)
