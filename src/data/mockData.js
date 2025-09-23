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
  { id: 'clientes', label: 'Propietarios', icon: Users, roles: ['admin'] }, // Solo admin
  { id: 'cotizaciones', label: 'Cotizar Seguro', icon: Calculator, roles: ['admin', 'agente', 'cliente'] },
  { id: 'accidentes', label: 'Gestión de Accidentes', icon: Car, roles: ['admin', 'agente', 'cliente'] },
  { id: 'fraudes', label: 'Fraudes Vehiculares', icon: Shield, roles: ['admin'] }, // Solo admin
  { id: 'reportes', label: 'Reportes', icon: BarChart3, roles: ['admin'] } // Solo admin
];

// Función para obtener menú filtrado por rol
export const getMenuForRole = (userRole) => {
  if (!userRole) return [];
  return allMenuItems.filter(item => item.roles.includes(userRole));
};

// Menú de navegación (mantener compatibilidad)
export const menuItems = allMenuItems;

// Datos mock de pólizas vehiculares
export const mockPolizas = [
  {
    numeroPoliza: 'VEH-001',
    titular: 'Juan Pérez',
    tipoSeguro: 'Seguro Completo',
    vehiculo: 'Toyota Corolla 2020',
    placa: 'ABC-123',
    prima: 450,
    vencimiento: '2025-12-15',
    estado: 'Activa',
    telefono: '+1234567890',
    cobertura: 'Todo Riesgo',
    deducible: 50000
  },
  {
    numeroPoliza: 'VEH-002',
    titular: 'María González',
    tipoSeguro: 'Responsabilidad Civil',
    vehiculo: 'Honda Civic 2019',
    placa: 'XYZ-789',
    prima: 280,
    vencimiento: '2025-11-30',
    estado: 'Activa',
    telefono: '+1234567891',
    cobertura: 'Daños a Terceros',
    deducible: 30000
  },
  {
    numeroPoliza: 'VEH-003',
    titular: 'Carlos Ruiz',
    tipoSeguro: 'Seguro Básico',
    vehiculo: 'Nissan Sentra 2018',
    placa: 'DEF-456',
    prima: 320,
    vencimiento: '2025-10-22',
    estado: 'Pendiente',
    telefono: '+1234567892',
    cobertura: 'Robo y Daños Parciales',
    deducible: 40000
  },
  {
    numeroPoliza: 'VEH-004',
    titular: 'Ana López',
    tipoSeguro: 'Todo Riesgo Premium',
    vehiculo: 'Mazda CX-5 2021',
    placa: 'GHI-789',
    prima: 680,
    vencimiento: '2025-09-15',
    estado: 'Vencida',
    telefono: '+1234567893',
    cobertura: 'Cobertura Amplia + Asistencia',
    deducible: 75000
  },
  {
    numeroPoliza: 'VEH-005',
    titular: 'Roberto Silva',
    tipoSeguro: 'Seguro Completo',
    vehiculo: 'Chevrolet Spark 2020',
    placa: 'JKL-012',
    prima: 380,
    vencimiento: '2026-01-10',
    estado: 'Activa',
    telefono: '+1234567894',
    cobertura: 'Todo Riesgo',
    deducible: 45000
  }
];

// Datos mock de reclamos vehiculares
export const mockReclamos = [
  {
    numeroReclamo: 'REC-001',
    poliza: 'VEH-001',
    titular: 'Juan Pérez',
    vehiculo: 'Toyota Corolla 2020',
    placa: 'ABC-123',
    tipoReclamo: 'Colisión frontal',
    fechaIncidente: '2024-08-15',
    ubicacion: 'Av. Principal con Calle 5',
    montoReclamado: 85000,
    estado: 'En revisión',
    descripcion: 'Colisión frontal con otro vehículo, daños en parachoques y faro delantero'
  },
  {
    numeroReclamo: 'REC-002',
    poliza: 'VEH-002',
    titular: 'María González',
    vehiculo: 'Honda Civic 2019',
    placa: 'XYZ-789',
    tipoReclamo: 'Robo total',
    fechaIncidente: '2024-08-20',
    ubicacion: 'Centro Comercial Plaza Norte',
    montoReclamado: 320000,
    estado: 'Aprobado',
    descripcion: 'Vehículo sustraído del estacionamiento del centro comercial'
  },
  {
    numeroReclamo: 'REC-003',
    poliza: 'VEH-003',
    titular: 'Carlos Ruiz',
    vehiculo: 'Nissan Sentra 2018',
    placa: 'DEF-456',
    tipoReclamo: 'Daños por granizo',
    fechaIncidente: '2024-09-01',
    ubicacion: 'Zona Residencial Sur',
    montoReclamado: 45000,
    estado: 'Documentos pendientes',
    descripcion: 'Daños en carrocería y cristales por tormenta de granizo'
  },
  {
    numeroReclamo: 'REC-004',
    poliza: 'VEH-005',
    titular: 'Roberto Silva',
    vehiculo: 'Chevrolet Spark 2020',
    placa: 'JKL-012',
    tipoReclamo: 'Vandalismo',
    fechaIncidente: '2024-09-10',
    ubicacion: 'Calle Comercial 456',
    montoReclamado: 25000,
    estado: 'Rechazado',
    descripcion: 'Rayones en pintura y daños en espejos retrovisores'
  }
];

// Datos mock de propietarios de vehículos
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
    fechaRegistro: '2023-01-15',
    licenciaConducir: 'LIC123456789',
    experienciaConduciendo: '15 años',
    vehiculos: ['Toyota Corolla 2020']
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
    fechaRegistro: '2023-02-20',
    licenciaConducir: 'LIC987654321',
    experienciaConduciendo: '8 años',
    vehiculos: ['Honda Civic 2019']
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
    fechaRegistro: '2023-03-10',
    licenciaConducir: 'LIC456789123',
    experienciaConduciendo: '22 años',
    vehiculos: ['Nissan Sentra 2018']
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
    fechaRegistro: '2023-04-05',
    licenciaConducir: 'LIC789123456',
    experienciaConduciendo: '5 años',
    vehiculos: ['Mazda CX-5 2021']
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
    fechaRegistro: '2023-05-12',
    licenciaConducir: 'LIC321654987',
    experienciaConduciendo: '12 años',
    vehiculos: ['Chevrolet Spark 2020']
  }
];

// Función para obtener el título de la página
export const getPageTitle = (activeModule) => {
  const titles = {
    inicio: 'Inicio',
    polizas: 'Pólizas Vehiculares',
    clientes: 'Propietarios de Vehículos',
    cotizaciones: 'Cotizar Seguro Vehicular',
    accidentes: 'Gestión de Accidentes',
    fraudes: 'Fraudes Vehiculares',
    reportes: 'Reportes Vehiculares'
  };
  return titles[activeModule] || 'Sistema de Seguros Vehiculares';
};