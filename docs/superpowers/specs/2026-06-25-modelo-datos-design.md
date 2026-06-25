# Modelo de datos — Plataforma Club Vicentinos

Spec derivada de `plan/chat1-modelo-datos.md`, con decisiones que también afectan `plan/chat2-backend.md` (Postgres, JWT, RBAC) y `plan/chat3-integracion.md` (migración única desde el sistema viejo, sin integración continua).

**Nota sobre chat2:** el chat2 había decidido no usar pasarela de pago externa para cuotas ("No se usa MercadoPago ni ninguna pasarela externa para las cuotas sociales"). Esa decisión queda **revertida parcialmente**: Mercado Pago se incorpora como método alternativo opcional para cuotas (ver sección Cuotas y pagos), en paralelo al flujo de archivos COELSA con Macro/Prisma, que sigue existiendo sin cambios. Hay que reflejar este cambio en el chat2 también.

## Decisiones de diseño transversales

**Enums fijos en código** (no requieren tabla, el valor no cambia sin una decisión de negocio mayor):
`rol`, `area` operativa, `estado_membresia`, `estado` de Solicitud/Tarea/Cuota/Pedido, `origen` y `tipo` de Solicitud, `tipo` de MedioPagoAdherido, `condicion` de Resultado.

**Tablas configurables** (el admin agrega/edita valores sin deploy):
`CategoriaSocio`, `Division`, `Espacio`, `TarifaCuota`, `GrupoFamiliar`.

**Calculado vs almacenado:**
- Almacenado: `Socio.estado_membresia` (se actualiza transaccionalmente al procesar una `ArchivoRendicion` o por job mensual al vencer una cuota; necesario porque `GET /verificar/:token` es público y debe responder rápido sin recorrer el historial de cuotas en cada escaneo de QR).
- Almacenado: `ItemPedido.precio_unitario` (snapshot histórico, no debe cambiar si el precio del producto cambia después).
- Calculado al vuelo: `habilitacion_estacionamiento` (`true` si `estado_membresia == activo`, si no `false`), `vigencia` del carnet (mes/año actual del servidor), división/categoría vigente del socio (se lee la fila más reciente de `SocioDivisionTemporada`).

**Historial preservado explícitamente:** `SocioDivisionTemporada` (división por temporada), `TareaHistorial` (cambios de estado de tareas), cadena de `Solicitud` rechazada → reenviada vía `solicitud_padre_id`.

**Carnet digital:** no existe tabla `Carnet`. Es una vista derivada construida en `GET /socios/:id/carnet` y `GET /verificar/:token` combinando `Socio` + división vigente + `estado_membresia` (almacenado) + `habilitacion_estacionamiento` (calculado) + `token_qr` (almacenado, estable, generado una sola vez al crear el socio).

---

## Entidades

### Personas y autenticación

**Usuario** — tabla de auth compartida entre socios y empleados.
- `id`, `email` (único), `password_hash`, `activo`, `creado_en`

**UsuarioRol** (N:M — un usuario puede tener más de un rol, ej. socio + subcomisión)
- `id`, `usuario_id`, `rol` (enum: socio, subcomision, comision_directiva, empleado, jefe_area, admin, encargado_boutique)

**Socio**
- `id`, `usuario_id` (FK nullable — null si es menor sin login propio)
- `numero_socio` (único), `nombre`, `apellido`, `fecha_nacimiento`, `foto_url`
- `categoria_socio_id` (FK a `CategoriaSocio`)
- `tutor_id` (FK auto-referencial a `socio.id`, nullable)
- `estado_membresia` (enum: activo, inactivo, moroso)
- `token_qr` (único, estable)

Regla de acceso: un socio tiene `usuario_id` propio solo desde categoría juvenil M15+ (rugby) o equivalente en hockey. Por debajo de esa edad, `usuario_id` es null y el tutor gestiona todo desde su propia cuenta vía `tutor_id`.

**CategoriaSocio** (config table)
- `id`, `nombre` (deportivo_rugby, deportivo_hockey, no_deportivo, activo, benefactor, matrimonio, ...), `descripcion`

**GrupoFamiliar**
- `id`, `tipo` (enum: matrimonio)

**GrupoFamiliarMiembro**
- `id`, `grupo_familiar_id`, `socio_id` — para tipo=matrimonio se esperan exactamente 2 filas (validación en capa de aplicación)

