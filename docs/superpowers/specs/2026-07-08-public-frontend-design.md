# Public Frontend Design: Home, Navbar, Footer & Login Styling
**Date:** 2026-07-08  
**Project:** Club Vicentinos Web Platform  
**Stack:** React + TypeScript + Tailwind CSS  
**Design System:** vicentinos-design-system.md (v1.0)

---

## Overview

Build public-facing frontend with home page, styled login page, and navigation structure. Home page showcases club information with hero, news, disciplines, and boutique preview. Public pages (News, Teams, Boutique) created as placeholders. All styling follows the design system palette (navy-800, gold-500, grays).

---

## 1. Routing Structure

```
/                  → HomePage (public)
/login             → LoginPage (public, no navbar/footer)
/news              → NewsPage (public, placeholder)
/teams             → TeamsPage (public, placeholder)
/boutique          → BoutiquePage (public, placeholder)
/dashboard         → DashboardPage (protected, existing)
```

**Navigation Flow:**
- Public pages include Navbar (with login button) and Footer
- LoginPage is standalone (no navbar/footer)
- Authenticated users can still access public pages
- Protected routes redirect to login if not authenticated

---

## 2. Component Specifications

### 2.1 Navbar Component
**File:** `src/components/Navbar.tsx`

**Layout (Desktop - lg):**
- Left: Club logo (escudo, 40px)
- Center: Links (Home, News, Teams, Boutique) - 15px body text, navy-800 text, navy-600 hover
- Right: Login button (primary variant, navy-800 background)
- Padding: 16px 24px (md vertical, lg horizontal)
- Border-bottom: 0.5px solid gray-300
- Background: white

**Layout (Mobile - sm):**
- Left: Club logo (escudo, 32px)
- Right: Hamburger menu icon (Menu from lucide-react, 24px)
- When opened: sidebar dropdown with links and login button stacked
- Hamburger background: transparent, navy-800 color

**Styling Details:**
- Font: Inter, 15px / 400 for links
- Link states: hover → navy-600, active link → gold-500 underline
- Button: Primary variant (navy-800, white text, 40px height, 18px padding)
- Not sticky (stays in place on scroll)
- Z-index: 50 (above content but below modals)

**Props:** None required (reads auth state from context, uses useNavigate)

**Logic:**
- Show Login button if not authenticated if is authenticated it should display the name of the person and send him to his acount
- Render hamburger on mobile (breakpoint: sm: 640px)
- Active link indicator based on current route

---

### 2.2 Footer Component
**File:** `src/components/Footer.tsx`

