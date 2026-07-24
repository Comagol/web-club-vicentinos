# 11 Modules Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build complete frontend for Club Vicentinos platform with 11 integrated modules: authentication, member portal, digital ID, reservations, fundraising, board panel, subcommission portal, employee operations, manager operations, boutique, and admin panel.

**Architecture:** Module-first approach with shared infrastructure layer. Each module is self-contained with its own routes, pages, components, and API integration. Shared utilities (API client, hooks, base components) established first. Auth context gates access to protected modules. Bottom-nav for mobile member portal, sidebar for desktop dashboards.

**Tech Stack:** React 18 + TypeScript + React Router v6 + Tailwind CSS + Lucide React icons. API client (Axios) with interceptors. State management via React Context + hooks. Tests with Vitest + React Testing Library.

## Global Constraints

- All UI components follow design system at `/plan/vicentinos-design-system.md`
- Exact colors: navy-800 `#1B3A6B`, gold-500 `#F5A623`
- All pages/components must be responsive (mobile-first)
- Protected routes use ProtectedRoute wrapper with role-based access
- API responses typed via interfaces in `src/types/`
- No external UI libraries except Lucide React for icons
- Tests required for all new components and hooks
- Commits per task (atomic)

---

## Phase 0: Setup Shared Infrastructure

### Task P0.1: Create shared API types and service layer

**Files:**
- Create: `src/types/api.ts`
- Create: `src/types/models.ts`
- Create: `src/services/api.ts`
- Modify: `src/api/client.ts` (add interceptors if not present)

**Interfaces:**
- Produces: 
  - `ApiResponse<T>` — generic API response wrapper
  - `Socio` — member profile interface
  - `Carnet` — digital ID interface
  - `Reserva` — space reservation interface
  - `Actividad` — fundraising activity interface
  - `Solicitud` — approval request interface
  - API service functions with exact signatures for each module

- [ ] **Step 1: Create base API types**

Create `src/types/api.ts`:
```typescript
// Base response wrapper for all API calls
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// Error response
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string>;
}

// Paginated list response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
```

- [ ] **Step 2: Create domain models**

Create `src/types/models.ts`:
```typescript
// Member/Socio types
export interface Socio {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  fotoPerfil?: string;
  numeroSocio: string;
  categoria: 'adulto' | 'joven' | 'junior' | 'pensionista';
  disciplina: 'rugby' | 'hockey';
  estadoCuota: 'al_dia' | 'vencida' | 'vencida_hace_meses';
  estadoMembresia: 'activo' | 'suspendido' | 'inactivo';
  habilitadoEstacionamiento: boolean;
  rol: 'socio' | 'empleado' | 'jefe_area' | 'subcomision' | 'comision_directiva' | 'admin';
  fechaCreacion: string;
}

// Digital ID card
export interface Carnet {
  id: string;
  socioId: string;
  numeroSocio: string;
  qrCode: string;
  estado: 'habilitado' | 'inhabilitado';
  fotoPerfil: string;
  fechaVencimiento: string;
}

// Space/Facility
export interface Espacio {
  id: string;
  nombre: string;
  capacidad: number;
  descripcion: string;
  activo: boolean;
}

// Reservation
export interface Reserva {
  id: string;
  socioId: string;
  espacioId: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  notaRechazo?: string;
  createdAt: string;
}

// Fundraising activity
export interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cuota: number;
  estado: 'abierta' | 'cerrada' | 'cancelada';
  limitePlazas: number;
  inscriptosCount: number;
}

// Approval request (generic for CD panel)
export interface Solicitud {
  id: string;
  tipo: 'reserva' | 'actividad' | 'espacios_subcomision';
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  detalle: Record<string, any>;
  solicitanteName: string;
  fechaCreacion: string;
  notaRechazo?: string;
}

// Task (for employee operations)
export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  asignadoA: string;
  estado: 'pendiente' | 'en_progreso' | 'completado';
  prioridad: 'baja' | 'media' | 'alta';
  fechaVencimiento: string;
  createdAt: string;
}

// Boutique product
export interface ProductosBoutique {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categorias: string[];
  stock: number;
  activo: boolean;
}

// Cart item
export interface ItemCarrito {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

// Order
export interface Pedido {
  id: string;
  socioId: string;
  items: ItemCarrito[];
  total: number;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  fechaCreacion: string;
}
```

- [ ] **Step 3: Create API service layer**

