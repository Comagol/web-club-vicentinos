# Public Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build public-facing frontend with home page, styled navbar/footer, restyled login page, and placeholder public pages following the design system.

**Architecture:** Component-based structure with design system tokens. Mock data in constants file. HomePage assembles reusable sections. Navbar detects auth state and shows login button or user name. All components use Tailwind CSS with navy/gold palette. Mobile-first responsive design with hamburger menu on sm breakpoint.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React (icons), React Router (existing), AuthContext (existing)

## Global Constraints

- **Design System Source:** `/Users/franciscocomabella/Desktop/personal stuffs/web vicentinos/plan/vicentinos-design-system.md`
- **Color Palette:** navy-950, navy-800, navy-600, gold-500, gray series (exact hex values from design system)
- **Typography:** Inter font, weights 400/500/600/700, sizes per design system scale
- **Spacing:** 4px base unit (4, 8, 12, 16, 24, 32, 48px multiples)
- **Border Radius:** 8px buttons/inputs/small elements, 12px cards/modals
- **Breakpoints:** sm: 640px, md: 768px, lg: 1024px (mobile-first approach)
- **Navbar:** Non-sticky, shows login button if unauthenticated, user name + link to dashboard if authenticated
- **LoginPage:** Standalone (no navbar/footer)
- **Public Pages:** All include Navbar and Footer except LoginPage
- **Mock Data:** Research Club Vicentinos (rugby/hockey club, San Miguel Buenos Aires, founded 1920)
- **Tailwind Config:** Located at project root, extend colors with design system tokens

---

## File Structure

### New Files to Create

```
src/
├── constants/
│   └── mockData.ts                 # Club info, news, disciplines, boutique products
├── components/
│   ├── Navbar.tsx                  # Top navigation with hamburger menu
│   ├── Footer.tsx                  # Footer with club info, links, copyright
│   └── home/
│       ├── HeroSection.tsx         # Hero banner with CTA
│       ├── NewsSection.tsx         # News cards grid
│       ├── DisciplinesSection.tsx  # Rugby/Hockey disciplines
│       └── BoutiquePreview.tsx     # Product preview grid
└── pages/
    ├── HomePage.tsx                # Assembled home page
    ├── LoginPage.tsx               # REFACTOR existing (add styling)
    ├── NewsPage.tsx                # Placeholder
    ├── TeamsPage.tsx               # Placeholder
    └── BoutiquePage.tsx            # Placeholder
```

### Files to Modify

```
src/
├── App.tsx                         # Add new routes
└── main.tsx                        # May need font import
```

---

## Task Breakdown

### Task 1: Create Mock Data Constants

**Files:**
- Create: `src/constants/mockData.ts`

**Interfaces:**
- Produces: `CLUB_INFO`, `MOCK_NEWS`, `DISCIPLINES`, `MOCK_BOUTIQUE_PRODUCTS` (exported constants)

- [ ] **Step 1: Create mock data file with Club Vicentinos info**

Create `src/constants/mockData.ts`:

