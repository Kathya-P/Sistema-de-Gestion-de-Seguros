import React, { useState } from 'react';
import './App.css';
import { 
  Shield, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Car, 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const SistemaGestionSeguros = () => {
  // Estados para navegación
  const [activeModule, setActiveModule] = useState('inicio');
  
  // Estados para datos
  const [polizas, setPolizas] = useState([
    {
      id: 1,
      numero: 'POL-2024-001',
      cliente: 'Juan Pérez',
      tipoSeguro: 'Vehícular',
      prima: 2500,
      estado: 'Activa',
      fechaInicio: '2024-01-15',
      fechaVencimiento: '2025-01-15',
      vehiculo: 'Toyota Corolla 2020'
    },
    {
      id: 2,
      numero: 'POL-2024-002',
      cliente: 'María González',
      tipoSeguro: 'Hogar',
      prima: 1800,
      estado: 'Activa',
      fechaInicio: '2024-02-01',
      fechaVencimiento: '2025-02-01',
      propiedad: 'Casa residencial'
    }
  ]);

  const [reclamos, setReclamos] = useState([
    {
      id: 1,
      numeroReclamo: 'REC-2024-001',
      polizaNumero: 'POL-2024-001',
      cliente: 'Juan Pérez',
      tipoIncidente: 'Accidente vehicular',
      montoReclamado: 15000,
      estado: 'En revisión',
      fechaIncidente: '2024-08-15',
      descripcion: 'Colisión trasera en intersección'
    },
    {
      id: 2,
      numeroReclamo: 'REC-2024-002',
      polizaNumero: 'POL-2024-002',
      cliente: 'María González',
      tipoIncidente: 'Robo',
      montoReclamado: 8000,
      estado: 'Aprobado',
      fechaIncidente: '2024-08-20',
      descripcion: 'Robo de electrodomésticos'
    }
  ]);

  const [clientes, setClientes] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '+503 7123-4567',
      direccion: 'San Salvador, El Salvador',
      fechaRegistro: '2024-01-10',
      polizasActivas: 1
    },
    {
      id: 2,
      nombre: 'María González',
      email: 'maria.gonzalez@email.com',
      telefono: '+503 7234-5678',
      direccion: 'Santa Ana, El Salvador',
      fechaRegistro: '2024-01-25',
      polizasActivas: 1
    }
  ]);

  // Estado para cotizaciones
  const [cotizacion, setCotizacion] = useState({
    tipoSeguro: '',
    edad: '',
    valorAsegurado: '',
    deducible: ''
  });

  const [resultadoCotizacion, setResultadoCotizacion] = useState(null);

  // Función para calcular cotización
  const calcularCotizacion = () => {
    const { tipoSeguro, edad, valorAsegurado, deducible } = cotizacion;
    
    if (!tipoSeguro || !edad || !valorAsegurado || !deducible) {
      alert('Por favor complete todos los campos');
      return;
    }

    let factorBase = 0.05; // 5% base
    
    // Ajustes por tipo de seguro
    switch (tipoSeguro) {
      case 'vehicular':
        factorBase = 0.06;
        break;
      case 'hogar':
        factorBase = 0.04;
        break;
      case 'vida':
        factorBase = 0.03;
        break;
      default:
        factorBase = 0.05;
    }

    // Ajustes por edad
    const edadNum = parseInt(edad);
    if (edadNum > 60) factorBase += 0.02;
    if (edadNum < 25) factorBase += 0.015;

    // Ajustes por deducible
    const deducibleNum = parseFloat(deducible);
    if (deducibleNum < 500) factorBase += 0.01;
    if (deducibleNum > 2000) factorBase -= 0.005;

    const valorNum = parseFloat(valorAsegurado);
    const primaAnual = valorNum * factorBase;
    const primaMensual = primaAnual / 12;

    setResultadoCotizacion({
      primaAnual: primaAnual.toFixed(2),
      primaMensual: primaMensual.toFixed(2),
      cobertura: valorNum.toFixed(2),
      deducible: deducibleNum.toFixed(2)
    });
  };

  // Componente Inicio - Página de bienvenida
  const Inicio = () => (
    <div className="space-y-5">
      {/* Header con más información */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Shield className="w-12 h-12 mr-3" style={{color: '#1e3a72'}} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SecureTech Solutions</h1>
              <p className="text-sm text-gray-600">Sistema de Gestión de Seguros</p>
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-2">¡Bienvenido de vuelta!</p>
          <p className="text-sm text-gray-600">Gestiona todo tu negocio de seguros desde una sola plataforma</p>
        </div>
      </div>

      {/* Resumen y módulos alineados */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Estadísticas destacadas */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="flex items-center mb-3 h-8">
            <h3 className="text-lg font-semibold text-gray-900">Resumen del día</h3>
          </div>
          <div className="space-y-3 flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>{polizas.length}</p>
                  <p className="text-sm text-gray-600">Pólizas Activas</p>
                </div>
                <Shield className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.3}} />
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#b7541a'}}>{reclamos.filter(r => r.estado === 'En revisión').length}</p>
                  <p className="text-sm text-gray-600">Reclamos Pendientes</p>
                </div>
                <AlertTriangle className="w-8 h-8" style={{color: '#b7541a', opacity: 0.3}} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#2d5016'}}>{clientes.length}</p>
                  <p className="text-sm text-gray-600">Clientes Activos</p>
                </div>
                <Users className="w-8 h-8" style={{color: '#2d5016', opacity: 0.3}} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-20 flex items-center">
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-2xl font-bold" style={{color: '#1e3a72'}}>$24,500</p>
                  <p className="text-sm text-gray-600">Ingresos del mes</p>
                </div>
                <DollarSign className="w-8 h-8" style={{color: '#1e3a72', opacity: 0.3}} />
              </div>
            </div>
          </div>
        </div>

        {/* Módulos principales */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="flex items-center mb-3 h-8">
            <h3 className="text-lg font-semibold text-gray-900">Módulos del sistema</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            <div 
              onClick={() => setActiveModule('cotizaciones')}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                  <Calculator className="w-6 h-6" style={{color: '#1e3a72'}} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Cotizaciones</h3>
                <p className="text-gray-600 text-xs">Genera cotizaciones personalizadas</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveModule('polizas')}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#e6eef7'}}>
                  <FileText className="w-6 h-6" style={{color: '#1e3a72'}} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Pólizas</h3>
                <p className="text-gray-600 text-xs">Gestiona pólizas activas</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveModule('reclamos')}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#fef3e8'}}>
                  <AlertTriangle className="w-6 h-6" style={{color: '#b7541a'}} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Reclamos</h3>
                <p className="text-gray-600 text-xs">Procesa reclamos</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveModule('fraudes')}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#f0f7ff'}}>
                  <Shield className="w-6 h-6" style={{color: '#1e3a72'}} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Fraudes</h3>
                <p className="text-gray-600 text-xs">Detección inteligente</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveModule('accidentes')}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#fef3e8'}}>
                  <Car className="w-6 h-6" style={{color: '#b7541a'}} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Accidentes</h3>
                <p className="text-gray-600 text-xs">Revisar accidentes</p>
              </div>
            </div>

            <div 
              onClick={() => setActiveModule('clientes')}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col justify-center min-h-[120px]"
            >
              <div className="text-center">
                <div className="p-3 rounded-lg mb-3 mx-auto w-fit" style={{backgroundColor: '#f0fdf4'}}>
                  <Users className="w-6 h-6" style={{color: '#2d5016'}} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Clientes</h3>
                <p className="text-gray-600 text-xs">Gestiona clientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente y acciones rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Actividad reciente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" style={{color: '#1e3a72'}} />
            Actividad reciente
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#2d5016'}}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Nueva póliza creada</p>
                  <p className="text-xs text-gray-500">Juan Pérez - Seguro vehicular</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">Hace 2h</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#b7541a'}}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Reclamo procesado</p>
                  <p className="text-xs text-gray-500">María González - Aprobado</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">Hace 4h</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: '#1e3a72'}}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Cotización generada</p>
                  <p className="text-xs text-gray-500">Carlos Ruiz - Seguro de hogar</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">Hace 6h</span>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" style={{color: '#1e3a72'}} />
            Acciones rápidas
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveModule('cotizaciones')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center">
                <Calculator className="w-5 h-5 mr-3" style={{color: '#1e3a72'}} />
                <span className="text-sm font-medium text-gray-900">Nueva cotización</span>
              </div>
              <span className="text-xs text-gray-500">→</span>
            </button>

            <button 
              onClick={() => setActiveModule('polizas')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3" style={{color: '#1e3a72'}} />
                <span className="text-sm font-medium text-gray-900">Crear póliza</span>
              </div>
              <span className="text-xs text-gray-500">→</span>
            </button>

            <button 
              onClick={() => setActiveModule('clientes')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" style={{color: '#2d5016'}} />
                <span className="text-sm font-medium text-gray-900">Registrar cliente</span>
              </div>
              <span className="text-xs text-gray-500">→</span>
            </button>

            <button 
              onClick={() => setActiveModule('reclamos')}
              className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
            >
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3" style={{color: '#b7541a'}} />
                <span className="text-sm font-medium text-gray-900">Procesar reclamo</span>
              </div>
              <span className="text-xs text-gray-500">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer con tips o información adicional */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: '#2d5016'}}></div>
            <span className="text-sm text-gray-600">
              💡 <strong>Tip del día:</strong> Revisa los reclamos pendientes para mantener la satisfacción del cliente alta
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Septiembre 21, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Dashboard anterior (mantenido por compatibilidad)
  const Dashboard = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
          <Calendar className="w-4 h-4" />
          <span>Última actualización: Hoy 14:30</span>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Pólizas Activas</p>
              <p className="text-3xl font-bold" style={{color: '#0f2954'}}>{polizas.length}</p>
              <p className="text-sm text-gray-500">+12% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: '#e6eef7'}}>
              <Shield className="w-6 h-6" style={{color: '#0f2954'}} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Reclamos Pendientes</p>
              <p className="text-3xl font-bold" style={{color: '#b7541a'}}>{reclamos.filter(r => r.estado === 'En revisión').length}</p>
              <p className="text-sm text-gray-500">+2 nuevos hoy</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: '#fef3e8'}}>
              <AlertTriangle className="w-6 h-6" style={{color: '#b7541a'}} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
              <p className="text-3xl font-bold" style={{color: '#0f2954'}}>$24,300</p>
              <p className="text-sm text-gray-500">+8% vs mes anterior</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: '#e6eef7'}}>
              <DollarSign className="w-6 h-6" style={{color: '#0f2954'}} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Registrados</p>
              <p className="text-3xl font-bold text-gray-700">{clientes.length}</p>
              <p className="text-sm text-gray-500">+5 nuevos esta semana</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secciones inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Reclamos Recientes</h3>
          <div className="space-y-4">
            {reclamos.slice(0, 3).map(reclamo => (
              <div key={reclamo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{reclamo.numeroReclamo}</p>
                  <p className="text-sm text-gray-600">{reclamo.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${reclamo.montoReclamado.toLocaleString()}</p>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                    reclamo.estado === 'Aprobado' ? 'text-white' : 
                    reclamo.estado === 'En revisión' ? 'text-white' :
                    'bg-gray-100 text-gray-700'
                  }`} style={{
                    backgroundColor: reclamo.estado === 'Aprobado' ? '#0f2954' : 
                                   reclamo.estado === 'En revisión' ? '#b7541a' : '#f1f3f4'
                  }}>
                    {reclamo.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución por Tipo de Seguro</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Vehícular</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: '50%', backgroundColor: '#0f2954'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-10 text-right">50%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Hogar</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{width: '30%', backgroundColor: '#b7541a'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-10 text-right">30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Vida</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{width: '20%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-10 text-right">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Cotizaciones
  const Cotizaciones = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Cotizaciones Automáticas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Calculadora de Seguros</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Seguro</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={cotizacion.tipoSeguro}
                onChange={(e) => setCotizacion({...cotizacion, tipoSeguro: e.target.value})}
              >
                <option value="">Seleccione un tipo</option>
                <option value="vehicular">Seguro Vehícular</option>
                <option value="hogar">Seguro de Hogar</option>
                <option value="vida">Seguro de Vida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Edad del Asegurado</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingrese la edad"
                value={cotizacion.edad}
                onChange={(e) => setCotizacion({...cotizacion, edad: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor a Asegurar ($)</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Valor del bien a asegurar"
                value={cotizacion.valorAsegurado}
                onChange={(e) => setCotizacion({...cotizacion, valorAsegurado: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deducible ($)</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={cotizacion.deducible}
                onChange={(e) => setCotizacion({...cotizacion, deducible: e.target.value})}
              >
                <option value="">Seleccione deducible</option>
                <option value="250">$250</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="2000">$2,000</option>
                <option value="5000">$5,000</option>
              </select>
            </div>

            <button 
              onClick={calcularCotizacion}
              className="w-full text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center"
              style={{backgroundColor: '#0f2954'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0a1f42'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#0f2954'}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calcular Cotización
            </button>
          </div>
        </div>

        {resultadoCotizacion && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultado de la Cotización</h2>
            
            <div className="space-y-6">
              <div className="p-6 rounded-lg text-white" style={{background: 'linear-gradient(to right, #0f2954, #0a1f42)'}}>
                <div className="text-center">
                  <p className="text-gray-200 text-sm mb-1">Prima Mensual</p>
                  <p className="text-3xl font-bold">${resultadoCotizacion.primaMensual}</p>
                  <p className="text-gray-200 text-sm mt-2">Prima Anual: ${resultadoCotizacion.primaAnual}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Valor de Cobertura:</span>
                  <span className="font-medium text-gray-900">${parseFloat(resultadoCotizacion.cobertura).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Deducible:</span>
                  <span className="font-medium text-gray-900">${parseFloat(resultadoCotizacion.deducible).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Beneficios Incluidos:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Cobertura 24/7</li>
                  <li>• Asistencia en carretera</li>
                  <li>• Atención personalizada</li>
                  <li>• Proceso rápido de reclamos</li>
                </ul>
              </div>

              <button 
                className="w-full text-white py-3 px-4 rounded-lg transition-colors font-medium"
                style={{backgroundColor: '#b7541a'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#a04a17'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#b7541a'}
              >
                Contratar Póliza
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Componente Gestión de Pólizas
  const GestionPolizas = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pólizas</h1>
        <button 
          className="text-white px-6 py-3 rounded-lg transition-colors flex items-center font-medium"
          style={{backgroundColor: '#0f2954'}}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0a1f42'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#0f2954'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Póliza
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar pólizas..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Póliza
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Seguro
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prima
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {polizas.map((poliza) => (
                <tr key={poliza.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{poliza.numero}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{poliza.cliente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{poliza.tipoSeguro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${poliza.prima.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white"
                      style={{backgroundColor: '#1e3a72'}}
                    >
                      {poliza.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {poliza.fechaVencimiento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1"
                        style={{color: '#1e3a72'}}
                        onMouseOver={(e) => e.target.style.color = '#1a3366'}
                        onMouseOut={(e) => e.target.style.color = '#1e3a72'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Componente Procesamiento de Reclamos
  const ProcesamientoReclamos = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Procesamiento de Reclamos</h1>
        <button 
          className="text-white px-6 py-3 rounded-lg transition-colors flex items-center font-medium"
          style={{backgroundColor: '#b7541a'}}
          onMouseOver={(e) => e.target.style.backgroundColor = '#a04a17'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#b7541a'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Reclamo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar reclamos..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg transition-colors"
                style={{
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#b7541a',
                    boxShadow: '0 0 0 3px rgba(183, 84, 26, 0.1)'
                  }
                }}
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="revision">En revisión</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de Reclamo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Incidente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto Reclamado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Incidente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reclamos.map((reclamo) => (
                <tr key={reclamo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reclamo.numeroReclamo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reclamo.cliente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reclamo.tipoIncidente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${reclamo.montoReclamado.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      reclamo.estado === 'Aprobado' ? 'bg-blue-100 text-blue-700' :
                      reclamo.estado === 'En revisión' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {reclamo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reclamo.fechaIncidente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Componente Detección de Fraudes
  const DeteccionFraudes = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Detección de Fraudes</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{backgroundColor: '#1e3a72'}}></div>
          <span className="text-sm text-gray-600 font-medium">Sistema ML Activo</span>
        </div>
      </div>

      {/* Alertas de Fraude */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 mr-3" style={{color: '#b7541a'}} />
            <h3 className="text-sm font-medium text-gray-700">Alto Riesgo</h3>
          </div>
          <p className="text-3xl font-bold mb-2" style={{color: '#b7541a'}}>3</p>
          <p className="text-xs text-gray-600">Casos detectados</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 mr-3" style={{color: '#1e3a72'}} />
            <h3 className="text-sm font-medium text-gray-700">Riesgo Medio</h3>
          </div>
          <p className="text-3xl font-bold mb-2" style={{color: '#1e3a72'}}>7</p>
          <p className="text-xs text-gray-600">Casos en análisis</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-5 h-5 text-gray-600 mr-3" />
            <h3 className="text-sm font-medium text-gray-700">Bajo Riesgo</h3>
          </div>
          <p className="text-3xl font-bold text-gray-600 mb-2">142</p>
          <p className="text-xs text-gray-600">Casos normales</p>
        </div>
      </div>

      {/* Lista de casos sospechosos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Casos Sospechosos Detectados</h2>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900">REC-2024-003 - Carlos Rodríguez</h3>
                <p className="text-sm text-gray-600">Múltiples reclamos en período corto</p>
                <p className="text-xs text-gray-500 mt-1">Detectado hace 2 horas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-yellow-600">95% Riesgo</p>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium mt-1">
                Investigar →
              </button>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900">REC-2024-004 - Ana Martínez</h3>
                <p className="text-sm text-gray-600">Inconsistencias en documentación</p>
                <p className="text-xs text-gray-500 mt-1">Detectado hace 5 horas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">67% Riesgo</p>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium mt-1">
                Revisar →
              </button>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900">REC-2024-005 - Luis García</h3>
                <p className="text-sm text-gray-600">Patrón sospechoso de ubicaciones</p>
                <p className="text-xs text-gray-500 mt-1">Detectado hace 1 día</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-yellow-600">89% Riesgo</p>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium mt-1">
                Investigar →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de ML */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Rendimiento del Sistema ML</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">94.2%</p>
            <p className="text-sm text-gray-600">Precisión</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-600">1,247</p>
            <p className="text-sm text-gray-600">Casos Analizados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">23</p>
            <p className="text-sm text-gray-600">Fraudes Detectados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600">$1.2M</p>
            <p className="text-sm text-gray-600">Dinero Ahorrado</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Revisar Accidentes
  const RevisarAccidentes = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Revisar Accidentes</h1>
        <div className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600 font-medium">Módulo de Evaluación</span>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          Todos
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
          Pendientes
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
          En Proceso
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
          Finalizados
        </button>
      </div>

      {/* Lista de accidentes */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                  URGENTE
                </span>
                <h3 className="text-lg font-semibold text-gray-900">ACC-2024-001</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información del Asegurado</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Cliente:</span> <span className="font-medium">Juan Pérez</span></p>
                    <p><span className="text-gray-600">Póliza:</span> <span className="font-medium">POL-2024-001</span></p>
                    <p><span className="text-gray-600">Vehículo:</span> <span className="font-medium">Toyota Corolla 2020</span></p>
                    <p><span className="text-gray-600">Teléfono:</span> <span className="font-medium">+503 7123-4567</span></p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Detalles del Accidente</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Fecha:</span> <span className="font-medium">15 de Agosto, 2024</span></p>
                    <p><span className="text-gray-600">Hora:</span> <span className="font-medium">14:30</span></p>
                    <p><span className="text-gray-600">Ubicación:</span> <span className="font-medium">Av. Roosevelt, San Salvador</span></p>
                    <p><span className="text-gray-600">Tipo:</span> <span className="font-medium">Colisión trasera</span></p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Descripción del Incidente</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  "Venía por la Av. Roosevelt cuando el semáforo cambió a amarillo. El vehículo de adelante frenó bruscamente y no pude evitar la colisión. El impacto fue en la parte trasera de su vehículo. Hubo daños menores en ambos vehículos. No hubo heridos."
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Monto Estimado</h4>
                <p className="text-2xl font-bold text-blue-600">$15,000</p>
              </div>
            </div>

            <div className="ml-6 flex flex-col space-y-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 font-medium">
                Aprobar
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 font-medium">
                Investigar
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 font-medium">
                Rechazar
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 font-medium">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  APROBADO
                </span>
                <h3 className="text-lg font-semibold text-gray-900">ACC-2024-002</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información del Asegurado</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Cliente:</span> <span className="font-medium">María González</span></p>
                    <p><span className="text-gray-600">Póliza:</span> <span className="font-medium">POL-2024-002</span></p>
                    <p><span className="text-gray-600">Propiedad:</span> <span className="font-medium">Casa residencial</span></p>
                    <p><span className="text-gray-600">Teléfono:</span> <span className="font-medium">+503 7234-5678</span></p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Detalles del Incidente</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Fecha:</span> <span className="font-medium">20 de Agosto, 2024</span></p>
                    <p><span className="text-gray-600">Hora:</span> <span className="font-medium">02:15</span></p>
                    <p><span className="text-gray-600">Ubicación:</span> <span className="font-medium">Col. Escalón, Santa Ana</span></p>
                    <p><span className="text-gray-600">Tipo:</span> <span className="font-medium">Robo con fuerza</span></p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Monto Aprobado</h4>
                <p className="text-2xl font-bold text-blue-600">$8,000</p>
              </div>
            </div>

            <div className="ml-6 flex flex-col space-y-3">
              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm text-center font-medium">
                ✓ Procesado
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 font-medium">
                Ver Historial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Gestión de Clientes
  const GestionClientes = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <button className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar clientes..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos los clientes</option>
              <option value="activos">Clientes activos</option>
              <option value="inactivos">Clientes inactivos</option>
              <option value="nuevos">Nuevos clientes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pólizas Activas
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{cliente.nombre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {cliente.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {cliente.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Home className="w-4 h-4 mr-2 text-gray-400" />
                      {cliente.direccion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {cliente.polizasActivas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.fechaRegistro}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <Users className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
          <p className="text-sm text-gray-600">Total Clientes</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{clientes.filter(c => c.polizasActivas > 0).length}</p>
          <p className="text-sm text-gray-600">Clientes Activos</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-600">Nuevos Esta Semana</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">$4,300</p>
          <p className="text-sm text-gray-600">Valor Promedio</p>
        </div>
      </div>
    </div>
  );

  // Navegación lateral
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: Calculator },
    { id: 'polizas', label: 'Gestión de Pólizas', icon: FileText },
    { id: 'reclamos', label: 'Reclamos', icon: AlertTriangle },
    { id: 'fraudes', label: 'Detección de Fraudes', icon: Shield },
    { id: 'accidentes', label: 'Revisar Accidentes', icon: Car },
    { id: 'clientes', label: 'Gestión de Clientes', icon: Users }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'inicio': return <Inicio />;
      case 'cotizaciones': return <Cotizaciones />;
      case 'polizas': return <GestionPolizas />;
      case 'reclamos': return <ProcesamientoReclamos />;
      case 'fraudes': return <DeteccionFraudes />;
      case 'accidentes': return <RevisarAccidentes />;
      case 'clientes': return <GestionClientes />;
      default: return <Inicio />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar izquierdo */}
      <div className="sidebar">
        <div className="logo">
          {/* Área para logo del usuario */}
          <div className="user-logo">
            <Shield className="w-6 h-6" style={{color: '#1e3a72'}} />
          </div>
          <div>
            <h1>SecureTech Solutions</h1>
          </div>
        </div>

        <nav className="nav-menu">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={`nav-button ${activeModule === item.id ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Sept 21, 2025</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SistemaGestionSeguros;