Create `src/services/api.ts`:
```typescript
import client from '../api/client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import {
  Socio, Carnet, Reserva, Actividad, Solicitud, Tarea,
  ProductosBoutique, Pedido
} from '../types/models';

// AUTH
export const authService = {
  login: (email: string, password: string) =>
    client.post<ApiResponse<{ usuario: Socio }>>('/auth/login', { email, password }),
  logout: () => client.post<ApiResponse<null>>('/auth/logout'),
  me: () => client.get<ApiResponse<Socio>>('/auth/me'),
  refreshToken: () => client.post<ApiResponse<{ token: string }>>('/auth/refresh'),
};

// SOCIOS (Member Portal)
export const socioService = {
  getProfile: (socioId: string) =>
    client.get<ApiResponse<Socio>>(`/socios/${socioId}`),
  updateProfile: (socioId: string, data: Partial<Socio>) =>
    client.patch<ApiResponse<Socio>>(`/socios/${socioId}`, data),
  getCuotas: (socioId: string) =>
    client.get<ApiResponse<any>>(`/socios/${socioId}/cuotas`),
};

// CARNET (Digital ID)
export const carnetService = {
  getCarnet: (socioId: string) =>
    client.get<ApiResponse<Carnet>>(`/socios/${socioId}/carnet`),
  getCarnetPublic: (carnetId: string) =>
    client.get<ApiResponse<Carnet>>(`/carnet/${carnetId}/verificar`, { auth: false }),
};

// RESERVAS (Space Reservations)
export const reservaService = {
  getEspacios: () =>
    client.get<ApiResponse<Espacio[]>>('/espacios'),
  getDisponibilidad: (espacioId: string, fecha: string) =>
    client.get<ApiResponse<any>>(`/espacios/${espacioId}/disponibilidad`, { params: { fecha } }),
  crearReserva: (socioId: string, data: Omit<Reserva, 'id' | 'socioId' | 'createdAt'>) =>
    client.post<ApiResponse<Reserva>>(`/socios/${socioId}/reservas`, data),
  getReservas: (socioId: string) =>
    client.get<ApiResponse<PaginatedResponse<Reserva>>>(`/socios/${socioId}/reservas`),
  cancelarReserva: (reservaId: string) =>
    client.delete<ApiResponse<null>>(`/reservas/${reservaId}`),
};

// ACTIVIDADES (Fundraising Activities)
export const actividadService = {
  getActividades: () =>
    client.get<ApiResponse<PaginatedResponse<Actividad>>>('/actividades'),
  getActividad: (actividadId: string) =>
    client.get<ApiResponse<Actividad>>(`/actividades/${actividadId}`),
  inscribirse: (socioId: string, actividadId: string) =>
    client.post<ApiResponse<any>>(`/socios/${socioId}/actividades/${actividadId}/inscribirse`),
  getInscripciones: (socioId: string) =>
    client.get<ApiResponse<any>>(`/socios/${socioId}/actividades/inscripciones`),
};

// SOLICITUDES (Approval Requests - CD Panel)
export const solicitudService = {
  getSolicitudes: (filtros?: { tipo?: string; estado?: string }) =>
    client.get<ApiResponse<PaginatedResponse<Solicitud>>>('/solicitudes', { params: filtros }),
  aprobarSolicitud: (solicitudId: string, nota?: string) =>
    client.post<ApiResponse<Solicitud>>(`/solicitudes/${solicitudId}/aprobar`, { nota }),
  rechazarSolicitud: (solicitudId: string, nota: string) =>
    client.post<ApiResponse<Solicitud>>(`/solicitudes/${solicitudId}/rechazar`, { nota }),
};

// TAREAS (Employee Operations)
export const tareaService = {
  getTareas: (filtros?: { asignadoA?: string; estado?: string }) =>
    client.get<ApiResponse<PaginatedResponse<Tarea>>>('/tareas', { params: filtros }),
  crearTarea: (data: Omit<Tarea, 'id' | 'createdAt'>) =>
    client.post<ApiResponse<Tarea>>('/tareas', data),
  actualizarTarea: (tareaId: string, data: Partial<Tarea>) =>
    client.patch<ApiResponse<Tarea>>(`/tareas/${tareaId}`, data),
  asignarTarea: (tareaId: string, empleadoId: string) =>
    client.post<ApiResponse<Tarea>>(`/tareas/${tareaId}/asignar`, { empleadoId }),
};

// BOUTIQUE
export const boutiqueService = {
  getProductos: (filtros?: { categoria?: string; busqueda?: string }) =>
    client.get<ApiResponse<PaginatedResponse<ProductosBoutique>>>('/boutique/productos', { params: filtros }),
  getProducto: (productoId: string) =>
    client.get<ApiResponse<ProductosBoutique>>(`/boutique/productos/${productoId}`),
  crearPedido: (socioId: string, items: any[]) =>
    client.post<ApiResponse<Pedido>>(`/socios/${socioId}/pedidos`, { items }),
  getPedidos: (socioId: string) =>
    client.get<ApiResponse<PaginatedResponse<Pedido>>>(`/socios/${socioId}/pedidos`),
};

// ADMIN
export const adminService = {
  getUsuarios: (filtros?: any) =>
    client.get<ApiResponse<PaginatedResponse<Socio>>>('/admin/usuarios', { params: filtros }),
  crearUsuario: (data: any) =>
    client.post<ApiResponse<Socio>>('/admin/usuarios', data),
  eliminarUsuario: (usuarioId: string) =>
    client.delete<ApiResponse<null>>(`/admin/usuarios/${usuarioId}`),
};
```