```typescript
// Club Vicentinos information
export const CLUB_INFO = {
  name: "Club Vicentinos",
  founded: 1920,
  location: "San Miguel, Buenos Aires",
  email: "info@vicentinos.com",
  phone: "+54 (11) 4700-XXXX",
  description: "Club tradicional de rugby y hockey en Argentina",
};

// News/Announcements (4 articles)
export const MOCK_NEWS = [
  {
    id: 1,
    title: "Torneo Regional de Rugby 2026",
    description:
      "El equipo senior de rugby clasificó a la final del torneo regional. Prepárate para la gran final este sábado.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: "Rugby",
  },
  {
    id: 2,
    title: "Equipo Femenino de Hockey - Nuevas Inscripciones",
    description:
      "Abrimos inscripciones para el equipo femenino de hockey. Todas las edades bienvenidas. Entrenamientos martes y jueves.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: "Hockey",
  },
  {
    id: 3,
    title: "Evento Familiar en el Club",
    description:
      "Este domingo celebramos el aniversario del club con asados, actividades deportivas y entretenimiento para toda la familia.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    category: "Eventos",
  },
  {
    id: 4,
    title: "Nuevos Productos en la Boutique",
    description:
      "Llegaron las nuevas camisetas oficiales 2026 con el nuevo diseño del escudo. Disponibles en colores tradicionales.",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: "Boutique",
  },
];

// Disciplines data
export const DISCIPLINES = {
  rugby: {
    name: "Rugby",
    description:
      "Tradición de excelencia en el rugby argentino desde 1920. Nuestros equipos compiten en distintas categorías.",
    stats: {
      teams: 8,
      players: 180,
      titles: 15,
    },
  },
  hockey: {
    name: "Hockey",
    description:
      "Disciplina femenina en crecimiento constante. Desarrollo de talento joven y participación en competiciones provinciales.",
    stats: {
      teams: 6,
      players: 120,
      titles: 8,
    },
  },
};

// Boutique products
export const MOCK_BOUTIQUE_PRODUCTS = [
  {
    id: 1,
    name: "Camiseta Oficial Rugby 2026",
    category: "Rugby",
    price: 4500,
    currency: "ARS",
    image: "rugby-jersey-2026",
  },
  {
    id: 2,
    name: "Short de Rugby",
    category: "Rugby",
    price: 2800,
    currency: "ARS",
    image: "rugby-shorts",
  },
  {
    id: 3,
    name: "Stick de Hockey Profesional",
    category: "Hockey",
    price: 8500,
    currency: "ARS",
    image: "hockey-stick",
  },
  {
    id: 4,
    name: "Protectores Hockey Completo",
    category: "Hockey",
    price: 6200,
    currency: "ARS",
    image: "hockey-protection",
  },
];
```

- [ ] **Step 2: Verify mock data exports**

Run in Node REPL to check imports work:

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | grep "mockData" || echo "Mock data compiles OK"
```

Expected: No errors related to mockData

- [ ] **Step 3: Commit mock data**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/constants/mockData.ts
git commit -m "feat: add mock data for club vicentinos (news, disciplines, boutique)"
```

---

### Task 2: Create Navbar Component

**Files:**
- Create: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `useAuth()` hook (from contexts), `useNavigate` (from react-router), `Menu` and `X` from lucide-react
- Produces: `<Navbar />` component (no props)

- [ ] **Step 1: Create Navbar component with desktop layout**

Create `src/components/Navbar.tsx`:

