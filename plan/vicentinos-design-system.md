# Design System — Club Vicentinos
> Plataforma web integral · Rugby & Hockey · San Miguel, Buenos Aires  
> Stack: React + TypeScript + Tailwind CSS  
> Versión: 1.0 · Junio 2026

---

## 1. Identidad visual

### Logo y escudo
- El escudo institucional es el elemento de identidad principal.
- Siempre usar sobre fondos oscuros (navy-800, navy-950) o blancos.
- No deformar proporciones ni aplicar efectos.
- Tamaño mínimo: 28px de alto en UI, 48px en headers públicos.

### Personalidad visual
- **Institucional pero moderna**: seria, sin ser rígida.
- **Mobile-first**: todo componente se diseña primero para 375px.
- **Claridad sobre decoración**: bordes finos (0.5px), sin sombras innecesarias, sin gradientes decorativos.
- **Confianza y pertenencia**: los socios deben sentir que es la plataforma oficial del club.

---

## 2. Paleta de colores

### Primarios institucionales — Azul marino

| Token         | Hex       | Uso principal                                 |
|---------------|-----------|-----------------------------------------------|
| `navy-950`    | `#0F2347` | Fondos de carnet, headers oscuros             |
| `navy-800` ★  | `#1B3A6B` | Color primario: botones, navbars, acentos     |
| `navy-600`    | `#2451A0` | Hover de elementos primarios                  |
| `navy-400`    | `#4B78C8` | Acentos secundarios, links                    |
| `navy-200`    | `#A8C0E8` | Bordes sobre fondos oscuros                   |
| `navy-50`     | `#E8EFF8` | Fondos de sección, backgrounds suaves         |

### Secundarios institucionales — Dorado

| Token        | Hex       | Uso principal                                  |
|--------------|-----------|------------------------------------------------|
| `gold-700`   | `#C67D0A` | Hover del dorado, texto sobre fondo claro      |
| `gold-500` ★ | `#F5A623` | Color dorado institucional: CTAs, highlights   |
| `gold-300`   | `#F9C55A` | Gradientes del carnet, bordes decorativos      |
| `gold-50`    | `#FEF0CC` | Fondos de alertas/avisos dorados               |

### Neutros

| Token       | Hex       | Uso principal                       |
|-------------|-----------|-------------------------------------|
| `gray-900`  | `#111827` | Texto principal                     |
| `gray-700`  | `#374151` | Texto secundario                    |
| `gray-500`  | `#6B7280` | Texto muted, placeholders           |
| `gray-300`  | `#D1D5DB` | Bordes, separadores                 |
| `gray-100`  | `#F3F4F6` | Fondos de superficie, cards         |
| `white`     | `#FFFFFF` | Fondo base, texto sobre oscuros     |

### Estados semánticos

| Token       | Hex       | Uso                                       |
|-------------|-----------|-------------------------------------------|
| `success`   | `#16A34A` | Cuota al día, carnet habilitado, aprobado |
| `danger`    | `#DC2626` | Error, cuota vencida, inhabilitado        |
| `warning`   | `#D97706` | Advertencia, vencimiento próximo          |
| `info`      | `#2563EB` | Información general, notificaciones       |

### Backgrounds de estados semánticos (uso en banners/chips)

| Estado    | Background  | Texto       | Border      |
|-----------|-------------|-------------|-------------|
| success   | `#F0FDF4`   | `#15803D`   | `#86EFAC`   |
| danger    | `#FEF2F2`   | `#B91C1C`   | `#FCA5A5`   |
| warning   | `#FFFBEB`   | `#B45309`   | `#FDE68A`   |
| info      | `#EFF6FF`   | `#1D4ED8`   | `#BFDBFE`   |

---

## 3. Tipografía

**Familia:** Inter (Google Fonts)  
**Import:** `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`  
**Font stack:** `'Inter', system-ui, -apple-system, sans-serif`

### Escala tipográfica

| Rol         | Tamaño | Peso | Letter-spacing | Uso                                      |
|-------------|--------|------|----------------|------------------------------------------|
| H1          | 32px   | 700  | normal         | Títulos de sección pública               |
| H2          | 22px   | 600  | normal         | Subtítulos de módulo                     |
| H3          | 17px   | 600  | normal         | Títulos de card, sección interna         |
| Body        | 15px   | 400  | normal         | Texto corrido, descripciones             |
| Body small  | 13px   | 400  | normal         | Texto auxiliar, metadatos                |
| Label UI    | 12px   | 500  | +0.06em        | Etiquetas uppercase en UI                |
| Caption     | 12px   | 400  | normal         | Fechas, hints, texto de apoyo            |

### Reglas tipográficas
- Line-height cuerpo: `1.6`
- Line-height títulos: `1.2–1.3`
- No usar pesos menores a 400 ni mayores a 700.
- Labels uppercase siempre en 12px/500, nunca en tamaños mayores.