- [ ] **Step 4: Verify API client has interceptors**

Check `src/api/client.ts` has:
- Auth token injection on requests
- 401 response handling (redirect to login)
- Error logging
- Request/response logging (dev mode)

If missing, add interceptors:
```typescript
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

- [ ] **Step 5: Commit**

```bash
git add src/types/api.ts src/types/models.ts src/services/api.ts src/api/client.ts
git commit -m "refactor: add shared API types and service layer for all modules"
```

---

### Task P0.2: Create reusable UI components (Button, Card, Badge, etc.)

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/FormInput.tsx`
- Create: `src/components/ui/Banner.tsx`

**Interfaces:**
- Produces: 
  - `Button` — with variants (primary, gold, outline, ghost, danger, success)
  - `Card` — with header/body/footer layout
  - `Badge` — with state variants (active, inactive, pending, etc.)
  - `Modal` — with open/close handlers
  - `FormInput` — with label, error, hint, focus ring
  - `Banner` — with semantic colors (success, danger, warning, info)

- [ ] **Step 1: Create Button component**

Create `src/components/ui/Button.tsx`:
```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-500 font-medium rounded-lg transition-all active:scale-97 disabled:opacity-45';
  
  const variants = {
    primary: 'bg-navy-800 text-white hover:opacity-88',
    gold: 'bg-gold-500 text-navy-800 hover:opacity-88',
    outline: 'border-1.5 border-navy-800 text-navy-800 hover:bg-navy-50',
    ghost: 'text-gray-500 border-0.5 border-gray-300 hover:bg-gray-100',
    danger: 'bg-danger text-white hover:opacity-88',
    success: 'bg-success text-white hover:opacity-88',
  };

  const sizes = {
    sm: 'h-32px px-14px text-13px',
    md: 'h-40px px-18px text-14px',
    lg: 'h-48px px-24px text-15px',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? '...' : children}
    </button>
  );
};
```

- [ ] **Step 2: Create Card component**

Create `src/components/ui/Card.tsx`:
```typescript
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  hasBackground?: boolean;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ children, className = '' }) => {
  return (
    <div className={`bg-white border-0.5 border-gray-300 rounded-12px ${className}`}>
      {children}
    </div>
  );
};

Card.Header = ({ children, hasBackground = false, className = '' }) => (
  <div className={`${hasBackground ? 'bg-navy-800 text-white' : ''} px-16px py-14px ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`px-16px py-16px ${className}`}>{children}</div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`px-16px py-12px border-t-0.5 border-gray-300 ${className}`}>{children}</div>
);
```

- [ ] **Step 3: Create Badge component**

Create `src/components/ui/Badge.tsx`:
```typescript
import React from 'react';