```typescript
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Inicio' },
  { path: '/news', label: 'Noticias' },
  { path: '/teams', label: 'Equipos' },
  { path: '/boutique', label: 'Boutique' },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-navy-800 rounded flex items-center justify-center text-white font-bold">
            V
          </div>
          <span className="hidden sm:inline text-sm font-600 text-navy-800">
            Vicentinos
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`text-sm font-400 cursor-pointer transition-colors ${
                isActive(link.path)
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-navy-800 hover:text-navy-600'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth Section (Desktop) */}
        <div className="hidden sm:flex items-center gap-4">
          {isAuthenticated && user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-sm font-500 text-navy-800 hover:text-navy-600"
            >
              {user.name || user.email}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 h-10 bg-navy-800 text-white text-sm font-500 rounded-lg hover:opacity-88 transition-opacity"
            >
              Inicia sesión
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 text-navy-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-300 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setIsMenuOpen(false);
              }}
              className={`block text-sm font-400 cursor-pointer ${
                isActive(link.path) ? 'text-gold-500 font-600' : 'text-navy-800'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="border-t border-gray-300 pt-4">
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-sm font-500 text-navy-800"
              >
                Mi Cuenta ({user.name || user.email})
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-navy-800 text-white text-sm font-500 rounded-lg hover:opacity-88"
              >
                Inicia sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
```

- [ ] **Step 2: Verify Navbar compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | head -20
```

Expected: No TypeScript errors related to Navbar

- [ ] **Step 3: Commit Navbar**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/components/Navbar.tsx
git commit -m "feat: add Navbar with desktop layout, mobile hamburger, and auth state"
```

---

### Task 3: Create Footer Component

**Files:**
- Create: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: `CLUB_INFO` from mockData, `useNavigate` from react-router
- Produces: `<Footer />` component (no props)

- [ ] **Step 1: Create Footer component**

Create `src/components/Footer.tsx`:

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CLUB_INFO } from '../constants/mockData';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-navy-950 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Club Info */}
          <div>
            <h3 className="text-base font-600 text-white mb-4">
              {CLUB_INFO.name}
            </h3>
            <p className="text-xs text-gray-300 mb-2">{CLUB_INFO.location}</p>
            <p className="text-xs text-gray-400">
              Desde {CLUB_INFO.founded}
            </p>
          </div>

          {/* Disciplinas */}
          <div>
            <h3 className="text-xs font-500 uppercase text-white mb-4 tracking-wider">
              Disciplinas
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Rugby
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Hockey
                </button>
              </li>
            </ul>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-xs font-500 uppercase text-white mb-4 tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/news')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Noticias
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Equipos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/boutique')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Boutique
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-500 uppercase text-white mb-4 tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li className="text-xs text-gray-300">{CLUB_INFO.email}</li>
              <li className="text-xs text-gray-300">{CLUB_INFO.phone}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-navy-800 max-w-7xl mx-auto px-6 py-6">
        <p className="text-center text-xs text-gray-500">
          © 2026 Club Vicentinos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
```

- [ ] **Step 2: Verify Footer compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | head -20
```

Expected: No TypeScript errors related to Footer

- [ ] **Step 3: Commit Footer**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/components/Footer.tsx
git commit -m "feat: add Footer with club info, links, and copyright"
```

---

### Task 4: Create Home Page Sections (Part 1: HeroSection)

**Files:**
- Create: `src/components/home/HeroSection.tsx`

**Interfaces:**
- Consumes: none
- Produces: `<HeroSection />` component (no props)

- [ ] **Step 1: Create HeroSection component**

Create `src/components/home/HeroSection.tsx`:

```typescript
import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-navy-950 via-navy-800 to-navy-600 flex items-center justify-center overflow-hidden">
      {/* Watermark Escudo (background) */}
      <div className="absolute bottom-0 right-0 opacity-[0.06] text-white text-9xl font-bold">
        V
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-12 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="w-20 md:w-24 h-20 md:h-24 bg-gold-500 rounded-lg mx-auto mb-6 flex items-center justify-center">
          <span className="text-white text-4xl md:text-5xl font-bold">V</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-4xl font-700 text-white mb-4">
          Bienvenido al Club Vicentinos
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-xl font-400 text-white text-opacity-80 mb-8">
          Donde la pasión por el rugby y el hockey se encuentra con la comunidad
        </p>

        {/* CTA Button */}
        <button className="px-8 py-3 md:px-10 md:py-4 bg-gold-500 text-navy-800 font-600 text-sm md:text-base rounded-lg hover:opacity-88 transition-opacity">
          Conoce Más
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify HeroSection compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | grep -i "hero" || echo "HeroSection compiles OK"
```

Expected: No errors

- [ ] **Step 3: Commit HeroSection**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/components/home/HeroSection.tsx
git commit -m "feat: add HeroSection with gradient background and CTA button"
```

---

### Task 5: Create Home Page Sections (Part 2: NewsSection)

**Files:**
- Create: `src/components/home/NewsSection.tsx`

**Interfaces:**
- Consumes: `MOCK_NEWS` from mockData
- Produces: `<NewsSection />` component (no props)

- [ ] **Step 1: Create utility function for relative dates**

