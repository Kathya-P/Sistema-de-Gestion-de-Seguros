import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  FileText, 
  Search, 
  Plus,
  Eye,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Car,
  User,
  Phone,
  Mail
} from 'lucide-react';

const Cotizaciones = ({ resultadoCotizacion, handleCalcular, permissions }) => {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [cotizaciones, setCotizaciones] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  
  // Obtener usuario actual
  const currentUser = permissions?.currentUser || JSON.parse(localStorage.getItem('seguros_session_data') || '{}').user;

  // Cargar cotizaciones del localStorage
  useEffect(() => {
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    setCotizaciones(cotizacionesGuardadas);
  }, [activeTab]);

  const [formData, setFormData] = useState({
    tipoSeguro: 'todo-riesgo',
    marca: '',
    modelo: '',
    año: '',
    placa: '',
    valorVehiculo: '',
    deducible: '750',
    edad: '',
    historialSiniestros: 'sin-siniestros',
    añosLicencia: '',
    nombreCompleto: '',
    telefono: '',
    email: '',
    // Campos para cálculo más preciso (sin ubicación)
    usoPrincipal: 'personal',
    kilometrosAnuales: 'menos-10000',
    lugarEstacionamiento: 'garaje-privado'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calcularPrima = (datos) => {
    let prima = parseInt(datos.valorVehiculo) * 0.015; // Base 1.5% del valor

    // Ajuste por tipo de cobertura
    switch (datos.tipoSeguro) {
      case 'todo-riesgo':
        prima *= 1.0;
        break;
      case 'premium':
        prima *= 1.3;
        break;
      case 'responsabilidad-civil':
        prima *= 0.4;
        break;
      case 'basico':
        prima *= 0.6;
        break;
      default:
        prima *= 1.0;
        break;
    }

    // Ajuste por edad
    const edad = parseInt(datos.edad);
    if (edad < 25) prima *= 1.4;
    else if (edad > 65) prima *= 1.2;

    // Ajuste por experiencia
    switch (datos.añosLicencia) {
      case 'menos-1':
        prima *= 1.5;
        break;
      case '1-3':
        prima *= 1.2;
        break;
      case '4-7':
        prima *= 1.0;
        break;
      case '8-15':
        prima *= 0.9;
        break;
      case 'mas-15':
        prima *= 0.8;
        break;
      default:
        prima *= 1.0;
        break;
    }

    // Ajuste por historial
    switch (datos.historialSiniestros) {
      case 'sin-siniestros':
        prima *= 0.9;
        break;
      case '1-siniestro':
        prima *= 1.2;
        break;
      case '2-siniestros':
        prima *= 1.5;
        break;
      case 'mas-siniestros':
        prima *= 2.0;
        break;
      default:
        prima *= 1.0;
        break;
    }

    // Ajuste por deducible
    const deducible = parseInt(datos.deducible);
    if (deducible >= 1500) prima *= 0.85;
    else if (deducible >= 1000) prima *= 0.9;
    else if (deducible >= 750) prima *= 0.95;

    // Ajustes por factores de riesgo (sin ubicación)
    
    // Ajuste por uso principal del vehículo
    switch (datos.usoPrincipal) {
      case 'personal':
        prima *= 1.0; // Base
        break;
      case 'trabajo':
        prima *= 1.15; // Mayor riesgo por uso frecuente
        break;
      case 'trabajo-transporte-publico':
        prima *= 1.4; // Alto riesgo
        break;
      case 'trabajo-delivery':
        prima *= 1.3; // Alto riesgo
        break;
      case 'comercial':
        prima *= 1.25; // Riesgo comercial
        break;
      default:
        prima *= 1.0;
        break;
    }

    // Ajuste por kilómetros anuales
    switch (datos.kilometrosAnuales) {
      case 'menos-10000':
        prima *= 0.95; // Menos exposición
        break;
      case '10000-20000':
        prima *= 1.0; // Base
        break;
      case 'mas-20000':
        prima *= 1.2; // Mayor exposición
        break;
      default:
        prima *= 1.0;
        break;
    }

    // Ajuste por lugar de estacionamiento
    switch (datos.lugarEstacionamiento) {
      case 'garaje-privado':
        prima *= 0.9; // Más seguro
        break;
      case 'estacionamiento-techado':
        prima *= 0.95; // Relativamente seguro
        break;
      case 'calle':
        prima *= 1.15; // Mayor riesgo de robo/daños
        break;
      case 'estacionamiento-empresarial':
        prima *= 0.92; // Seguro con vigilancia
        break;
      default:
        prima *= 1.0;
        break;
    }

    return Math.round(prima);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.nombreCompleto || !formData.telefono || !formData.marca || 
        !formData.modelo || !formData.año || !formData.placa || !formData.valorVehiculo || 
        !formData.edad || !formData.añosLicencia) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    // Calcular prima
    const primaMensual = calcularPrima(formData);
    const primaAnual = primaMensual * 12;

    // Crear solicitud
    const codigoSolicitud = `COT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const nuevaSolicitud = {
      id: codigoSolicitud,
      nombreCompleto: formData.nombreCompleto,
      telefono: formData.telefono,
      email: formData.email,
      marca: formData.marca,
      modelo: formData.modelo,
      año: formData.año,
      placa: formData.placa.toUpperCase(),
      valorVehiculo: parseInt(formData.valorVehiculo).toLocaleString(),
      deducible: parseInt(formData.deducible),
      edadConductor: formData.edad,
      añosLicencia: formData.añosLicencia,
      historialSiniestros: formData.historialSiniestros,
      cobertura: getCoberturaTexto(formData.tipoSeguro),
      primaMensual: primaMensual.toLocaleString(),
      primaAnual: primaAnual.toLocaleString(),
      // Campos de evaluación de riesgo (sin ubicación)
      usoPrincipal: formData.usoPrincipal,
      kilometrosAnuales: formData.kilometrosAnuales,
      lugarEstacionamiento: formData.lugarEstacionamiento,
      estado: 'pendiente',
      fechaSolicitud: new Date().toISOString().split('T')[0],
      clienteId: currentUser?.id || `CLI-${Date.now()}`,
      clienteName: currentUser?.name || formData.nombreCompleto
    };

    // Guardar en localStorage
    const cotizacionesExistentes = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    cotizacionesExistentes.push(nuevaSolicitud);
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesExistentes));

    // Mostrar resultado y limpiar formulario
    alert(`✅ Solicitud enviada exitosamente!\n\nPrima mensual estimada: $${primaMensual.toLocaleString()}\nPrima anual: $${primaAnual.toLocaleString()}\n\nRecibirá una respuesta en las próximas 24 horas.`);
    
    setFormData({
      tipoSeguro: 'todo-riesgo',
      marca: '',
      modelo: '',
      año: '',
      placa: '',
      valorVehiculo: '',
      deducible: '750',
      edad: '',
      historialSiniestros: 'sin-siniestros',
      añosLicencia: '',
      nombreCompleto: '',
      telefono: '',
      email: '',
      // Reset de campos (sin ubicación)
      usoPrincipal: 'personal',
      kilometrosAnuales: 'menos-10000',
      lugarEstacionamiento: 'garaje-privado'
    });

    setActiveTab('lista');
  };

  const getCoberturaTexto = (tipo) => {
    switch (tipo) {
      case 'todo-riesgo':
        return 'Todo Riesgo';
      case 'premium':
        return 'Todo Riesgo Premium';
      case 'responsabilidad-civil':
        return 'Responsabilidad Civil';
      case 'basico':
        return 'Seguro Básico';
      default:
        return tipo;
    }
  };

  const handleApprove = (solicitud) => {
    // Crear póliza automáticamente cuando se aprueba
    const numeroPoliza = `POL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const nuevaPoliza = {
      numeroPoliza: numeroPoliza,
      titular: solicitud.nombreCompleto,
      clienteId: solicitud.clienteId,
      tipoSeguro: solicitud.cobertura,
      vehiculo: `${solicitud.marca} ${solicitud.modelo} ${solicitud.año}`,
      placa: solicitud.placa,
      prima: parseFloat(solicitud.primaMensual.replace(/,/g, '')),
      vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estado: 'Activa',
      telefono: solicitud.telefono,
      cobertura: solicitud.cobertura,
      deducible: solicitud.deducible || 750,
      fechaCreacion: new Date().toISOString().split('T')[0],
      solicitudId: solicitud.id
    };

    // Guardar póliza en localStorage
    const polizasExistentes = JSON.parse(localStorage.getItem('polizas') || '[]');
    const nuevasPolizas = [...polizasExistentes, nuevaPoliza];
    localStorage.setItem('polizas', JSON.stringify(nuevasPolizas));

    // Actualizar estado de la cotización en localStorage
    const todasCotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionesActualizadas = todasCotizaciones.map(cot => 
      cot.id === solicitud.id ? {...cot, estado: 'aprobada', fechaAprobacion: new Date().toISOString().split('T')[0], numeroPoliza: numeroPoliza} : cot
    );
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesActualizadas));
    
    // Actualizar estado local
    setCotizaciones(cotizacionesActualizadas);
    
    alert(`✅ Cotización aprobada y póliza ${numeroPoliza} creada para ${solicitud.nombreCompleto}`);
  };

  const handleReject = (solicitud, motivo = '') => {
    const motivoRechazo = motivo || window.prompt('Motivo del rechazo (opcional):') || 'No especificado';
    
    // Actualizar estado en localStorage  
    const todasCotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
    const cotizacionesActualizadas = todasCotizaciones.map(cot => 
      cot.id === solicitud.id ? {...cot, estado: 'rechazada', fechaRechazo: new Date().toISOString().split('T')[0], motivoRechazo} : cot
    );
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesActualizadas));
    
    // Actualizar estado local
    setCotizaciones(cotizacionesActualizadas);
    
    alert(`❌ Cotización rechazada para ${solicitud.nombreCompleto}`);
  };

  const verDetalleSolicitud = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
  };

  const filteredCotizaciones = cotizaciones.filter(cot => {
    const matchesSearch = cot.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.nombreCompleto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cot.placa?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Si es cliente, solo ver sus propias cotizaciones
    if (permissions?.isCliente && currentUser) {
      return matchesSearch && (cot.clienteId === currentUser.id || 
                              cot.nombreCompleto === currentUser.name);
    }
    
    // Si es admin, ve todas las cotizaciones
    return matchesSearch;
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'aprobada': return '#2d5016';
      case 'pendiente': return '#b7541a';
      case 'rechazada': return '#991b1b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'aprobada': return <CheckCircle className="w-4 h-4" />;
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'rechazada': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'aprobada': return 'Aprobada';
      case 'pendiente': return 'Pendiente';
      case 'rechazada': return 'Rechazada';
      default: return estado;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg mr-4" style={{backgroundColor: '#e6eef7'}}>
              <Calculator className="w-6 h-6" style={{color: '#1e3a72'}} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cotizaciones Vehiculares</h2>
              <p className="text-gray-600">
                {permissions?.isAdmin ? 'Gestiona todas las cotizaciones de seguros vehiculares' : 'Solicita y revisa tus cotizaciones de seguros para vehículos'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            {permissions?.canRequestCotizaciones && (
              <button 
                onClick={() => setActiveTab('crear')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Solicitar Cotización
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('lista')}
            className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'lista' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Cotizaciones
          </button>
          {permissions?.canRequestCotizaciones && (
            <button
              onClick={() => setActiveTab('crear')}
              className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'crear' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Solicitar Cotización
            </button>
          )}
        </div>
      </div>

      {activeTab === 'lista' ? (
        <div className="space-y-6">
          {/* Búsqueda y filtros */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente, vehículo o placa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Lista de cotizaciones */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitud
                    </th>
                    {permissions?.isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobertura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prima Mensual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCotizaciones.map((cotizacion) => (
                    <tr key={cotizacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{cotizacion.id}</div>
                          <div className="text-sm text-gray-500">Solicitud: {cotizacion.fechaSolicitud}</div>
                        </div>
                      </td>
                      {permissions?.isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{cotizacion.nombreCompleto}</div>
                              <div className="text-sm text-gray-500">{cotizacion.telefono}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{cotizacion.marca} {cotizacion.modelo} {cotizacion.año}</div>
                            <div className="text-sm text-gray-500">{cotizacion.placa}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{cotizacion.cobertura}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">${cotizacion.primaMensual}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{backgroundColor: getStatusColor(cotizacion.estado)}}
                        >
                          {getStatusIcon(cotizacion.estado)}
                          <span className="ml-1">{getStatusText(cotizacion.estado)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => verDetalleSolicitud(cotizacion)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {permissions?.isAdmin && cotizacion.estado === 'pendiente' && (
                            <>
                              <button 
                                onClick={() => handleApprove(cotizacion)}
                                className="text-green-600 hover:text-green-900 transition-colors"
                                title="Aprobar cotización"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleReject(cotizacion)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Rechazar cotización"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCotizaciones.length === 0 && (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cotizaciones</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con un término de búsqueda diferente' : 
                   permissions?.isAdmin ? 'Las cotizaciones aparecerán aquí cuando los clientes las soliciten' : 
                   'Solicita tu primera cotización'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : permissions?.canRequestCotizaciones ? (
        /* Formulario de solicitud - Solo para clientes */
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Solicitar Cotización de Seguro Vehicular
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    placeholder="Nombre y apellidos completos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 8888-8888"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico (Opcional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Información del Vehículo */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Vehículo</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cobertura Vehicular *
                  </label>
                  <select
                    name="tipoSeguro"
                    value={formData.tipoSeguro}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="todo-riesgo">Todo Riesgo</option>
                    <option value="responsabilidad-civil">Responsabilidad Civil</option>
                    <option value="basico">Seguro Básico</option>
                    <option value="premium">Todo Riesgo Premium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca del Vehículo *
                  </label>
                  <select
                    name="marca"
                    value={formData.marca}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccione marca</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Mazda">Mazda</option>
                    <option value="Chevrolet">Chevrolet</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Kia">Kia</option>
                    <option value="Ford">Ford</option>
                    <option value="Mitsubishi">Mitsubishi</option>
                    <option value="Suzuki">Suzuki</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo del Vehículo *
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleInputChange}
                    placeholder="Ej: Corolla, Civic, Sentra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año del Vehículo *
                  </label>
                  <select
                    name="año"
                    value={formData.año}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccione año</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placa del Vehículo *
                  </label>
                  <input
                    type="text"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    placeholder="Ej: ABC-123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Comercial del Vehículo ($) *
                  </label>
                  <input
                    type="number"
                    name="valorVehiculo"
                    value={formData.valorVehiculo}
                    onChange={handleInputChange}
                    placeholder="Ej: 25000"
                    min="2500"
                    max="1000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Valor actual de mercado del vehículo en dólares</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deducible Preferido
                  </label>
                  <select
                    name="deducible"
                    value={formData.deducible}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="500">$500 (Prima más alta)</option>
                    <option value="750">$750 (Recomendado)</option>
                    <option value="1000">$1,000</option>
                    <option value="1500">$1,500 (Prima más baja)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información del Conductor */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Conductor Principal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad del Conductor Principal *
                  </label>
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleInputChange}
                    placeholder="Edad en años"
                    min="18"
                    max="80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Años con Licencia de Conducir *
                  </label>
                  <select
                    name="añosLicencia"
                    value={formData.añosLicencia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccione experiencia</option>
                    <option value="menos-1">Menos de 1 año</option>
                    <option value="1-3">1 a 3 años</option>
                    <option value="4-7">4 a 7 años</option>
                    <option value="8-15">8 a 15 años</option>
                    <option value="mas-15">Más de 15 años</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Historial de Accidentes/Siniestros
                  </label>
                  <select
                    name="historialSiniestros"
                    value={formData.historialSiniestros}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sin-siniestros">Sin accidentes/siniestros</option>
                    <option value="1-siniestro">1 accidente en los últimos 5 años</option>
                    <option value="2-siniestros">2 accidentes en los últimos 5 años</option>
                    <option value="mas-siniestros">Más de 2 accidentes</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Un historial limpio de conducción reduce significativamente la prima</p>
                </div>
              </div>
            </div>

            {/* Factores de Riesgo Adicionales (sin ubicación) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Factores de Riesgo Adicionales 
                <span className="text-sm font-normal text-gray-600 ml-2">(Para un cálculo más preciso)</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Uso Principal del Vehículo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Uso Principal del Vehículo *
                  </label>
                  <select
                    name="usoPrincipal"
                    value={formData.usoPrincipal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="personal">Personal/Familiar</option>
                    <option value="trabajo">Trabajo (general)</option>
                    <option value="trabajo-transporte-publico">Trabajo - Transporte Público</option>
                    <option value="trabajo-delivery">Trabajo - Delivery/Reparto</option>
                    <option value="comercial">Comercial</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">El uso comercial o de trabajo aumenta el riesgo</p>
                </div>

                {/* Kilómetros Anuales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kilómetros Anuales Estimados *
                  </label>
                  <select
                    name="kilometrosAnuales"
                    value={formData.kilometrosAnuales}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="menos-10000">Menos de 10,000 km</option>
                    <option value="10000-20000">10,000 - 20,000 km</option>
                    <option value="mas-20000">Más de 20,000 km</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Mayor kilometraje = mayor exposición a riesgos</p>
                </div>

                {/* Lugar de Estacionamiento */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Dónde se Estaciona Habitualmente? *
                  </label>
                  <select
                    name="lugarEstacionamiento"
                    value={formData.lugarEstacionamiento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="garaje-privado">Garaje privado</option>
                    <option value="estacionamiento-techado">Estacionamiento público techado</option>
                    <option value="calle">Calle</option>
                    <option value="estacionamiento-empresarial">Estacionamiento empresarial</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Estacionamientos seguros reducen el riesgo de robo y daños</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('lista')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Enviar Solicitud de Cotización
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Modal de Detalles de la Solicitud */}
      {solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Detalles de la Cotización
                </h3>
                <button
                  onClick={() => setSolicitudSeleccionada(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Estado y ID */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Código de Cotización</p>
                    <p className="font-medium">{solicitudSeleccionada.id}</p>
                  </div>
                  <div>
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{backgroundColor: getStatusColor(solicitudSeleccionada.estado)}}
                    >
                      {getStatusIcon(solicitudSeleccionada.estado)}
                      <span className="ml-2">{getStatusText(solicitudSeleccionada.estado)}</span>
                    </span>
                  </div>
                </div>

                {/* Información Personal */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Información Personal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre Completo</p>
                      <p className="font-medium">{solicitudSeleccionada.nombreCompleto}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {solicitudSeleccionada.telefono}
                      </p>
                    </div>
                    {solicitudSeleccionada.email && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Correo Electrónico</p>
                        <p className="font-medium flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {solicitudSeleccionada.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del Vehículo */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Car className="w-5 h-5 mr-2" />
                    Información del Vehículo
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Vehículo</p>
                      <p className="font-medium">{solicitudSeleccionada.marca} {solicitudSeleccionada.modelo} {solicitudSeleccionada.año}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Placa</p>
                      <p className="font-medium">{solicitudSeleccionada.placa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor del Vehículo</p>
                      <p className="font-medium">${solicitudSeleccionada.valorVehiculo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Deducible</p>
                      <p className="font-medium">${solicitudSeleccionada.deducible?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Conductor */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Información del Conductor
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Edad</p>
                      <p className="font-medium">{solicitudSeleccionada.edadConductor} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Años con Licencia</p>
                      <p className="font-medium">{solicitudSeleccionada.añosLicencia}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Historial</p>
                      <p className="font-medium">{solicitudSeleccionada.historialSiniestros}</p>
                    </div>
                  </div>
                </div>

                {/* Factores de Riesgo Adicionales */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    Factores de Riesgo Evaluados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700">Uso Principal</p>
                      <p className="font-medium text-blue-900">
                        {(() => {
                          const usoTexto = {
                            'personal': 'Personal/Familiar',
                            'trabajo': 'Trabajo (general)',
                            'trabajo-transporte-publico': 'Trabajo - Transporte Público',
                            'trabajo-delivery': 'Trabajo - Delivery/Reparto',
                            'comercial': 'Comercial'
                          };
                          return usoTexto[solicitudSeleccionada.usoPrincipal] || solicitudSeleccionada.usoPrincipal || 'No especificado';
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Kilómetros Anuales</p>
                      <p className="font-medium text-blue-900">
                        {(() => {
                          const kmTexto = {
                            'menos-10000': 'Menos de 10,000 km',
                            '10000-20000': '10,000 - 20,000 km',
                            'mas-20000': 'Más de 20,000 km'
                          };
                          return kmTexto[solicitudSeleccionada.kilometrosAnuales] || solicitudSeleccionada.kilometrosAnuales || 'No especificado';
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Lugar de Estacionamiento</p>
                      <p className="font-medium text-blue-900">
                        {(() => {
                          const estacionamientoTexto = {
                            'garaje-privado': 'Garaje privado',
                            'estacionamiento-techado': 'Estacionamiento público techado',
                            'calle': 'Calle',
                            'estacionamiento-empresarial': 'Estacionamiento empresarial'
                          };
                          return estacionamientoTexto[solicitudSeleccionada.lugarEstacionamiento] || solicitudSeleccionada.lugarEstacionamiento || 'No especificado';
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Ubicación Principal</p>
                      <p className="font-medium text-blue-900">{solicitudSeleccionada.ubicacionUso || 'No especificado'}</p>
                    </div>
                  </div>
                </div>

                {/* Información de la Cotización */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Cotización
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-green-700">Cobertura</p>
                      <p className="font-semibold text-green-900">{solicitudSeleccionada.cobertura}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Prima Mensual</p>
                      <p className="font-semibold text-green-900">${solicitudSeleccionada.primaMensual}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-700">Prima Anual</p>
                      <p className="font-semibold text-green-900">${solicitudSeleccionada.primaAnual}</p>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Historial
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha de Solicitud:</span>
                      <span className="font-medium">{solicitudSeleccionada.fechaSolicitud}</span>
                    </div>
                    {solicitudSeleccionada.fechaAprobacion && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha de Aprobación:</span>
                        <span className="font-medium text-green-600">{solicitudSeleccionada.fechaAprobacion}</span>
                      </div>
                    )}
                    {solicitudSeleccionada.fechaRechazo && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fecha de Rechazo:</span>
                        <span className="font-medium text-red-600">{solicitudSeleccionada.fechaRechazo}</span>
                      </div>
                    )}
                    {solicitudSeleccionada.motivoRechazo && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-700">
                          <strong>Motivo del rechazo:</strong> {solicitudSeleccionada.motivoRechazo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción para admin */}
                {permissions?.isAdmin && solicitudSeleccionada.estado === 'pendiente' && (
                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove(solicitudSeleccionada);
                        setSolicitudSeleccionada(null);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprobar Cotización
                    </button>
                    <button
                      onClick={() => {
                        handleReject(solicitudSeleccionada);
                        setSolicitudSeleccionada(null);
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rechazar Cotización
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cotizaciones;