**Empleado**
- `id`, `usuario_id` (FK), `nombre`, `apellido`, `area` (enum: mantenimiento, limpieza, seguridad)

### Organización deportiva

**Division** (config table)
- `id`, `deporte` (enum: rugby, hockey), `categoria` (ej. "M8", "Plantel Superior"), `nivel` (enum: infantiles, juveniles, plantel_superior), `tira` (nullable, solo hockey: A/B/C)

**Temporada**
- `id`, `anio`

**SocioDivisionTemporada** (historial)
- `id`, `socio_id`, `division_id`, `temporada_id`, `fecha_asignacion`
- Restricción: máximo una división activa por deporte por temporada por socio

**Subcomision**
- `id`, `nombre`, `descripcion`, `activa`

**SubcomisionMiembro** (N:M)
- `id`, `subcomision_id`, `socio_id`, `fecha_alta`

### Cuotas y pagos

**TarifaCuota** (config table)
- `id`, `categoria_socio_id` (FK), `monto`, `vigente_desde`, `vigente_hasta` (nullable)

**Cuota**
- `id`, `socio_id`, `mes`, `anio`, `monto`, `estado` (enum: pendiente, pagada, vencida), `fecha_vencimiento`, `fecha_pago` (nullable), `metodo` (enum: debito_automatico, manual, mercado_pago)
- Restricción única: (`socio_id`, `mes`, `anio`)
- Mercado Pago es una opción alternativa que el socio elige cuota por cuota (no reemplaza el débito automático); útil para quien no tiene medio adherido o quiere pagar al instante una cuota vencida.

**MedioPagoAdherido**
- `id`, `socio_id`, `tipo` (enum: cbu, tarjeta), `dato_enmascarado`, `activo`

**ArchivoDebito**
- `id`, `mes`, `anio`, `fecha_generacion`, `url_archivo`, `generado_por` (usuario_id)

**ArchivoRendicion**
- `id`, `archivo_debito_id`, `fecha_subida`, `subido_por`, `procesado` (boolean), `fecha_procesamiento`

**PagoMercadoPago** (pagos por gateway, reutilizable para cuotas y pedidos de boutique)
- `id`, `cuota_id` (FK nullable), `pedido_id` (FK nullable), `mp_payment_id` (id externo de Mercado Pago), `monto`, `estado` (enum: pendiente, aprobado, rechazado, reembolsado), `fecha_creacion`, `fecha_actualizacion`, `raw_response` (json, nullable — payload del webhook para auditoría)
- Restricción: exactamente uno de `cuota_id` / `pedido_id` debe estar presente (mutuamente excluyentes), validado en capa de aplicación.
- Cuando `estado` pasa a `aprobado`, actualiza transaccionalmente el `estado` de la `Cuota` o `Pedido` asociado.

### Solicitudes (reservas y actividades recaudatorias)

**Solicitud**
- `id`, `origen` (enum: socio, subcomision), `tipo` (enum: reserva_espacio, actividad_recaudatoria)
- `creado_por_usuario_id`, `socio_id` (nullable), `subcomision_id` (nullable)
- `estado` (enum: pendiente, aprobado, rechazado), `nota_rechazo` (nullable)
- `resuelto_por_usuario_id` (nullable), `fecha_solicitud`, `fecha_resolucion` (nullable)
- `solicitud_padre_id` (FK auto-referencial, nullable) — encadena reenvíos tras un rechazo

**Espacio** (config table)
- `id`, `nombre`, `descripcion`, `capacidad` (nullable), `activo`

**ReservaEspacio** (detalle 1:1 de Solicitud)
- `id`, `solicitud_id`, `espacio_id`, `fecha`, `hora_inicio`, `hora_fin`, `uso` (enum: personal, institucional)
- Validación de no-superposición de horarios aprobados para el mismo espacio/fecha, aplicada al momento de aprobar (no al crear, porque pueden competir solicitudes pendientes por el mismo horario)

**ActividadRecaudatoria** (detalle 1:1 de Solicitud)
- `id`, `solicitud_id`, `subcomision_id`, `nombre`, `descripcion`, `fecha`, `cupo` (nullable), `precio` (nullable)

**InscripcionActividad**
- `id`, `actividad_id`, `socio_id`, `fecha_inscripcion`, `estado_pago` (enum: pendiente, pagado, no_aplica)