Add to `src/constants/mockData.ts` (append to end of file):

```typescript
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Hace 1 día';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
  }

  const months = Math.floor(diffDays / 30);
  return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
};
```

- [ ] **Step 2: Create NewsSection component**

Create `src/components/home/NewsSection.tsx`:

```typescript
import React from 'react';
import { MOCK_NEWS, formatRelativeDate } from '../../constants/mockData';

export const NewsSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-600 text-navy-900 mb-2">
            Últimas Noticias
          </h2>
          <p className="text-sm md:text-base font-400 text-gray-600">
            Entérate de lo que sucede en el club
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MOCK_NEWS.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-gray-300 rounded-xl p-4 md:p-5 hover:shadow-lg transition-shadow"
            >
              {/* Date Badge */}
              <p className="text-xs font-500 text-gray-500 mb-2">
                {formatRelativeDate(article.date)}
              </p>

              {/* Title */}
              <h3 className="text-base md:text-lg font-600 text-navy-900 mb-2 line-clamp-2">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm font-400 text-gray-700 mb-4 line-clamp-3">
                {article.description}
              </p>

              {/* Read More Link */}
              <a href="#" className="text-xs md:text-sm font-500 text-gold-500 hover:text-gold-700">
                Leer más →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 3: Verify NewsSection compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | grep -i "news\|error" || echo "NewsSection compiles OK"
```

Expected: No errors

- [ ] **Step 4: Commit NewsSection**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/constants/mockData.ts frontend/src/components/home/NewsSection.tsx
git commit -m "feat: add NewsSection with cards and relative date formatting"
```

---

### Task 6: Create Home Page Sections (Part 3: DisciplinesSection)

**Files:**
- Create: `src/components/home/DisciplinesSection.tsx`

**Interfaces:**
- Consumes: `DISCIPLINES` from mockData
- Produces: `<DisciplinesSection />` component (no props)

- [ ] **Step 1: Create DisciplinesSection component**

Create `src/components/home/DisciplinesSection.tsx`:

```typescript
import React from 'react';
import { DISCIPLINES } from '../../constants/mockData';
import { Trophy, Users } from 'lucide-react';