**Layout:**
- Background: navy-950 (#0F2347)
- Text color: white / rgba(255,255,255,0.7)
- Padding: 48px 24px (3xl vertical, lg horizontal)

**Sections (stacked on mobile, 4-col grid on desktop):**
1. **Club Info**
   - Club name: "Club Vicentinos" (17px / 600 / white)
   - Address: "San Miguel, Buenos Aires" (13px / gray-200)
   - Founded year: "Desde 1920" (13px / gray-300)

2. **Disciplinas**
   - Header: "Disciplinas" (12px / 500 / uppercase)
   - Links: "Rugby" / "Hockey" (13px / 400)

3. **Navegación**
   - Header: "Navegación" (12px / 500 / uppercase)
   - Links: "Inicio" / "Noticias" / "Equipos" / "Boutique" (13px / 400)

4. **Contacto**
   - Header: "Contacto" (12px / 500 / uppercase)
   - Email: "info@vicentinos.com" (13px / 400)
   - Phone: "+54 (11) XXXX-XXXX" (13px / 400)

**Bottom Section:**
- Border-top: 0.5px solid navy-800
- Padding-top: 24px (xl)
- Center: Copyright text (11px / gray-400)
- Text: "© 2026 Club Vicentinos. Todos los derechos reservados."

**Mobile Adjustments:**
- Single column stack
- Padding: 32px 16px (2xl/lg)
- Text center-aligned on mobile, left-aligned on desktop

---

### 2.3 Home Page Sections

#### 2.3.1 Hero Section
**File:** `src/components/home/HeroSection.tsx`

**Layout:**
- Full viewport width
- Height: 500px (desktop), 400px (mobile)
- Background: Linear gradient 135deg navy-950 → navy-800 → navy-600
- Overlay with watermark escudo (opacity 8%, bottom-right)

**Content (center, text-aligned):**
- Club escudo: 80px (desktop), 60px (mobile), centered, margin-bottom 24px
- Headline: "Bienvenido al Club Vicentinos" (32px / 700 / white)
- Subheadline: "Donde la pasión por el rugby y el hockey se encuentra con la comunidad" (17px / 400 / rgba(255,255,255,0.8))
- CTA Button: "Conoce Más" (primary gold variant: gold-500 bg, navy-800 text, lg size)
- Button margin-top: 32px (2xl)

**Mobile Adjustments:**
- Headline: 24px
- Subheadline: 15px
- Padding: 48px 16px (3xl/lg)

---

#### 2.3.2 News/Announcements Section
**File:** `src/components/home/NewsSection.tsx`

**Layout:**
- Background: white
- Padding: 48px 24px (3xl vertical, lg horizontal)
- Container max-width: 1280px, centered

**Header:**
- Title: "Últimas Noticias" (22px / 600 / navy-900)
- Subtitle: "Entérate de lo que sucede en el club" (15px / 400 / gray-600)
- Margin-bottom: 32px (2xl)

**Grid:**
- Desktop: 3 columns (lg breakpoint)
- Tablet: 2 columns (md breakpoint)
- Mobile: 1 column (sm)
- Gap: 16px (lg)

**News Card Template:**
- Background: white
- Border: 0.5px solid gray-300
- Border-radius: 12px
- Padding: 16px (lg)
- Hover: box-shadow 0 4px 12px rgba(0,0,0,0.1)

**Card Content:**
- Date badge: "12px / 500 / gray-500" (display relative date: "Hace 2 días")
- Title: "17px / 600 / navy-900" (max 2 lines, truncate)
- Description: "13px / 400 / gray-700" (max 3 lines, truncate)
- Footer: "Leer más →" link (13px / gold-500)

**Mock Data (4 articles):**
- Sample rugby tournament announcement
- Sample hockey team update
- Club event announcement
- Boutique new arrival notice

---

#### 2.3.3 Disciplines Section (Rugby & Hockey)
**File:** `src/components/home/DisciplinesSection.tsx`

**Layout:**
- Background: navy-50 (#E8EFF8)
- Padding: 48px 24px (3xl vertical, lg horizontal)
- Container max-width: 1280px, centered

**Header:**
- Title: "Nuestras Disciplinas" (22px / 600 / navy-900)
- Margin-bottom: 32px (2xl)

**Grid:**
- Desktop: 2 columns (lg breakpoint)
- Mobile: 1 column (sm)
- Gap: 24px (xl)

**Discipline Card:**
- Background: white
- Border-radius: 12px
- Padding: 32px (2xl)
- Border: 0.5px solid gray-300

**Card Structure (per discipline):**
- Icon: Rugby ball or hockey stick (lucide-react or custom, 48px, gold-500)
- Title: Discipline name (22px / 600 / navy-900)
- Description: "Texto descriptivo sobre la disciplina" (15px / 400 / gray-700)
- Stats: 3 columns below (centered)
  - Stat item: "Número" (17px / 700 / gold-500) + "Label" (12px / 500 / gray-600)
  - Example: "15 | Equipos" / "250+ | Jugadores" / "25 | Años de historia"

**Mock Data:**
- **Rugby:** 
  - Description: "Tradición de excelencia en el rugby argentino desde 1920"
  - Stats: 8 Equipos, 180+ Jugadores, 15 Títulos
- **Hockey:**
  - Description: "Disciplina femenina en crecimiento constante"
  - Stats: 6 Equipos, 120+ Jugadores, 8 Títulos

---

#### 2.3.4 Boutique Preview Section
**File:** `src/components/home/BoutiquePreview.tsx`

**Layout:**
- Background: white
- Padding: 48px 24px (3xl vertical, lg horizontal)
- Container max-width: 1280px, centered

**Header:**
- Title: "Boutique Oficial" (22px / 600 / navy-900)
- Subtitle: "Equipamiento y merchandising oficial" (15px / 400 / gray-600)
- CTA Link: "Ver todo →" (gold-500, right-aligned)
- Margin-bottom: 32px (2xl)

**Grid:**
- Desktop: 4 columns (lg breakpoint)
- Tablet: 2 columns (md)
- Mobile: 2 columns (sm)
- Gap: 16px (lg)

**Product Card:**
- Background: white
- Border: 0.5px solid gray-300
- Border-radius: 12px
- Overflow: hidden
- Hover: scale(1.02), shadow increase

**Card Content:**
- Image placeholder: 240px height, gray-200 bg, center-aligned
- Padding: 12px (md)
- Name: "13px / 600 / navy-900" (truncate 1 line)
- Category badge: Rugby/Hockey discipline pill (12px / 500)
- Price: "15px / 700 / gold-500"
- Footer: "Agregar al carrito" button (sm variant, outline)

**Mock Data (4 products):**
- 2 Rugby items (jersey, shorts)
- 2 Hockey items (stick, protective gear)
- Prices in ARS (mock)

---

### 2.4 HomePage Assembly
**File:** `src/pages/HomePage.tsx`

**Structure:**
```
<Navbar />
<HeroSection />
<NewsSection />
<DisciplinesSection />
<BoutiquePreview />
<Footer />
```

**Logic:**
- No auth check (public page)
- Responsive layout (mobile-first)
- Smooth scrolling

---

### 2.5 LoginPage Restyling
**File:** `src/pages/LoginPage.tsx` (refactor existing)

**Layout:**
- No navbar/footer
- Centered form container
- Minimum height: 100vh (full viewport)
- Background: white / with optional subtle background pattern

**Card Structure:**
- Max-width: 400px
- Centered horizontally & vertically (flexbox)
- Background: white
- Border: 0.5px solid gray-300
- Border-radius: 12px
- Padding: 32px (2xl)
- Shadow: 0 4px 12px rgba(0,0,0,0.08)

**Form Content:**
- Logo: Club escudo (48px, centered, margin-bottom 24px)
- Title: "Inicia sesión" (22px / 600 / navy-900, centered, margin-bottom 8px)
- Subtitle: "Accede a tu cuenta de socio" (13px / 400 / gray-600, centered, margin-bottom 32px)

**Form Fields:**
- Email input:
  - Label: "Email" (12px / 500 / gray-700)
  - Input: 38px height, 0.5px border, navy-800 focus ring
  - Padding: 0 12px
  - Margin-bottom: 16px (lg)
  
- Password input: Same as email
  - Label: "Contraseña"

- Forgot password link: (12px / gold-500, right-aligned, no underline)

- Submit button: (lg size, primary, full width, margin-top 24px)
  - Text: "Inicia sesión" or "Iniciar sesión"
  - Loading state: show spinner + "Cargando..."

- Error message (if any): Banner style, danger bg + red text, padding 12px, border-radius 8px

- Footer text (centered, 12px / gray-600, margin-top 24px):
  - "¿No tienes cuenta? Contacta con administración" (or similar)

**Mobile Adjustments:**
- Padding: 24px (xl)
- Margin-top: 40px (instead of centering vertically)

---

### 2.6 Placeholder Pages
**Files:**
- `src/pages/NewsPage.tsx`
- `src/pages/TeamsPage.tsx`
- `src/pages/BoutiquePage.tsx`

**Each contains:**
- `<Navbar />`
- Centered heading: `<h3>{Page Name}</h3>` (22px / 600 / navy-900)
- `<Footer />`
- Padding: 48px 24px (3xl)

---

## 3. Mock Data Structure

**File:** `src/constants/mockData.ts`

```typescript
// Club information (Vicentinos-specific)
export const CLUB_INFO = {
  name: "Club Vicentinos",
  founded: 1920,
  location: "San Miguel, Buenos Aires",
  email: "info@vicentinos.com",
  phone: "+54 (11) 4700-XXXX"
}

// News articles (4 items, researched from club)
export const MOCK_NEWS = [...]

// Disciplines data
export const DISCIPLINES = {
  rugby: {
    name: "Rugby",
    description: "...",
    teams: 8,
    players: 180,
    titles: 15
  },
  hockey: { ... }
}

// Boutique products (4 items)
export const MOCK_BOUTIQUE_PRODUCTS = [...]
```

---

## 4. Styling Approach

**Design System Tokens Used:**
- **Colors:** navy-950, navy-800, navy-600, gold-500, gray-* series
- **Typography:** Inter, scale as per design system (H1, H2, Body, etc.)
- **Spacing:** 4px base, multiples (8, 12, 16, 24, 32, 48px)
- **Border-radius:** 8px (buttons, inputs, cards), 12px (cards, modals)
- **Breakpoints:** sm (640px), md (768px), lg (1024px)

**Tailwind Config:**
- Colors extended with design system palette
- Typography scale matches design system
- Custom utilities for common patterns (e.g., `.navy-primary-text`)

---

## 5. Implementation Order

1. **Mock data constants** (mockData.ts)
2. **Navbar component** (with mobile hamburger)
3. **Footer component**
4. **Home page sections** (Hero → News → Disciplines → Boutique)
5. **HomePage assembly**
6. **LoginPage restyling**
7. **Placeholder pages** (News, Teams, Boutique)
8. **App.tsx routing updates**
9. **Testing & adjustments**

---

## 6. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Logo in navbar 40px | Visible but not oversized; follows design system |
| Hamburger on sm (640px) | Standard mobile breakpoint; mobile-first approach |
| Non-sticky navbar | User requested; reduces cognitive load |
| Hero gradient 135deg | Institutional feel per design system |
| News cards limit 3 lines | Prevents layout breaking; encourages "read more" action |
| Product grid 4 cols → 2 cols mobile | Optimal viewing on small screens |
| LoginPage standalone | Reduces distraction; focus on auth task |
| Mock data from research | Authentic feel, user can replace with API later |

---

## 7. Scope & Exclusions

**Included:**
- All components specified above
- Mock data research (Club Vicentinos info)
- Responsive design (mobile-first)
- Tailwind + design system styling
- Navigation logic (active links, hamburger toggle)

**Excluded:**
- Full News/Teams/Boutique page functionality (placeholders only)
- API integration (mock data in constants)
- Dark mode (per design system, card is not dark-mode-aware; other pages can be added later)
- Authentication logic (existing in AuthContext)
- Cart functionality (existing, not modified)

---

## 8. Testing Checklist

- [ ] Home page renders all sections on desktop (lg)
- [ ] Home page responsive on mobile (sm)
- [ ] Navbar hamburger menu opens/closes on mobile
- [ ] Active link indicator works in navbar
- [ ] Footer links navigate correctly
- [ ] Login page form submits and handles errors
- [ ] Login page responsive on mobile
- [ ] Placeholder pages render with navbar/footer
- [ ] No console errors in browser dev tools
- [ ] Design system colors applied correctly
- [ ] Typography matches design system scale