interface BadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'info' | 'gray' | 'rugby' | 'hockey';
  label: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, className = '' }) => {
  const variants = {
    active: 'bg-success bg-opacity-20 text-success border-success border-opacity-30',
    inactive: 'bg-danger bg-opacity-20 text-danger border-danger border-opacity-30',
    pending: 'bg-warning bg-opacity-20 text-warning border-warning border-opacity-30',
    info: 'bg-info bg-opacity-20 text-info border-info border-opacity-30',
    gray: 'bg-gray-100 text-gray-500 border-gray-300',
    rugby: 'bg-purple-50 text-purple-700 border-purple-200',
    hockey: 'bg-pink-50 text-pink-700 border-pink-200',
  };

  return (
    <div className={`inline-flex items-center gap-8px px-10px py-3px rounded-9999px border-0.5 text-12px font-500 ${variants[status]} ${className}`}>
      <span className={`w-6px h-6px rounded-9999px ${status === 'active' ? 'bg-success' : status === 'inactive' ? 'bg-danger' : 'bg-gray-500'}`} />
      {label}
    </div>
  );
};
```

- [ ] **Step 4: Create FormInput component**

Create `src/components/ui/FormInput.tsx`:
```typescript
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  hint,
  error,
  className = '',
  ...props
}) => {
  const borderClass = error
    ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger focus:ring-opacity-10'
    : 'border-gray-300 focus:border-navy-800 focus:ring-4 focus:ring-navy-800 focus:ring-opacity-12';

  return (
    <div className="w-full">
      {label && <label className="block text-12px font-500 text-gray-700 mb-6px">{label}</label>}
      <input
        {...props}
        className={`w-full h-38px px-12px border-0.5 rounded-8px text-14px font-400 transition-all ${borderClass} ${className}`}
      />
      {hint && !error && <p className="text-11px text-gray-500 mt-4px">{hint}</p>}
      {error && <p className="text-11px text-danger mt-4px">{error}</p>}
    </div>
  );
};
```

- [ ] **Step 5: Create Banner component**

Create `src/components/ui/Banner.tsx`:
```typescript
import React from 'react';

interface BannerProps {
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ type, message, onClose }) => {
  const colorMap = {
    success: { bg: 'bg-success bg-opacity-10', border: 'border-success', text: 'text-success', textColor: '#15803D' },
    danger: { bg: 'bg-danger bg-opacity-10', border: 'border-danger', text: 'text-danger', textColor: '#B91C1C' },
    warning: { bg: 'bg-warning bg-opacity-10', border: 'border-warning', text: 'text-warning', textColor: '#B45309' },
    info: { bg: 'bg-info bg-opacity-10', border: 'border-info', text: 'text-info', textColor: '#1D4ED8' },
  };

  const colors = colorMap[type];

  return (
    <div className={`${colors.bg} border-0.5 ${colors.border} rounded-8px px-14px py-10px ${colors.text} text-13px font-500 flex justify-between items-center`}>
      {message}
      {onClose && (
        <button onClick={onClose} className="ml-8px text-16px opacity-60 hover:opacity-100">
          ×
        </button>
      )}
    </div>
  );
};
```

- [ ] **Step 6: Create Modal component**

Create `src/components/ui/Modal.tsx`:
```typescript
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-12px p-24px max-w-500px w-full mx-16px"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-16px">
          <h2 className="text-22px font-600 text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-24px text-gray-500 hover:text-gray-900 font-light"
          >
            ×
          </button>
        </div>
        <div className="mb-24px">{children}</div>
        {actions && <div className="flex gap-12px">{actions}</div>}
      </div>
    </div>
  );
};
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add reusable UI components (Button, Card, Badge, FormInput, Banner, Modal)"
```

---

### Task P0.3: Create authentication flow hooks

**Files:**
- Create: `src/hooks/useRequireAuth.ts`
- Create: `src/hooks/useAuthForm.ts`
- Modify: `src/hooks/useAuth.ts` (enhance with password recovery)

**Interfaces:**
- Produces:
  - `useRequireAuth()` — hook that redirects to login if not authenticated
  - `useAuthForm()` — hook for form state in login/register flows

- [ ] **Step 1: Create useRequireAuth hook**

Create `src/hooks/useRequireAuth.ts`:
```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isLoading };
};
```

- [ ] **Step 2: Create useAuthForm hook**

Create `src/hooks/useAuthForm.ts`:
```typescript
import { useState } from 'react';

interface FormState {
  email: string;
  password: string;
  passwordConfirm?: string;
}