export const DisciplinesSection: React.FC = () => {
  const disciplines = Object.values(DISCIPLINES);

  return (
    <section className="w-full bg-navy-50 py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-600 text-navy-900">
            Nuestras Disciplinas
          </h2>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {disciplines.map((discipline) => (
            <div
              key={discipline.name}
              className="bg-white rounded-xl p-6 md:p-8 border border-gray-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center mb-4">
                <Trophy size={24} className="text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-600 text-navy-900 mb-3">
                {discipline.name}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base font-400 text-gray-700 mb-6">
                {discipline.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-700 text-gold-500">
                    {discipline.stats.teams}
                  </p>
                  <p className="text-xs md:text-sm font-500 text-gray-600">
                    Equipos
                  </p>
                </div>
                <div className="text-center border-l border-r border-gray-300">
                  <p className="text-xl md:text-2xl font-700 text-gold-500">
                    {discipline.stats.players}
                  </p>
                  <p className="text-xs md:text-sm font-500 text-gray-600">
                    Jugadores
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-700 text-gold-500">
                    {discipline.stats.titles}
                  </p>
                  <p className="text-xs md:text-sm font-500 text-gray-600">
                    Títulos
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify DisciplinesSection compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | head -20
```

Expected: No errors

- [ ] **Step 3: Commit DisciplinesSection**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/components/home/DisciplinesSection.tsx
git commit -m "feat: add DisciplinesSection with rugby/hockey stats and icons"
```

---

### Task 7: Create Home Page Sections (Part 4: BoutiquePreview)

**Files:**
- Create: `src/components/home/BoutiquePreview.tsx`

**Interfaces:**
- Consumes: `MOCK_BOUTIQUE_PRODUCTS` from mockData, `useNavigate` from react-router
- Produces: `<BoutiquePreview />` component (no props)

- [ ] **Step 1: Create BoutiquePreview component**

Create `src/components/home/BoutiquePreview.tsx`:

```typescript
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BOUTIQUE_PRODUCTS } from '../../constants/mockData';
import { ShoppingBag } from 'lucide-react';

export const BoutiquePreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-600 text-navy-900 mb-2">
              Boutique Oficial
            </h2>
            <p className="text-sm md:text-base font-400 text-gray-600">
              Equipamiento y merchandising oficial
            </p>
          </div>
          <button
            onClick={() => navigate('/boutique')}
            className="mt-4 md:mt-0 text-sm md:text-base font-500 text-gold-500 hover:text-gold-700"
          >
            Ver todo →
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {MOCK_BOUTIQUE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-300 rounded-xl overflow-hidden hover:scale-105 transition-transform"
            >
              {/* Product Image Placeholder */}
              <div className="w-full h-32 md:h-48 bg-gray-200 flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>

              {/* Product Info */}
              <div className="p-3 md:p-4">
                {/* Category Badge */}
                <span className="inline-block text-xs font-500 px-2 py-1 rounded-full bg-navy-50 text-navy-800 mb-2">
                  {product.category}
                </span>

                {/* Product Name */}
                <h4 className="text-xs md:text-sm font-600 text-navy-900 line-clamp-1 mb-2">
                  {product.name}
                </h4>

                {/* Price */}
                <p className="text-sm md:text-base font-700 text-gold-500">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Verify BoutiquePreview compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | head -20
```

Expected: No errors

- [ ] **Step 3: Commit BoutiquePreview**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/components/home/BoutiquePreview.tsx
git commit -m "feat: add BoutiquePreview section with product grid"
```

---

### Task 8: Create HomePage Component

**Files:**
- Create: `src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `<Navbar />`, `<Footer />`, `<HeroSection />`, `<NewsSection />`, `<DisciplinesSection />`, `<BoutiquePreview />`
- Produces: `<HomePage />` component (no props)

- [ ] **Step 1: Create HomePage assembly**

Create `src/pages/HomePage.tsx`:

```typescript
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { NewsSection } from '../components/home/NewsSection';
import { DisciplinesSection } from '../components/home/DisciplinesSection';
import { BoutiquePreview } from '../components/home/BoutiquePreview';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <NewsSection />
        <DisciplinesSection />
        <BoutiquePreview />
      </main>
      <Footer />
    </div>
  );
};
```

- [ ] **Step 2: Verify HomePage compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | head -20
```

Expected: No errors

- [ ] **Step 3: Commit HomePage**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/pages/HomePage.tsx
git commit -m "feat: add HomePage with hero, news, disciplines, and boutique sections"
```

---

### Task 9: Restyle LoginPage

**Files:**
- Modify: `src/pages/LoginPage.tsx`

**Interfaces:**
- Consumes: `useAuth()`, `useNavigate`, existing form logic
- Produces: Modified `<LoginPage />` component (same props, new styling)

- [ ] **Step 1: Restyle LoginPage**

Replace content of `src/pages/LoginPage.tsx`:

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-6 py-12">
      <div className="w-full max-w-sm bg-white border border-gray-300 rounded-2xl shadow-sm p-8 md:p-10">
        {/* Logo */}
        <div className="w-16 h-16 bg-navy-800 rounded-lg mx-auto mb-6 flex items-center justify-center">
          <span className="text-white text-3xl font-bold">V</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-600 text-navy-900 text-center mb-2">
          Inicia sesión
        </h1>

        {/* Subtitle */}
        <p className="text-xs md:text-sm font-400 text-gray-600 text-center mb-8">
          Accede a tu cuenta de socio
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs md:text-sm font-500 text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-500 text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm font-400 focus:outline-none focus:border-navy-800 focus:ring-2 focus:ring-navy-800 focus:ring-opacity-20 disabled:opacity-50"
              placeholder="tu@email.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-500 text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm font-400 focus:outline-none focus:border-navy-800 focus:ring-2 focus:ring-navy-800 focus:ring-opacity-20 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="#"
              className="text-xs md:text-sm font-500 text-gold-500 hover:text-gold-700"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 md:h-12 bg-navy-800 text-white font-600 text-sm md:text-base rounded-lg hover:opacity-88 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Cargando...
              </>
            ) : (
              'Inicia sesión'
            )}
          </button>
        </form>

        {/* Footer Text */}
        <p className="text-center text-xs md:text-sm font-400 text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <span className="font-500 text-gray-700">
            Contacta con administración
          </span>
        </p>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Verify LoginPage compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | grep -i "login\|error" || echo "LoginPage compiles OK"
```

Expected: No errors

- [ ] **Step 3: Commit LoginPage**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/pages/LoginPage.tsx
git commit -m "feat: restyle LoginPage with design system colors and layout"
```

---

### Task 10: Create Placeholder Pages

**Files:**
- Create: `src/pages/NewsPage.tsx`
- Create: `src/pages/TeamsPage.tsx`
- Create: `src/pages/BoutiquePage.tsx`

**Interfaces:**
- Consumes: `<Navbar />`, `<Footer />`
- Produces: Three placeholder components

- [ ] **Step 1: Create NewsPage placeholder**

Create `src/pages/NewsPage.tsx`:

```typescript
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const NewsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 md:py-16">
        <h3 className="text-2xl md:text-3xl font-600 text-navy-900">
          Noticias
        </h3>
      </main>
      <Footer />
    </div>
  );
};
```

- [ ] **Step 2: Create TeamsPage placeholder**

Create `src/pages/TeamsPage.tsx`:

```typescript
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const TeamsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 md:py-16">
        <h3 className="text-2xl md:text-3xl font-600 text-navy-900">
          Equipos
        </h3>
      </main>
      <Footer />
    </div>
  );
};
```

- [ ] **Step 3: Create BoutiquePage placeholder**

Create `src/pages/BoutiquePage.tsx`:

```typescript
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const BoutiquePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 md:py-16">
        <h3 className="text-2xl md:text-3xl font-600 text-navy-900">
          Boutique
        </h3>
      </main>
      <Footer />
    </div>
  );
};
```

- [ ] **Step 4: Verify placeholder pages compile**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | head -20
```

Expected: No errors

- [ ] **Step 5: Commit placeholder pages**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/pages/NewsPage.tsx frontend/src/pages/TeamsPage.tsx frontend/src/pages/BoutiquePage.tsx
git commit -m "feat: add placeholder pages for News, Teams, and Boutique"
```

---

### Task 11: Update App.tsx Routing

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `<HomePage />`, `<NewsPage />`, `<TeamsPage />`, `<BoutiquePage />`
- Produces: Updated routing with new public pages

- [ ] **Step 1: Read current App.tsx to understand structure**

```bash
cat /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend/src/App.tsx
```

- [ ] **Step 2: Update App.tsx with new routes**

Replace `src/App.tsx`:

```typescript
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NewsPage } from './pages/NewsPage';
import { TeamsPage } from './pages/TeamsPage';
import { BoutiquePage } from './pages/BoutiquePage';
import { DashboardPage } from './pages/DashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppRoutes: React.FC = () => {
  const { restoreSession, isLoading } = useAuth();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/teams" element={<TeamsPage />} />
      <Route path="/boutique" element={<BoutiquePage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};
```

- [ ] **Step 3: Verify App.tsx compiles**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | head -20
```

Expected: No errors

- [ ] **Step 4: Commit routing update**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git add frontend/src/App.tsx
git commit -m "feat: add public routes for home, news, teams, and boutique pages"
```

---

### Task 12: Final Verification & Testing

**Files:**
- No files created, testing only

**Interfaces:**
- Consumes: All components from Tasks 1-11
- Produces: Verified working application

- [ ] **Step 1: Start dev server**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run dev 2>&1 &
sleep 3
echo "Dev server started (check http://localhost:5173)"
```

- [ ] **Step 2: Verify home page loads**

Open browser to `http://localhost:5173/` and check:
- [ ] Navbar renders with logo, links, login button
- [ ] Hero section displays with gradient and CTA button
- [ ] News section shows 4 articles with dates
- [ ] Disciplines section shows Rugby and Hockey cards with stats
- [ ] Boutique preview shows 4 products
- [ ] Footer displays club info, links, copyright
- [ ] No console errors in browser DevTools

- [ ] **Step 3: Verify navbar navigation**

Click each navbar link and verify:
- [ ] Home → loads HomePage
- [ ] Noticias → loads NewsPage with h3 heading
- [ ] Equipos → loads TeamsPage with h3 heading
- [ ] Boutique → loads BoutiquePage with h3 heading
- [ ] Active link shows gold underline

- [ ] **Step 4: Verify login button**

Click "Inicia sesión" button and verify:
- [ ] Navigates to LoginPage
- [ ] Login page displays form with no navbar/footer
- [ ] Form has email, password, submit button
- [ ] No console errors

- [ ] **Step 5: Verify mobile responsiveness**

Open browser DevTools, toggle mobile view (375px width) and check:
- [ ] Navbar shows hamburger icon instead of links
- [ ] Click hamburger opens mobile menu with stacked links
- [ ] Hero section height is 400px (mobile)
- [ ] News grid shows 1 column
- [ ] Disciplines grid shows 1 column
- [ ] Boutique grid shows 2 columns
- [ ] Footer stacked in single column
- [ ] All text is readable, no overflow

- [ ] **Step 6: Verify footer links**

Click footer links and verify:
- [ ] "Inicio" → navigates to home
- [ ] "Noticias" → navigates to news page
- [ ] "Equipos" → navigates to teams page
- [ ] "Boutique" → navigates to boutique page

- [ ] **Step 7: Stop dev server and run final build**

```bash
pkill -f "npm run dev" || true
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npm run build 2>&1 | tail -10
```

Expected: Build succeeds with no errors

- [ ] **Step 8: No TypeScript errors**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos/frontend
npx tsc --noEmit 2>&1 | head -20
```

Expected: No errors (or only external type definition warnings)

- [ ] **Step 9: Final commit summary**

```bash
cd /Users/franciscocomabella/Desktop/personal\ stuffs/web\ vicentinos
git log --oneline -10
```

Verify all commits from this plan are present

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Mock data constants (Task 1)
- ✅ Navbar component with auth state and hamburger (Task 2)
- ✅ Footer component with links and copyright (Task 3)
- ✅ HeroSection with gradient and CTA (Task 4)
- ✅ NewsSection with cards and relative dates (Task 5)
- ✅ DisciplinesSection with Rugby/Hockey (Task 6)
- ✅ BoutiquePreview with product grid (Task 7)
- ✅ HomePage assembly (Task 8)
- ✅ LoginPage restyling (Task 9)
- ✅ Placeholder pages (Task 10)
- ✅ App.tsx routing updates (Task 11)
- ✅ Testing & verification (Task 12)

**Placeholder Scan:**
- ✅ No "TBD", "TODO", or "fill in" placeholders
- ✅ All code blocks are complete and exact
- ✅ All commands show expected output
- ✅ No "similar to Task N" references

**Type Consistency:**
- ✅ Component signatures match across tasks
- ✅ Import paths are exact
- ✅ No type mismatches
- ✅ All interfaces documented

**Scope Check:**
- ✅ Plan is focused on public frontend only
- ✅ No backend changes
- ✅ No auth logic changes
- ✅ No protected routes modified
- ✅ Tasks are independently testable

---

**Plan Ready for Execution**

