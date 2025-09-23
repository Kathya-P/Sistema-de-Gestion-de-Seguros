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

// Menú de navegación completo
export const allMenuItems = [
  { id: 'inicio', label: 'Inicio', icon: Home, roles: ['admin', 'agente', 'cliente'] },
  { id: 'polizas', label: 'Pólizas', icon: FileText, roles: ['admin', 'agente', 'cliente'] },
  { id: 'clientes', label: 'Clientes', icon: Users, roles: ['admin', 'agente'] }, // Solo admin y agente
  { id: 'cotizaciones', label: 'Cotizaciones', icon: Calculator, roles: ['admin', 'agente', 'cliente'] },
  { id: 'reclamos', label: 'Reclamos', icon: AlertTriangle, roles: ['admin', 'agente', 'cliente'] },
  { id: 'fraudes', label: 'Fraudes', icon: Shield, roles: ['admin', 'agente'] }, // Solo admin y agente
  { id: 'accidentes', label: 'Accidentes', icon: Car, roles: ['admin', 'agente', 'cliente'] },
  { id: 'reportes', label: 'Reportes', icon: BarChart3, roles: ['admin', 'agente'] } // Solo admin y agente
];

// Función para obtener menú filtrado por rol
export const getMenuForRole = (userRole) => {
  if (!userRole) return [];
  return allMenuItems.filter(item => item.roles.includes(userRole));
};

// Menú de navegación (mantener compatibilidad)
export const menuItems = allMenuItems;

// Datos mock de pólizas
export const mockPolizas = [
  {
    numeroPoliza: 'POL-001',
    titular: 'Juan Pérez',
    tipoSeguro: 'Vehicular',
    prima: 450,
    vencimiento: '2025-12-15',
    estado: 'Activa',
    telefono: '+1234567890'
  },
  {
    numeroPoliza: 'POL-002',
    titular: 'María González',
    tipoSeguro: 'Hogar',
    prima: 280,
    vencimiento: '2025-11-30',
    estado: 'Activa',
    telefono: '+1234567891'
  },
  {
    numeroPoliza: 'POL-003',
    titular: 'Carlos Ruiz',
    tipoSeguro: 'Vida',
    prima: 650,
    vencimiento: '2025-10-22',
    estado: 'Pendiente',
    telefono: '+1234567892'
  },
  {
    numeroPoliza: 'POL-004',
    titular: 'Ana López',
    tipoSeguro: 'Salud',
    prima: 380,
    vencimiento: '2025-09-15',
    estado: 'Vencida',
    telefono: '+1234567893'
  },
  {
    numeroPoliza: 'POL-005',
    titular: 'Roberto Silva',
    tipoSeguro: 'Vehicular',
    prima: 520,
    vencimiento: '2026-01-10',
    estado: 'Activa',
    telefono: '+1234567894'
  }
];

// Datos mock de reclamos
export const mockReclamos = [
  {
    numeroReclamo: 'REC-001',
    poliza: 'POL-001',
    titular: 'Juan Pérez',
    tipoReclamo: 'Daño vehicular',
    fechaIncidente: '2024-08-15',
    montoReclamado: 5500,
    estado: 'En revisión',
    descripcion: 'Accidente de tráfico con daños en el parachoques delantero'
  },
  {
    numeroReclamo: 'REC-002',
    poliza: 'POL-002',
    titular: 'María González',
    tipoReclamo: 'Robo en hogar',
    fechaIncidente: '2024-08-20',
    montoReclamado: 3200,
    estado: 'Aprobado',
    descripcion: 'Robo de electrodomésticos durante ausencia'
  },
  {
    numeroReclamo: 'REC-003',
    poliza: 'POL-003',
    titular: 'Carlos Ruiz',
    tipoReclamo: 'Gastos médicos',
    fechaIncidente: '2024-09-01',
    montoReclamado: 1800,
    estado: 'Documentos pendientes',
    descripcion: 'Hospitalización por emergencia médica'
  },
  {
    numeroReclamo: 'REC-004',
    poliza: 'POL-005',
    titular: 'Roberto Silva',
    tipoReclamo: 'Vandalismo',
    fechaIncidente: '2024-09-10',
    montoReclamado: 2100,
    estado: 'Rechazado',
    descripcion: 'Daños por vandalismo en vehículo estacionado'
  }
];

// Datos mock de clientes
export const mockClientes = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+1234567890',
    direccion: 'Calle Principal 123',
    fechaNacimiento: '1985-03-15',
    tipoDocumento: 'Cédula',
    numeroDocumento: '12345678',
    polizasActivas: 1,
    fechaRegistro: '2023-01-15'
  },
  {
    id: 2,
    nombre: 'María González',
    email: 'maria.gonzalez@email.com',
    telefono: '+1234567891',
    direccion: 'Avenida Central 456',
    fechaNacimiento: '1990-07-22',
    tipoDocumento: 'Cédula',
    numeroDocumento: '87654321',
    polizasActivas: 1,
    fechaRegistro: '2023-02-20'
  },
  {
    id: 3,
    nombre: 'Carlos Ruiz',
    email: 'carlos.ruiz@email.com',
    telefono: '+1234567892',
    direccion: 'Boulevard Norte 789',
    fechaNacimiento: '1978-11-08',
    tipoDocumento: 'Pasaporte',
    numeroDocumento: 'P12345678',
    polizasActivas: 1,
    fechaRegistro: '2023-03-10'
  },
  {
    id: 4,
    nombre: 'Ana López',
    email: 'ana.lopez@email.com',
    telefono: '+1234567893',
    direccion: 'Calle Sur 321',
    fechaNacimiento: '1992-12-03',
    tipoDocumento: 'Cédula',
    numeroDocumento: '11223344',
    polizasActivas: 1,
    fechaRegistro: '2023-04-05'
  },
  {
    id: 5,
    nombre: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    telefono: '+1234567894',
    direccion: 'Plaza Mayor 654',
    fechaNacimiento: '1988-05-17',
    tipoDocumento: 'Cédula',
    numeroDocumento: '55667788',
    polizasActivas: 1,
    fechaRegistro: '2023-05-12'
  }
];

// Función para obtener el título de la página
export const getPageTitle = (activeModule) => {
  const titles = {
    inicio: 'Inicio',
    polizas: 'Gestión de Pólizas',
    clientes: 'Gestión de Clientes',
    cotizaciones: 'Cotizaciones',
    reclamos: 'Gestión de Reclamos',
    fraudes: 'Detección de Fraudes',
    accidentes: 'Revisión de Accidentes',
    reportes: 'Reportes y Análisis'
  };
  return titles[activeModule] || 'Sistema de Gestión de Seguros';
};