### Módulo operativo

**Tarea**
- `id`, `area` (enum: mantenimiento, limpieza, seguridad), `titulo`, `descripcion`
- `asignado_a_empleado_id`, `creado_por_usuario_id`
- `estado` (enum: pendiente, en_proceso, con_limitante, finalizado), `nota_limitante` (nullable)
- `fecha_creacion`, `fecha_actualizacion`

**TareaHistorial**
- `id`, `tarea_id`, `estado_anterior`, `estado_nuevo`, `usuario_id`, `fecha`, `comentario` (nullable)

### Boutique

Es un e-commerce simple gestionado por los `encargado_boutique`: ellos crean/editan productos, ajustan stock y actualizan el estado de los pedidos. Retiro únicamente en el club — no hay envío a domicilio, por lo que `Pedido` no tiene dirección de entrega.

**Producto**
- `id`, `nombre`, `descripcion`, `categoria`, `imagen_url`, `activo`

**VarianteProducto**
- `id`, `producto_id`, `talla` (nullable), `color` (nullable), `precio`, `stock`

**Pedido**
- `id`, `socio_id`, `fecha`, `metodo_pago` (enum: efectivo, mercado_pago), `estado` (enum: pendiente_pago, pagado, preparando, listo_para_retirar, entregado, cancelado), `total`
- El stock de cada `VarianteProducto` se reserva (se descuenta) al crear el pedido, sin importar el método de pago, para evitar sobreventa.
- Con `metodo_pago = mercado_pago`, el pedido pasa a `pagado` automáticamente cuando se aprueba el `PagoMercadoPago` asociado (vía webhook).
- Con `metodo_pago = efectivo`, el pedido queda en `pendiente_pago` hasta que el socio retira y paga en persona; un `encargado_boutique` lo marca como `pagado`/`entregado` en ese momento. Si el socio no retira, el encargado puede cancelar el pedido para liberar el stock reservado.

**ItemPedido**
- `id`, `pedido_id`, `variante_producto_id`, `cantidad`, `precio_unitario`

### Institucional, noticias y resultados

**Noticia**
- `id`, `titulo`, `contenido`, `imagen_url`, `autor_usuario_id`, `fecha_publicacion`, `publicado`

**Resultado**
- `id`, `division_id`, `temporada_id`, `rival`, `fecha`, `condicion` (enum: local, visitante), `resultado_propio`, `resultado_rival`

Contenido institucional estático (historia, autoridades) no tiene entidad — vive fijo en el frontend; cambios requieren deploy.

---

## Diagrama entidad-relación (resumen de cardinalidades)

```
Usuario 1──N UsuarioRol
Usuario 1──0..1 Socio
Usuario 1──0..1 Empleado

Socio N──1 CategoriaSocio
Socio N──0..1 Socio (tutor_id, auto-referencial)
Socio N──N GrupoFamiliar (vía GrupoFamiliarMiembro)
Socio N──N Subcomision (vía SubcomisionMiembro)
Socio 1──N SocioDivisionTemporada N──1 Division
SocioDivisionTemporada N──1 Temporada

Socio 1──N Cuota
CategoriaSocio 1──N TarifaCuota
Socio 1──N MedioPagoAdherido
ArchivoDebito 1──N ArchivoRendicion (en la práctica 1:1, modelado como 1:N por flexibilidad)
Cuota 1──0..1 PagoMercadoPago
Pedido 1──0..1 PagoMercadoPago

Solicitud 1──0..1 ReservaEspacio
Solicitud 1──0..1 ActividadRecaudatoria
Solicitud N──0..1 Solicitud (solicitud_padre_id, auto-referencial)
Espacio 1──N ReservaEspacio
ActividadRecaudatoria 1──N InscripcionActividad N──1 Socio
Subcomision 1──N ActividadRecaudatoria

Empleado 1──N Tarea (asignado_a)
Tarea 1──N TareaHistorial

Producto 1──N VarianteProducto
Socio 1──N Pedido 1──N ItemPedido N──1 VarianteProducto

Division 1──N Resultado
Temporada 1──N Resultado
```

## Fuera de alcance de este chat

- Diseño de endpoints y autenticación (chat2)
- Estrategia de migración de datos del sistema viejo (chat3)
- Integración de pasarela de pago para boutique/actividades (a definir en etapa posterior, según chat2)
