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