---

## 4. Espaciado y layout

### Sistema de espaciado (base 4px)

```
4px   · xs  — gap interno de badges, separadores mínimos
8px   · sm  — padding interno de chips, gap entre iconos y texto
12px  · md  — gap entre elementos de formulario, separadores
16px  · lg  — padding de cards, gap de grids
24px  · xl  — padding de secciones, separación de bloques
32px  · 2xl — margen entre secciones grandes
48px  · 3xl — padding de headers públicos
```

### Breakpoints (mobile-first)

```
sm:  640px   — teléfonos grandes / landscape
md:  768px   — tablets
lg:  1024px  — desktop
xl:  1280px  — desktop ancho (panel de administración)
```

### Radios de borde

```
4px  · pill interno, badges pequeños
8px  · botones, inputs, chips, iconos
12px · cards, modales, panels
16px · carnet digital, elementos destacados
9999px · pills, avatares
```

---

## 5. Componentes base

### Botones

| Variante   | Background  | Texto     | Border       | Uso                              |
|------------|-------------|-----------|--------------|----------------------------------|
| Primary    | `#1B3A6B`   | `#FFFFFF` | —            | Acción principal                 |
| Gold       | `#F5A623`   | `#1B3A6B` | —            | CTA secundario destacado         |
| Outline    | transparent | `#1B3A6B` | 1.5px navy   | Acción secundaria                |
| Ghost      | transparent | gray-500  | 0.5px gray   | Acción terciaria, cancelar       |
| Danger     | `#DC2626`   | `#FFFFFF` | —            | Eliminar, rechazar               |
| Success    | `#16A34A`   | `#FFFFFF` | —            | Confirmar, aprobar               |

**Tamaños:**
- `sm` — height: 32px, padding: 0 14px, font: 13px
- `md` (default) — height: 40px, padding: 0 18px, font: 14px
- `lg` — height: 48px, padding: 0 24px, font: 15px

**Estados:** hover → opacity 0.88 · active → scale(0.97) · disabled → opacity 0.45

### Badges de estado

| Badge      | Background  | Texto     | Uso                            |
|------------|-------------|-----------|--------------------------------|
| active     | `#DCFCE7`   | `#15803D` | Cuota al día, activo           |
| inactive   | `#FEE2E2`   | `#B91C1C` | Cuota vencida, suspendido      |
| pending    | `#FEF3C7`   | `#B45309` | Pendiente de aprobación        |
| info/blue  | `#DBEAFE`   | `#1D4ED8` | Habilitado, informativo        |
| gray       | gray-100    | gray-500  | Inactivo, sin categoría        |
| rugby      | `#EDE9FE`   | `#6D28D9` | Disciplina Rugby               |
| hockey     | `#FCE7F3`   | `#9D174D` | Disciplina Hockey              |

Estructura del badge: `dot (6px) + texto (12px/500)` · border-radius: 9999px · padding: 3px 10px

### Cards

```
Background:    #FFFFFF (light) / var(--color-background-primary)
Border:        0.5px solid #D1D5DB
Border-radius: 12px
Padding body:  16px
```

**Card con header institucional:**
- Header: background `#1B3A6B`, color white, padding 14px 16px
- Avatar/iniciales: 36px, background `rgba(245,166,35,0.2)`, color `#F5A623`
- Separadores de filas: 0.5px solid gray-300

### Formularios

```
Input height:        38px
Input padding:       0 12px
Input border:        0.5px solid #D1D5DB
Input border-radius: 8px
Input font:          14px / 400
Focus ring:          border-color #1B3A6B + box-shadow 0 0 0 3px rgba(27,58,107,0.12)
Error ring:          border-color #DC2626 + box-shadow 0 0 0 3px rgba(220,38,38,0.10)
Label:               12px / 500 / gray-700
Hint text:           11px / gray-500
Error text:          11px / #DC2626
```

### Banners de estado

```
Padding:       10px 14px
Border-radius: 8px
Font:          13px / 500
Border:        0.5px solid (color semántico)
```

---

## 6. Carnet digital del socio

### Especificaciones

- **Dimensiones:** 340px wide, aspect ratio aproximado 1.74:1 (similar a tarjeta de crédito)
- **Border-radius:** 16px
- **Fondo:** gradiente lineal `135deg` de `#0F2347` → `#1B3A6B` → `#2451A0`
- **Stripe superior:** 5px, gradiente `#F5A623` → `#F9C55A`
- **Elemento decorativo:** escudo en marca de agua, opacity 6%, posición bottom-right

### Secciones del carnet

**Header (zona superior):**
- Ícono escudo "V" en dorado (28px, border-radius 6px 6px 8px 8px)
- Nombre del club: 12px / 600 / uppercase / rgba(255,255,255,0.9)
- Deporte: 10px / rgba(255,255,255,0.5)
- Estado (habilitado/inhabilitado): pill en esquina superior derecha

