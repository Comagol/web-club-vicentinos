import client from '../api/client';
import { ApiResponse, PaginatedResponse } from '../types/api';
import {
  Socio, Carnet, Espacio, Reserva, Actividad, Solicitud, Tarea,
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
    client.get<ApiResponse<Carnet>>(`/carnet/${carnetId}/verificar`, { auth: false } as any),
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
