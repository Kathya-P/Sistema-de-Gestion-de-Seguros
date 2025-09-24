import { 
  Home, 
  FileText, 
  Users, 
  Calculator, 
  AlertTriangle, 
  Shield, 
  Car, 
  BarChart3 
} from 'lucide-react';

// Usuarios para autenticación
export const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    username: 'agente',
    password: 'agente123',
    name: 'Agente Comercial',
    role: 'agent'
  },
  {
    id: 3,
    username: 'usuario',
    password: 'usuario123',
    name: 'Usuario Final',
    role: 'user'
  }
];

// Menú de navegación enfocado en seguros vehiculares
export const allMenuItems = [
  { id: 'inicio', label: 'Inicio', icon: Home, roles: ['admin', 'agente', 'cliente'] },
  { id: 'polizas', label: 'Pólizas Vehiculares', icon: FileText, roles: ['admin', 'agente', 'cliente'] },
  { id: 'clientes', label: 'Propietarios', icon: Users, roles: ['admin'] },
  { id: 'cotizaciones', label: 'Cotizar Seguro', icon: Calculator, roles: ['admin', 'agente', 'cliente'] },
  { id: 'accidentes', label: 'Gestión de Accidentes', icon: Car, roles: ['admin', 'agente', 'cliente'] },
  { id: 'fraudes', label: 'Fraudes Vehiculares', icon: Shield, roles: ['admin'] },
  { id: 'reportes', label: 'Reportes', icon: BarChart3, roles: ['admin'] }
];

// Función para obtener menú filtrado por rol
export const getMenuForRole = (userRole) => {
  if (!userRole) return [];
  return allMenuItems.filter(item => item.roles.includes(userRole));
};

// Función para obtener el título de la página
export const getPageTitle = (moduleId) => {
  const menuItem = allMenuItems.find(item => item.id === moduleId);
  return menuItem ? menuItem.label : 'Sistema de Gestión de Seguros';
};