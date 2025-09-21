import React, { useState } from 'react';
import './App.css';
import {
  Plus,
  Search,
  Filter,
} from 'lucide-react';

// Componente Detección de Fraudes
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
  const [activeModule, setActiveModule] = useState('dashboard');
  
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

  // Componente Dashboard
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Ejecutivo</h1>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Calendar className="w-4 h-4" />
          <span>Última actualización: Hoy 14:30</span>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pólizas Activas</p>
              <p className="text-3xl font-bold text-blue-600">{polizas.length}</p>
              <p className="text-sm text-green-600">+12% vs mes anterior</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Reclamos Pendientes</p>
              <p className="text-3xl font-bold text-orange-600">{reclamos.filter(r => r.estado === 'En revisión').length}</p>
              <p className="text-sm text-red-600">+2 nuevos hoy</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Ingresos Mensuales</p>
              <p className="text-3xl font-bold text-green-600">$24,300</p>
              <p className="text-sm text-green-600">+8% vs mes anterior</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Clientes Registrados</p>
              <p className="text-3xl font-bold text-purple-600">{clientes.length}</p>
              <p className="text-sm text-green-600">+5 nuevos esta semana</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Gráficos y tablas resumidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Reclamos Recientes</h3>
          <div className="space-y-3">
            {reclamos.slice(0, 3).map(reclamo => (
              <div key={reclamo.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <div>
                  <p className="font-medium text-slate-800">{reclamo.numeroReclamo}</p>
                  <p className="text-sm text-slate-600">{reclamo.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">${reclamo.montoReclamado.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    reclamo.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                    reclamo.estado === 'En revisión' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {reclamo.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribución por Tipo de Seguro</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Vehícular</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-16"></div>
                </div>
                <span className="text-sm font-medium">50%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Hogar</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-10"></div>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Vida</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-6"></div>
                </div>
                <span className="text-sm font-medium">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Cotizaciones
  const Cotizaciones = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Cotizaciones Automáticas</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Calculadora de Seguros</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Seguro</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Edad del Asegurado</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Ingrese la edad"
                value={cotizacion.edad}
                onChange={(e) => setCotizacion({...cotizacion, edad: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Valor a Asegurar ($)</label>
              <input 
                type="number" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Valor del bien a asegurar"
                value={cotizacion.valorAsegurado}
                onChange={(e) => setCotizacion({...cotizacion, valorAsegurado: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Deducible ($)</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              <Calculator className="w-5 h-5 inline mr-2" />
              Calcular Cotización
            </button>
          </div>
        </div>

        {resultadoCotizacion && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Resultado de la Cotización</h2>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Prima Mensual</span>
                  <span className="text-2xl font-bold text-yellow-600">${resultadoCotizacion.primaMensual}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prima Anual</span>
                  <span className="text-lg font-semibold text-slate-800">${resultadoCotizacion.primaAnual}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor de Cobertura:</span>
                  <span className="font-medium">${parseFloat(resultadoCotizacion.cobertura).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deducible:</span>
                  <span className="font-medium">${parseFloat(resultadoCotizacion.deducible).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-slate-800 mb-2">Beneficios Incluidos:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Cobertura 24/7</li>
                  <li>• Asistencia en carretera</li>
                  <li>• Atención personalizada</li>
                  <li>• Proceso rápido de reclamos</li>
                </ul>
              </div>

              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Pólizas</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Póliza
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar pólizas..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Número de Póliza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tipo de Seguro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Prima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {polizas.map((poliza) => (
                <tr key={poliza.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{poliza.numero}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{poliza.cliente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{poliza.tipoSeguro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">${poliza.prima.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      poliza.estado === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {poliza.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {poliza.fechaVencimiento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Procesamiento de Reclamos</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Reclamo
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar reclamos..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
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
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Número de Reclamo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tipo de Incidente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Monto Reclamado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha Incidente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {reclamos.map((reclamo) => (
                <tr key={reclamo.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{reclamo.numeroReclamo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{reclamo.cliente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{reclamo.tipoIncidente}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">${reclamo.montoReclamado.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      reclamo.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                      reclamo.estado === 'En revisión' ? 'bg-yellow-100 text-yellow-800' :
                      reclamo.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {reclamo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {reclamo.fechaIncidente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Ver detalles">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Aprobar">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Rechazar">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Detección de Fraudes</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-600">Sistema ML Activo</span>
        </div>
      </div>

      {/* Alertas de Fraude */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Alto Riesgo</h3>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2">3</p>
          <p className="text-xs text-red-600">Casos detectados</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">Riesgo Medio</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-2">7</p>
          <p className="text-xs text-yellow-600">Casos en análisis</p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-sm font-medium text-green-800">Bajo Riesgo</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">142</p>
          <p className="text-xs text-green-600">Casos normales</p>
        </div>
      </div>

      {/* Lista de casos sospechosos */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Casos Sospechosos Detectados</h2>
        </div>

        <div className="divide-y divide-slate-200">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-slate-900">REC-2024-003 - Carlos Rodríguez</h3>
                <p className="text-sm text-slate-600">Múltiples reclamos en período corto</p>
                <p className="text-xs text-slate-500 mt-1">Detectado hace 2 horas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600">95% Riesgo</p>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                Investigar →
              </button>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-slate-900">REC-2024-004 - Ana Martínez</h3>
                <p className="text-sm text-slate-600">Inconsistencias en documentación</p>
                <p className="text-xs text-slate-500 mt-1">Detectado hace 5 horas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-yellow-600">67% Riesgo</p>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                Revisar →
              </button>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-slate-900">REC-2024-005 - Luis García</h3>
                <p className="text-sm text-slate-600">Patrón sospechoso de ubicaciones</p>
                <p className="text-xs text-slate-500 mt-1">Detectado hace 1 día</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600">89% Riesgo</p>
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                Investigar →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de ML */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Rendimiento del Sistema ML</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">94.2%</p>
            <p className="text-sm text-slate-600">Precisión</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">1,247</p>
            <p className="text-sm text-slate-600">Casos Analizados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">23</p>
            <p className="text-sm text-gray-600">Fraudes Detectados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">$1.2M</p>
            <p className="text-sm text-gray-600">Dinero Ahorrado</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Revisar Accidentes
  // (Eliminado por duplicidad, ver la siguiente declaración del componente RevisarAccidentes)

  // Componente Gestión de Clientes
  // (Eliminado por duplicidad, ver la siguiente declaración del componente GestionClientes)

  // Componente Revisar Accidentes
  const RevisarAccidentes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Revisar Accidentes</h1>
        <div className="flex items-center space-x-2">
          <Car className="w-5 h-5 text-slate-600" />
          <span className="text-sm text-slate-600">Módulo de Evaluación</span>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
          Todos
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
          Pendientes
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
          En Proceso
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
          Finalizados
        </button>
      </div>

      {/* Lista de accidentes */}
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                  URGENTE
                </span>
                <h3 className="text-lg font-semibold text-slate-900">ACC-2024-001</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Información del Asegurado</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-600">Cliente:</span> Juan Pérez</p>
                    <p><span className="text-slate-600">Póliza:</span> POL-2024-001</p>
                    <p><span className="text-slate-600">Vehículo:</span> Toyota Corolla 2020</p>
                    <p><span className="text-slate-600">Teléfono:</span> +503 7123-4567</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Detalles del Accidente</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-600">Fecha:</span> 15 de Agosto, 2024</p>
                    <p><span className="text-slate-600">Hora:</span> 14:30</p>
                    <p><span className="text-slate-600">Ubicación:</span> Av. Roosevelt, San Salvador</p>
                    <p><span className="text-slate-600">Tipo:</span> Colisión trasera</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-slate-700 mb-2">Descripción del Incidente</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                  "Venía por la Av. Roosevelt cuando el semáforo cambió a amarillo. El vehículo de adelante frenó bruscamente y no pude evitar la colisión. El impacto fue en la parte trasera de su vehículo. Hubo daños menores en ambos vehículos. No hubo heridos."
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-slate-700 mb-2">Monto Estimado</h4>
                <p className="text-2xl font-bold text-blue-600">$15,000</p>
              </div>
            </div>

            <div className="ml-6 flex flex-col space-y-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                Aprobar
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700">
                Investigar
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Rechazar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  APROBADO
                </span>
                <h3 className="text-lg font-semibold text-slate-900">ACC-2024-002</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Información del Asegurado</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-600">Cliente:</span> María González</p>
                    <p><span className="text-slate-600">Póliza:</span> POL-2024-002</p>
                    <p><span className="text-slate-600">Propiedad:</span> Casa residencial</p>
                    <p><span className="text-slate-600">Teléfono:</span> +503 7234-5678</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Detalles del Incidente</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-slate-600">Fecha:</span> 20 de Agosto, 2024</p>
                    <p><span className="text-slate-600">Hora:</span> 02:15</p>
                    <p><span className="text-slate-600">Ubicación:</span> Col. Escalón, Santa Ana</p>
                    <p><span className="text-slate-600">Tipo:</span> Robo con fuerza</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-slate-700 mb-2">Monto Aprobado</h4>
                <p className="text-2xl font-bold text-green-600">$8,000</p>
              </div>
            </div>

            <div className="ml-6 flex flex-col space-y-2">
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm text-center">
                ✓ Procesado
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Gestión de Clientes</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar clientes..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="">Todos los clientes</option>
              <option value="activos">Clientes activos</option>
              <option value="inactivos">Clientes inactivos</option>
              <option value="nuevos">Nuevos clientes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pólizas Activas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-slate-900">{cliente.nombre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" />
                      {cliente.email}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" />
                      {cliente.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 flex items-center">
                      <Home className="w-4 h-4 mr-2 text-slate-400" />
                      {cliente.direccion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {cliente.polizasActivas}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {cliente.fechaRegistro}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
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
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">{clientes.length}</p>
          <p className="text-sm text-slate-600">Total Clientes</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">{clientes.filter(c => c.polizasActivas > 0).length}</p>
          <p className="text-sm text-slate-600">Clientes Activos</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">5</p>
          <p className="text-sm text-slate-600">Nuevos Esta Semana</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-center">
          <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-800">$4,300</p>
          <p className="text-sm text-slate-600">Valor Promedio</p>
        </div>
      </div>
    </div>
  );

  // Navegación lateral
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: Calculator, color: 'text-green-600' },
    { id: 'polizas', label: 'Gestión de Pólizas', icon: FileText, color: 'text-purple-600' },
    { id: 'reclamos', label: 'Reclamos', icon: AlertTriangle, color: 'text-orange-600' },
    { id: 'fraudes', label: 'Detección de Fraudes', icon: Shield, color: 'text-red-600' },
    { id: 'accidentes', label: 'Revisar Accidentes', icon: Car, color: 'text-yellow-600' },
    { id: 'clientes', label: 'Gestión de Clientes', icon: Users, color: 'text-indigo-600' }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard />;
      case 'cotizaciones': return <Cotizaciones />;
      case 'polizas': return <GestionPolizas />;
      case 'reclamos': return <ProcesamientoReclamos />;
      case 'fraudes': return <DeteccionFraudes />;
      case 'accidentes': return <RevisarAccidentes />;
      case 'clientes': return <GestionClientes />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-slate-800">SecureInsure</h1>
              <p className="text-xs text-slate-500">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeModule === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeModule === item.id ? 'text-blue-600' : item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SistemaGestionSeguros;