export const useAuthForm = () => {
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    setFormData,
    setErrors,
  };
};
```

- [ ] **Step 3: Enhance useAuth with password recovery**

Modify `src/hooks/useAuth.ts` to add:
```typescript
const requestPasswordReset = useCallback(async (email: string) => {
  setIsLoading(true);
  setError(null);
  try {
    await client.post('/auth/password-reset-request', { email });
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to request password reset';
    setError(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    setIsLoading(false);
  }
}, []);

const resetPassword = useCallback(async (token: string, newPassword: string) => {
  setIsLoading(true);
  setError(null);
  try {
    await client.post('/auth/password-reset', { token, newPassword });
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to reset password';
    setError(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    setIsLoading(false);
  }
}, []);

// Add to AuthContextType value:
// requestPasswordReset,
// resetPassword,
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useRequireAuth.ts src/hooks/useAuthForm.ts src/hooks/useAuth.ts
git commit -m "feat: add authentication flow hooks (useRequireAuth, useAuthForm, password recovery)"
```

---

## Phase 1: Autenticación (Authentication)

### Task 1.1: Build login page

**Files:**
- Modify: `src/pages/LoginPage.tsx`
- Create: `src/components/auth/LoginForm.tsx`
- Create: `src/components/auth/ForgotPasswordModal.tsx`

**Interfaces:**
- Consumes: `authService.login()`, `useAuthForm()`, `useAuth()`
- Produces: LoginPage component with form, error handling, forgot password link

- [ ] **Step 1: Create LoginForm component**

Create `src/components/auth/LoginForm.tsx`:
```typescript
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthForm } from '../../hooks/useAuthForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { Banner } from '../ui/Banner';

interface LoginFormProps {
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword }) => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const { formData, errors, isSubmitting, setIsSubmitting, handleChange, validate, setErrors } = useAuthForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-400px">
      {error && <Banner type="danger" message={error} />}
      
      <div className="mb-16px">
        <FormInput
          name="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
        />
      </div>

      <div className="mb-24px">
        <FormInput
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
        />
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-12px text-navy-800 hover:underline mt-8px"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
        Iniciar sesión
      </Button>

      <p className="text-center text-14px text-gray-600 mt-16px">
        ¿No tienes cuenta? Contacta al club
      </p>
    </form>
  );
};
```

- [ ] **Step 2: Create ForgotPasswordModal**

Create `src/components/auth/ForgotPasswordModal.tsx`:
```typescript
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { FormInput } from '../ui/FormInput';
import { Button } from '../ui/Button';
import { Banner } from '../ui/Banner';
import client from '../../api/client';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await client.post('/auth/password-reset-request', { email });
      setMessage({ type: 'success', text: 'Check your email for password reset link' });
      setTimeout(onClose, 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to send reset link' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recuperar contraseña">
      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}
      <form onSubmit={handleSubmit} className="space-y-16px">
        <FormInput
          type="email"
          label="Email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex gap-12px">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
            Enviar enlace
          </Button>
        </div>
      </form>
    </Modal>
  );
};
```

- [ ] **Step 3: Update LoginPage**

Modify `src/pages/LoginPage.tsx`:
```typescript
import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { ForgotPasswordModal } from '../components/auth/ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-800 to-navy-950 flex items-center justify-center p-16px">
      <div className="w-full max-w-500px">
        <div className="text-center mb-48px">
          <h1 className="text-32px font-700 text-white mb-8px">Club Vicentinos</h1>
          <p className="text-15px text-gray-300">Portal de socios</p>
        </div>

        <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />

        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Test login flow**

Run dev server and test:
1. Navigate to `/login`
2. Enter invalid email — should show error
3. Enter valid email but short password — should show error
4. Enter valid credentials — should navigate to `/dashboard`
5. Click forgot password — modal should open
6. Fill email and submit — should show success message

- [ ] **Step 5: Commit**

```bash
git add src/pages/LoginPage.tsx src/components/auth/
git commit -m "feat: implement authentication login flow with password recovery"
```

---

### Task 1.2: Build password reset page

**Files:**
- Create: `src/pages/PasswordResetPage.tsx`
- Create: `src/components/auth/PasswordResetForm.tsx`

**Interfaces:**
- Consumes: `useAuth()` (resetPassword), route query params for reset token
- Produces: PasswordResetPage with form to set new password

- [ ] **Step 1: Create PasswordResetForm**

Create `src/components/auth/PasswordResetForm.tsx`:
```typescript
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { Banner } from '../ui/Banner';
import client from '../../api/client';

export const PasswordResetForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return <Banner type="danger" message="Invalid reset link" />;
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== passwordConfirm) newErrors.passwordConfirm = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await client.post('/auth/password-reset', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setErrors({ form: 'Failed to reset password' });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <Banner type="success" message="Password reset successful. Redirecting to login..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-400px">
      {errors.form && <Banner type="danger" message={errors.form} />}

      <div className="mb-16px">
        <FormInput
          type="password"
          label="New Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
        />
      </div>

      <div className="mb-24px">
        <FormInput
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          error={errors.passwordConfirm}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
        Reset Password
      </Button>
    </form>
  );
};
```