**Cuerpo:**
- Foto de perfil: 64×80px, border-radius 8px, borde dorado semitransparente
- Nombre completo: 17px / 700 / white
- Número de socio: 11px / uppercase / rgba(255,255,255,0.5)
- Pills de categoría y disciplina: background rgba(255,255,255,0.1), borde rgba(255,255,255,0.15)
- Indicador de estacionamiento: pill verde/rojo según estado

**Footer:**
- Categoría y vencimiento: 10px / uppercase / izquierda
- QR code: 48×48px, background white, border-radius 6px / derecha

### Variantes de estado del carnet

| Estado        | Stripe color              | Estado pill     | Dot color  |
|---------------|---------------------------|-----------------|------------|
| Habilitado    | `#F5A623` → `#F9C55A`    | Verde           | `#22C55E`  |
| Inhabilitado  | `#991B1B` → `#DC2626`    | Rojo            | `#EF4444`  |

### Indicador de estacionamiento

| Estado        | Background                 | Texto     | Border                      |
|---------------|----------------------------|-----------|-----------------------------|
| Habilitado    | `rgba(22,163,74,0.25)`    | `#86EFAC` | `rgba(22,163,74,0.5)`      |
| Inhabilitado  | `rgba(239,68,68,0.2)`     | `#FCA5A5` | `rgba(239,68,68,0.4)`      |

---

## 7. Iconografía

**Librería:** `lucide-react`  
**Stroke:** 1.5px (default de Lucide)  
**Tamaños:**
- 16px — íconos inline en texto
- 20px — íconos en UI (botones, listas)
- 24px — íconos en navegación, headers de card

### Íconos por módulo

| Módulo / Función       | Ícono Lucide         |
|------------------------|----------------------|
| Perfil de socio        | `User`               |
| Carnet digital         | `CreditCard`         |
| Reservas               | `Calendar`           |
| Notificaciones         | `Bell`               |
| Configuración          | `Settings`           |
| Reportes / estadísticas| `BarChart2`          |
| QR code                | `QrCode`             |
| Aprobar solicitud      | `Check`              |
| Rechazar solicitud     | `X`                  |
| Boutique               | `ShoppingBag`        |
| Noticias               | `Newspaper`          |
| Control de acceso      | `Lock` / `Unlock`    |
| Estacionamiento        | `ParkingSquare`      |
| Cuotas / pagos         | `DollarSign`         |
| Equipos                | `Users`              |
| Actividades            | `Activity`           |
| Buscar                 | `Search`             |
| Menú mobile            | `Menu`               |
| Cerrar sesión          | `LogOut`             |
| Subir archivo          | `Upload`             |
| Descargar              | `Download`           |

---

## 8. Navegación (mobile-first)

### Capa pública
Top navbar con logo + links. En mobile: hamburger menu.

### Portal de socios (mobile)
**Bottom navigation bar** con 4–5 ítems:
- Inicio · Carnet · Reservas · Cuotas · Perfil

### Portales de gestión (desktop)
**Sidebar lateral** colapsable, background `#1B3A6B`, texto blanco.

---

## 9. Módulos y paleta aplicada

| Módulo                    | Tono dominante       | Notas                                    |
|---------------------------|----------------------|------------------------------------------|
| Home público              | Navy + blanco        | Hero con gradiente navy                  |
| Noticias                  | Blanco + navy-50     | Cards limpias                            |
| Equipos                   | Blanco + gold-50     | Badges por disciplina                    |
| Boutique                  | Blanco + gray-100    | E-commerce limpio                        |
| Registro de socios        | Navy + gold          | Formulario con CTA dorado                |
| Portal de socios          | Blanco + navy-50     | Bottom nav, cards institucionales        |
| Carnet digital            | Navy oscuro + dorado | Componente standalone                    |
| Portal subcomisión        | Blanco + navy        | Gestión, tablas, acciones                |
| Panel Comisión Directiva  | Navy + gold          | Dashboard con métricas                   |
| Módulo operativo          | Blanco + gray        | Kanban/backlog, desktop                  |
| Panel de administración   | Gray-100 + navy      | Tablas densas, desktop                   |
| Verificación por QR       | Blanco + verde/rojo  | Vista minimalista, sin login             |

---

## 10. Reglas de uso del color

1. **Nunca** usar verde o rojo como colores de identidad — son exclusivos para estados.
2. El dorado (`#F5A623`) **nunca** va sobre fondo blanco como texto — solo como fill/background.
3. El azul navy sobre blanco cumple contraste WCAG AA en todos sus usos de texto.
4. En el carnet, todos los colores son hardcoded (no adaptan a dark mode — es un documento físico digital).
5. El resto de la interfaz **debe** soportar dark mode usando CSS variables de Tailwind.

---

*Generado el 24 de junio de 2026 · Club Vicentinos Design System v1.0*
