import { Socio } from '../../types/models';

type BadgeVariant = 'active' | 'inactive' | 'pending' | 'info' | 'gray' | 'rugby' | 'hockey';

const roleLabels: Record<Socio['rol'], string> = {
  socio: 'Socio',
  empleado: 'Empleado',
  jefe_area: 'Jefe de área',
  subcomision: 'Subcomisión',
  comision_directiva: 'Comisión directiva',
  admin: 'Admin',
};

// admin = red, cd/jefe = gold-ish (pending/warning), employee = blue, socio = gray
const roleVariants: Record<Socio['rol'], BadgeVariant> = {
  admin: 'inactive',
  comision_directiva: 'pending',
  jefe_area: 'pending',
  subcomision: 'info',
  empleado: 'info',
  socio: 'gray',
};

export const getRoleBadge = (rol: Socio['rol']): { variant: BadgeVariant; label: string } => ({
  variant: roleVariants[rol],
  label: roleLabels[rol],
});

const statusLabels: Record<Socio['estadoMembresia'], string> = {
  activo: 'Activo',
  suspendido: 'Suspendido',
  inactivo: 'Inactivo',
};

const statusVariants: Record<Socio['estadoMembresia'], BadgeVariant> = {
  activo: 'active',
  suspendido: 'inactive',
  inactivo: 'gray',
};

export const getStatusBadge = (
  estado: Socio['estadoMembresia'],
): { variant: BadgeVariant; label: string } => ({
  variant: statusVariants[estado],
  label: statusLabels[estado],
});