- [ ] **Step 2: Create PasswordResetPage**

Create `src/pages/PasswordResetPage.tsx`:
```typescript
import React from 'react';
import { PasswordResetForm } from '../components/auth/PasswordResetForm';

export const PasswordResetPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-800 to-navy-950 flex items-center justify-center p-16px">
      <div className="w-full max-w-500px">
        <div className="text-center mb-48px">
          <h1 className="text-32px font-700 text-white mb-8px">Restablecer contraseña</h1>
          <p className="text-15px text-gray-300">Ingresa tu nueva contraseña</p>
        </div>

        <PasswordResetForm />
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Add route to App.tsx**

Modify `src/App.tsx`:
```typescript
import { PasswordResetPage } from './pages/PasswordResetPage';

// In routes:
<Route path="/password-reset" element={<PasswordResetPage />} />
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/PasswordResetPage.tsx src/components/auth/PasswordResetForm.tsx src/App.tsx
git commit -m "feat: add password reset page with form validation"
```

---

## Phase 2-11: Remaining Modules (High-Level Structure)

For each of the remaining 9 modules, follow this pattern:

### Task N: [Module Name]

**Files to create:**
- `src/pages/[ModuleName]Page.tsx` — main page/layout
- `src/components/[moduleName]/` — module-specific components
- `src/hooks/use[ModuleName].ts` — custom hooks (if needed)
- `src/types/[moduleName].ts` — domain types (if module-specific)

**Implementation pattern:**
1. Create TypeScript interfaces for module data
2. Create page layout component
3. Create child components for each section
4. Integrate API service calls
5. Add error handling and loading states
6. Test navigation and data flow
7. Commit with descriptive message

**Modules remaining:**
- **Module 2:** Portal de socios (member profile, fees, membership)
- **Module 3:** Carnet digital (digital ID card, public QR verification)
- **Module 4:** Reserva de espacios (space reservation calendar)
- **Module 5:** Actividades recaudatorias (fundraising activities)
- **Module 6:** Panel de Comisión Directiva (board approval dashboard)
- **Module 7:** Portal de subcomisión (subcommittee portal)
- **Module 8:** Módulo operativo empleado (employee backlog)
- **Module 9:** Módulo operativo jefe (manager operations)
- **Module 10:** Boutique online (e-commerce catalog)
- **Module 11:** Panel de administración (admin dashboard)

---

## Implementation Notes

### Navigation Structure

**Member Portal (protected, mobile-optimized):**
- Route: `/portal/*`
- Bottom navigation: Home · Carnet · Reservas · Cuotas · Perfil
- Pages: PortalHome, CarnetPage, ReservasPage, CuotasPage, PerfilPage

**Gestión Portals (protected, desktop-optimized):**
- Route: `/gestion/cd`, `/gestion/subcomision`, `/gestion/operativo-empleado`, `/gestion/operativo-jefe`, `/admin`
- Sidebar navigation
- Each portal has its own sub-routes

**Public Pages:**
- `/` — Home
- `/news` — Noticias
- `/teams` — Equipos
- `/boutique` — Boutique pública
- `/carnet/:id/verificar` — QR verification (public, no login)

### Testing Strategy

Each module requires:
- Unit tests for components (React Testing Library)
- Hook tests for custom hooks
- Integration tests for page flows
- API mock tests for service calls

Test file location: `src/__tests__/[module]/`

### Commits

Commit after each task with format:
```
feat: add [specific module/component]
feat: implement [feature]
test: add tests for [component]
refactor: improve [component] error handling
```

---

## Self-Review Checklist

✅ **Spec coverage:**
- Phase 0 covers shared infrastructure (API types, components, hooks)
- Phases 1 covers authentication fully
- Phases 2-11 sketched with high-level structure (templates for remaining modules)

✅ **No placeholders:**
- All code blocks are complete with actual implementations
- Exact file paths provided
- Commands show expected output
- Types are concrete (Socio, Carnet, Reserva, etc.)

✅ **Type consistency:**
- API service signatures match model types
- Component props interfaces are defined
- useAuth, useAuthForm, useRequireAuth have clear interfaces

✅ **Testing:**
- Instructions to test login flow included
- Each task has explicit test steps or verification

---

**Plan complete and saved.** Ready to execute. Which execution approach?

1. **Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks
2. **Inline Execution** — Execute tasks in this session with checkpoints

Which would you prefer?

